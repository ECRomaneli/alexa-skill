export declare type Relative<T> = T | Promise<T>;
export declare function toRelative<K, V>(relativeObj: Relative<K>, callback: (obj?: Relative<K>) => V): Relative<V>;
