export function isEmptyObject(obj: Object): boolean {
    for ( let _n in obj ) { return false; }
    return true;
}