import { FieldMergeFunction } from '@apollo/client/cache';

/**
 * generic cache merge function that should satisfy the needs of most paginated query field policies
 * it expects the query to have a paging.offset variable which it uses to merge the new results into
 * the correct spot of the list, rather than the more naive approach of just always appending incoming
 * results at the end of the array
 * @see https://www.apollographql.com/docs/react/pagination/core-api#merging-paginated-results
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const paginationMerge: FieldMergeFunction = (existing: any[], incoming: any[], options) => {
    const offset = options?.args?.paging?.offset ?? 0;
    const merged = existing ? existing.slice(0) : [];
    for (let i = 0; i < incoming.length; ++i) {
        merged[offset + i] = incoming[i];
    }
    return merged;
};
