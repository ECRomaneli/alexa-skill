export type Relative<T> = T | Promise<T>;

export function toRelative<K, V>(relativeObj: Relative<K>, callback: (obj?: Relative<K>) => V): Relative<V> {
    return !(relativeObj instanceof Promise) ?
        callback(relativeObj) :
        (async () => {
            await relativeObj;
            return callback(relativeObj);
        })();
}