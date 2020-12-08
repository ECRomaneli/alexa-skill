"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.t$ = exports.TrueSkill = exports.Skill = void 0;
// export function t$(onReady: Function): Skill;
exports.Skill = t$.Class;
exports.TrueSkill = t$.Class;
var t$;
(function (t$) {
    // mQuery constants
    t$.APP_NAME = 'True Skill Framework';
    const HANDLERS = [];
    /**
     * TrueSkill Core.
     */
    class TrueSkill {
        static on(intentName, handler) {
            return TrueSkill;
        }
        /**
         * Merge the contents of an object onto the mQuery prototype to provide new mQuery instance methods.
         * @param obj An object to merge onto the jQuery prototype.
         */
        extend(obj) {
            each(obj, (key, value) => { t$.fn[key] = value; });
        }
    }
    t$.TrueSkill = TrueSkill;
    t$.Class = TrueSkill;
    t$.fn = TrueSkill.prototype;
    t$.prototype = t$.fn;
    /* *** ============================  Utils  ============================ *** */
    /**
     * Verify if parameter is set (comparing with undefined).
     * NOTE: [], 0 and "" will return true.
     */
    function isSet(param) {
        return !(param === void 0 || param === null);
    }
    /**
     * Verify if array-like object is empty
     */
    function isEmpty(arr) {
        return !arr || !arr.length;
    }
    /**
     * A generic iterator function, which can be used to seamlessly iterate over both objects and arrays.
     * @param arr The array or array-like object to iterate over.
     * @param it The function that will be executed on every value.
     */
    function each(arr, it) {
        if (isArrayLike(arr)) {
            let length = arr.length;
            for (let i = 0; i < length; i++) {
                if (it.call(arr[i], i, arr[i]) === false) {
                    break;
                }
            }
        }
        else {
            for (let key in arr) {
                if (it.call(arr[key], key, arr[key]) === false) {
                    break;
                }
            }
        }
        return arr;
    }
    t$.each = each;
    /**
     * Verify if object is array-like.
     * @param obj Object to be verified.
     */
    function isArrayLike(obj) {
        if (typeOf(obj, 'array')) {
            return true;
        }
        if (!obj || typeOf(obj, ['function', 'string', 'window'])) {
            return false;
        }
        let length = obj.length;
        return typeof length === "number" && (length === 0 || (length > 0 && (length - 1) in obj));
    }
    t$.isArrayLike = isArrayLike;
    /**
     * Verify the type of object passed and compare.
     */
    function typeOf(obj, types) {
        let match = (typeof obj).toLowerCase(), some = (type) => match === type;
        if (Array.isArray(types)) {
            return types.some(some);
        }
        return some(types);
    }
})(t$ = exports.t$ || (exports.t$ = {}));
