import { FieldMergeFunction } from '@apollo/client/cache';

export interface PaginatedField {
    meta: {
        totalCount: number;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: any[];
}

/**
 * generic cache merge function that should satisfy the needs of most paginated query field policies
 * it expects the query to have a paging.offset variable which it uses to merge the new results into
 * the correct spot of the list, rather than the more naive approach of just always appending incoming
 * results at the end of the array
 * @see https://www.apollographql.com/docs/react/pagination/core-api#merging-paginated-results
 */
export const paginationMerge: FieldMergeFunction = (existing: PaginatedField, incoming: PaginatedField, options) => {
    const offset = options?.args?.paging?.offset ?? 0;
    const items = existing ? existing?.items.slice(0) : [];
    for (let i = 0; i < incoming?.items.length; ++i) {
        items[offset + i] = incoming?.items[i];
    }
    return { ...(existing ?? {}), ...(incoming ?? {}), items };
};
