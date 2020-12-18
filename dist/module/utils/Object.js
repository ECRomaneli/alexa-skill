"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmptyObject = void 0;
function isEmptyObject(obj) {
    for (let _n in obj) {
        return false;
    }
    return true;
}
exports.isEmptyObject = isEmptyObject;
