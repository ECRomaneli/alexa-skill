export declare type Skill = t$.Class;
export declare type TrueSkill = t$.Class;
export declare const Skill: typeof t$.TrueSkill;
export declare const TrueSkill: typeof t$.TrueSkill;
export declare namespace t$ {
    type SkillHandler = {
        canHandler: () => boolean;
        handler: () => Response | Promise<Response>;
    };
    type SkillTree = ArrayLike<SkillTree | SkillHandler>;
    type Class = TrueSkill;
    type ForEachIterator<T> = (keyOrIndex: any, value: T) => boolean | void;
    type ArrayLikeObject = PlainObject | ArrayLike<any>;
    type PlainObject = {
        [key: string]: any;
        length?: number;
    };
    const APP_NAME = "True Skill Framework";
    /**
     * TrueSkill Core.
     */
    class TrueSkill {
        static on(intentName: string, handler: Function): typeof TrueSkill;
        /**
         * Merge the contents of an object onto the mQuery prototype to provide new mQuery instance methods.
         * @param obj An object to merge onto the jQuery prototype.
         */
        extend(obj: Object): void;
    }
    const Class: typeof TrueSkill;
    const fn: TrueSkill;
    const prototype: TrueSkill;
    /**
     * A generic iterator function, which can be used to seamlessly iterate over both objects and arrays.
     * @param arr The array or array-like object to iterate over.
     * @param it The function that will be executed on every value.
     */
    function each(arr: ArrayLikeObject, it: ForEachIterator<any>): ArrayLikeObject;
    /**
     * Verify if object is array-like.
     * @param obj Object to be verified.
     */
    function isArrayLike(obj: any): boolean;
}
