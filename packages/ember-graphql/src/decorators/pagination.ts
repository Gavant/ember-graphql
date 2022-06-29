export const defaultPaginationOptions = {
    offset: 0,
    limit: 20
};

/**
 * Paging function to handle loading more and checking if there are more to load after results are loaded
 *
 * @export
 * @param {{ data: string; hasMore: string }} keys
 * @return {*}
 */
export function pagination(keys: { data: string; hasMore: string; limit?: string }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (this: any, _target: any, _key: string | symbol, descriptor: PropertyDescriptor) {
        const childFunction = descriptor.value;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        descriptor.value = async function (this: any, ...args: any[]) {
            const splitTarget = keys.data.split('.');
            const queryResult = splitTarget.reduce((prev, curr) => prev && prev[curr], this);
            const limit = (keys.limit && this[keys.limit]) ?? defaultPaginationOptions.limit;

            if (queryResult) {
                const param = {
                    variables: {
                        paging: { limit, offset: queryResult.length }
                    }
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } as any;
                const result = await childFunction.apply(this, [param, ...args]);
                const hasMoreKey = splitTarget[splitTarget.length - 1];
                // TODO improve this to check `totalCount` meta field when available
                const hasMore = (result?.data?.[hasMoreKey]?.length ?? 0) >= limit;
                this[keys.hasMore] = hasMore;
            }
        };
        return descriptor;
    };
}
