import type { OperationVariables } from '@apollo/client/core';

import { QueryPositionalArgs, useQuery as apolloQuery } from 'glimmer-apollo';

import { InputMaybe } from './types';

export type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    // date with time (isoformat)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    DateTime: any;
};

export type Page = {
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
};

export type DefaultQueryArgs = OperationVariables & {
    variables?: {
        filters: unknown;
        paging?: InputMaybe<Page>;
        sort?: InputMaybe<Array<unknown>>;
    };
};

export const defaultQueryOptions = {
    // how the client handles responses that contain errors (default is 'none')
    // @see https://www.apollographql.com/docs/react/data/error-handling/#graphql-error-policies
    errorPolicy: 'all',
    // 'network-only' somewhat analogous to store.query's reload=true ('cache-first' is the default)
    // @see https://www.apollographql.com/docs/react/data/queries/#supported-fetch-policies
    fetchPolicy: 'cache-first',
    // allows you to react to updates to query resource properties like `loading`, `networkStatus` etc.
    // @see https://www.apollographql.com/docs/react/data/queries/#inspecting-loading-states
    notifyOnNetworkStatusChange: true,
    // enables running the query in server-side rendering/fastboot (this is the default value),
    // @see https://www.apollographql.com/docs/react/performance/server-side-rendering/#skipping-a-query
    ssr: true
};

/**
 * Wrapper for glimmer-apollo's `useQuery()`, applying default configs
 *
 * @param context any
 * @param args () => QueryPositionalArgs<TData, TVariables>
 * @returns QueryResource<TData, DefaultQueryArgs>
 */
export function useQuery<TData = unknown, TVariables = OperationVariables>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    context: any,
    args: () => QueryPositionalArgs<TData, TVariables>
) {
    const customArgs: () => QueryPositionalArgs<TData, TVariables> = function () {
        const passedArgs = args();
        const options = Object.assign({} as Partial<TVariables>, defaultQueryOptions, passedArgs[1]);
        return [passedArgs[0], options];
    };

    const graphqlQuery = apolloQuery<TData, DefaultQueryArgs>(
        context as unknown as Record<string, unknown>,
        customArgs
    );
    return graphqlQuery;
}
