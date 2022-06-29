import type { OperationVariables } from '@apollo/client/core';

import { QueryPositionalArgs } from 'glimmer-apollo';

import { useQuery } from './use-query';

/**
 * A simple helper for fetching a query once and "on-demand", (e.g. inside of a function block)
 * instead of initializing it on a separate property when it's parent/owner class is first
 * instantianted.
 *
 * Has the exact same signature as `useQuery()`, but returns a Promise instead which resolves
 * once the initial query call has completed.
 * @param context any
 * @param args () => QueryPositionalArgs<TData, TVariables>
 * @returns Promise<QueryResource<TData, DefaultQueryArgs>>
 */
export async function useAwaitedQuery<TData = unknown, TVariables = OperationVariables>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    context: any,
    args: () => QueryPositionalArgs<TData, TVariables>
) {
    const query = useQuery<TData, TVariables>(context, args);

    try {
        await query.promise;
        return query;
    } catch {
        return query;
    }
}
