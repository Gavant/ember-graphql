import ApplicationInstance from '@ember/application/instance';
import { setClient } from 'glimmer-apollo';
import {
    ApolloClient,
    InMemoryCache,
    createHttpLink,
    from,
    ServerError,
    InMemoryCacheConfig,
    ApolloClientOptions,
    NormalizedCacheObject
} from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

import SessionService from 'ember-simple-auth/services/session';
import FastbootService from 'ember-cli-fastboot/services/fastboot';

import fetch from 'fetch';

import { guard } from './types';

const DEFAULT_SSR_FORCE_FETCH_DELAY = 100;

interface ApolloConfiguration {
    // the API url that all apollo requests will be made to (e.g. "https://my-cool-api.com/graphql")
    baseUri?: string;
    // configures general apollo client settings (e.g. client name/version header values, etc)
    client?: ApolloClientOptions<NormalizedCacheObject>;
    // configures apollo's caching behavior. most often this will be used to set custom field policies (for pagination, etc.)
    cache?: InMemoryCacheConfig;
}

/**
 * Glimmer Apollo client configuration
 *
 * @see https://glimmer-apollo.com/docs/getting-started#setup-the-client
 */
export function setupApolloClient(config: ApolloConfiguration) {
    return (context: ApplicationInstance) => {
        // http connection to the api
        // @see https://www.apollographql.com/docs/react/api/link/introduction/
        const httpLink = createHttpLink({
            uri: config.baseUri,
            fetch
        });

        // authentication headers
        // @see https://www.apollographql.com/docs/react/networking/authentication/
        const authLink = setContext((_, { headers }) => {
            const session = context.lookup('service:session') as SessionService;
            const token = session?.data?.authenticated?.access_token;
            const authData = { headers: headers ?? {} };

            if (token) {
                authData.headers.Authorization = `Bearer ${token}`;
            }

            return authData;
        });

        // global network error handling
        // @see https://www.apollographql.com/docs/react/api/link/apollo-link-error/
        const errorLink = onError((err) => {
            const { networkError } = err;

            if (networkError) {
                if (guard<ServerError>(networkError, 'statusCode') && networkError.statusCode === 401) {
                    const session = context.lookup('service:session') as SessionService;
                    if (session?.isAuthenticated) {
                        session?.invalidate?.();
                    }
                }
            }
        });

        // SSR mode
        // @see https://www.apollographql.com/docs/react/performance/server-side-rendering/#initializing-apollo-client
        const fastboot = context.lookup('service:fastboot') as FastbootService;
        const ssrMode = fastboot?.isFastBoot ?? false;

        // cache implementation
        // @see https://www.apollographql.com/docs/react/caching/cache-configuration/
        const cache = new InMemoryCache(config.cache);

        // create the apollo client
        const clientOptions = {
            cache,
            ssrMode,
            // `ssrForceFetchDelay` is a delay (in ms) on app boot before `fetchPolicy`'s that bypass
            // the cache (like `no-cache`, `network-only`, or `cache-and-network`) are applied. This
            // allows SSR cache rehydration to fufill even those queries directly from the cache
            // so that double/redundant fetches are avoided on client-side initialization
            // @see https://www.apollographql.com/docs/react/performance/server-side-rendering/#overriding-fetch-policies-during-initialization
            // TODO replace this timeout with logic in our useQuery() that checks if the initial page render is completed or not
            ssrForceFetchDelay: DEFAULT_SSR_FORCE_FETCH_DELAY,
            ...(config.client ?? {})
        };

        const apolloClient = new ApolloClient({
            link: from([errorLink, authLink, httpLink]),
            ...clientOptions
        });

        // set default apollo client for glimmer apollo
        setClient(context, apolloClient);
    };
}
