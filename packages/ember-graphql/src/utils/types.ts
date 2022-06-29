export type Modify<T, R> = Omit<T, keyof R> & R;
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;

/**
 * Generic type guard
 *
 * @template T
 * @param {*} itemToCheck
 * @param {(Array<keyof T> | keyof T)} propertyNames
 * @returns {itemToCheck is T}
 */
export const guard = <T>(itemToCheck: any, propertyNames: Array<keyof T> | keyof T): itemToCheck is T => {
    return Array.isArray(propertyNames)
        ? Object.keys(itemToCheck as T).some((key) => propertyNames.indexOf(key as keyof T) >= 0)
        : (itemToCheck as T)[propertyNames as keyof T] !== undefined;
};
