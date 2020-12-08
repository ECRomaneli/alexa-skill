// DEFINE GLOBAL TYPES
export type Skill = t$.Class;
export type TrueSkill = t$.Class;

// export function t$(onReady: Function): Skill;

export const Skill = t$.Class;
export const TrueSkill = t$.Class;

export namespace t$ {
    // Types
    export type SkillHandler = { canHandler: () => boolean, handler: () => Response | Promise<Response> };
    export type SkillTree = ArrayLike<SkillTree | SkillHandler>;

    export type Class = TrueSkill;
    export type ForEachIterator<T> = (keyOrIndex: any, value: T) => boolean | void;
    export type ArrayLikeObject = PlainObject | ArrayLike<any>;
    export type PlainObject = { [key: string]: any, length?: number };

    // mQuery constants
    export const APP_NAME = 'True Skill Framework';

    const HANDLERS: SkillTree = [];
    /**
     * TrueSkill Core.
     */
    export class TrueSkill {

        static on(intentName: string, handler: Function): typeof TrueSkill {

            return TrueSkill;
        }

        

        /**
         * Merge the contents of an object onto the mQuery prototype to provide new mQuery instance methods.
         * @param obj An object to merge onto the jQuery prototype.
         */
        public extend(obj: Object): void {
            each(obj, (key, value) => { fn[key] = value });
        }
    }

    
    export const Class = TrueSkill;
    export const fn = TrueSkill.prototype;
    export const prototype = fn;

    /* *** ============================  Utils  ============================ *** */

    /**
     * Verify if parameter is set (comparing with undefined).
     * NOTE: [], 0 and "" will return true.
     */
    function isSet(param: any): boolean {
        return !(param === void 0 || param === null);
    }

    /**
     * Verify if array-like object is empty
     */
    function isEmpty(arr: ArrayLike<any>): boolean {
        return !arr || !arr.length;
    }

    /**
     * A generic iterator function, which can be used to seamlessly iterate over both objects and arrays.
     * @param arr The array or array-like object to iterate over.
     * @param it The function that will be executed on every value.
     */
    export function each(arr: ArrayLikeObject, it: ForEachIterator<any>): ArrayLikeObject {
        if (isArrayLike(arr)) {
            let length = arr.length;
            for (let i = 0; i < length; i++) {
                if (it.call(arr[i], i, arr[i]) === false) { break }
            }
        } else {
            for (let key in arr) {
                if (it.call(arr[key], key, arr[key]) === false) { break }
            }
        }
        return arr;
    }

    /**
     * Verify if object is array-like.
     * @param obj Object to be verified.
     */
    export function isArrayLike(obj: any): boolean {
        if (typeOf(obj, 'array')) { return true }
        if (!obj || typeOf(obj, ['function', 'string', 'window'])) { return false }

        let length = obj.length;
        return typeof length === "number" && (length === 0 || (length > 0 && (length - 1) in obj));
    }

    /**
     * Verify the type of object passed and compare.
     */
    function typeOf(obj: any, types: string | string[]): boolean {
        let match = (typeof obj).toLowerCase(),
            some = (type: string) => match === type;

        if (Array.isArray(types)) { return types.some(some) }
        return some(types);
    }
}