/**
 * Decorator to wait for a query to finish
 *
 * @param {*} _target
 * @param {string} _key
 * @param {*} descriptor
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function waitForQuery(_target: any, _key: string, descriptor: any) {
    const originalMethod = descriptor.value;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    descriptor.value = async function (...args: any[]) {
        const result = await originalMethod.apply(this, args);
        await result.promise;
        return result;
    };
}
