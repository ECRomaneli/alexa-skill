"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Data = void 0;
const Attributetype_1 = require("../enums/Attributetype");
const Response_1 = require("../utils/Response");
const InputWrapper_1 = require("./InputWrapper");
class Data extends InputWrapper_1.InputWrapper {
    /* SLOTS */
    slot(slotName) {
        return this.getSlot(slotName, Data.EMPTY_SLOT).value;
    }
    getSlots( /*safeReturn: boolean = true*/) {
        let slots = this.getIntent().slots;
        return slots /* || (safeReturn ? {} : void 0)*/;
    }
    hasSlot(slotName) {
        let slots = this.getSlots();
        let slot = slots[slotName];
        // When slot is not recognized, '?' is returned
        return slot !== void 0 && slot.value !== '?';
    }
    getSlot(slotName, defaultValue) {
        return this.hasSlot(slotName) ?
            this.getSlots()[slotName] :
            defaultValue;
    }
    requestAttr(attrName, value) {
        return this.attr(Attributetype_1.AttributeType.REQUEST, attrName, value);
    }
    getRequestAttrs() {
        return this.getAttrs(Attributetype_1.AttributeType.REQUEST);
    }
    setRequestAttrs(attrs) {
        return this.setAttrs(Attributetype_1.AttributeType.REQUEST, attrs);
    }
    hasRequestAttr(attrName) {
        return this.hasAttr(Attributetype_1.AttributeType.REQUEST, attrName);
    }
    getRequestAttr(attrName, defaultValue) {
        return this.getAttr(Attributetype_1.AttributeType.REQUEST, attrName, defaultValue);
    }
    setRequestAttr(attrName, value) {
        return this.setAttr(Attributetype_1.AttributeType.REQUEST, attrName, value);
    }
    sessionAttr(attrName, value) {
        return this.attr(Attributetype_1.AttributeType.SESSION, attrName, value);
    }
    getSessionAttrs() {
        return this.getAttrs(Attributetype_1.AttributeType.SESSION);
    }
    setSessionAttrs(attrs) {
        return this.setAttrs(Attributetype_1.AttributeType.SESSION, attrs);
    }
    hasSessionAttr(attrName) {
        return this.hasAttr(Attributetype_1.AttributeType.SESSION, attrName);
    }
    getSessionAttr(attrName, defaultValue) {
        return this.getAttr(Attributetype_1.AttributeType.SESSION, attrName, defaultValue);
    }
    setSessionAttr(attrName, value) {
        return this.setAttr(Attributetype_1.AttributeType.SESSION, attrName, value);
    }
    persistentAttr(attrName, value) {
        return this.attr(Attributetype_1.AttributeType.PERSISTENT, attrName, value);
    }
    getPersistentAttrs() {
        return this.getAttrs(Attributetype_1.AttributeType.PERSISTENT);
    }
    setPersistentAttrs(attrs) {
        return this.setAttrs(Attributetype_1.AttributeType.PERSISTENT, attrs);
    }
    hasPersistentAttr(attrName) {
        return this.hasAttr(Attributetype_1.AttributeType.PERSISTENT, attrName);
    }
    getPersistentAttr(attrName, defaultValue) {
        return this.getAttr(Attributetype_1.AttributeType.PERSISTENT, attrName, defaultValue);
    }
    setPersistentAttr(attrName, value) {
        return this.setAttr(Attributetype_1.AttributeType.PERSISTENT, attrName, value);
    }
    savePersistentAttrs() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getAttributesManager().savePersistentAttributes();
        });
    }
    attr(type, attrName, value) {
        if (value !== void 0) {
            this.setAttr(type, attrName, value);
            return this;
        }
        return this.getAttr(type, attrName, Data.EMPTY_DEFAULT_VALUE);
    }
    getAttrs(type, useSessionCache) {
        return this.getAttributesManager()['get' + type + 'Attributes'](useSessionCache) || {};
    }
    hasAttr(type, attrName, useSessionCache) {
        return Response_1.toRelative(this.getAttrs(type, useSessionCache), (a) => {
            let arr = (attrName instanceof Array) ? attrName : [attrName];
            return arr.every((attrName) => a.hasOwnProperty(attrName)) ? a : false;
        });
    }
    getAttr(type, attrName, defaultValue, useSessionCache) {
        return Response_1.toRelative(this.hasAttr(type, attrName, useSessionCache), (a) => a ? a[attrName] : defaultValue);
    }
    setAttr(type, attrName, value, useSessionCache) {
        let attrs = this.getAttrs(type, useSessionCache);
        attrs[attrName] = value;
        return this.setAttrs(type, attrs);
    }
    setAttrs(type, attrs) {
        this.getAttributesManager()["set" + type + "Attributes"](attrs);
        return this;
    }
    saveSlotsAsAttrs(attrType, slotNames) {
        let attrs = {};
        if (slotNames === void 0) {
            let slots = this.getSlots();
            for (let slotName in slots) {
                attrs[slotName] = this.slot(slotName);
            }
        }
        else {
            if (slotNames.length === 0) {
                return;
            }
            slotNames.forEach((slotName) => attrs[slotName] = this.slot(slotName));
        }
        this.setAttrs(attrType, attrs);
        if (attrType === Attributetype_1.AttributeType.PERSISTENT) {
            return this.savePersistentAttrs();
        }
    }
    swapAttrs(fromType, toType, attrNames) {
        if (fromType === toType) {
            return;
        }
        let fromAttrs = this.getAttrs(fromType);
        if (fromAttrs instanceof Promise) {
            return (() => __awaiter(this, void 0, void 0, function* () {
                fromAttrs = yield fromAttrs;
                this.setAttrs(toType, this.filterAttr(fromAttrs, attrNames));
                if (toType === Attributetype_1.AttributeType.PERSISTENT) {
                    yield this.savePersistentAttrs();
                }
            }))();
        }
        this.setAttrs(toType, this.filterAttr(fromAttrs, attrNames));
        if (toType === Attributetype_1.AttributeType.PERSISTENT) {
            return this.savePersistentAttrs();
        }
    }
    filterAttr(attrs, attrNames) {
        let filteredArr = {};
        if (attrNames === void 0) {
            for (let attrName in attrs) {
                filteredArr[attrName] = attrs[attrName];
            }
        }
        else {
            if (attrNames.length === 0) {
                return filteredArr;
            }
            attrNames.forEach((attrName) => filteredArr[attrName] = attrs[attrName]);
        }
        return filteredArr;
    }
    /* FULFILL STRING */
    fulfillString(str) {
        return str.replace(/{{([^}]+)}}/g, (match, group) => {
            if (this.hasSlot(group)) {
                return this.slot(group);
            }
            if (this.hasRequestAttr(group)) {
                return this.getRequestAttr(group);
            }
            if (this.hasSessionAttr(group)) {
                return this.getSessionAttr(group);
            }
            if (this.hasPersistentAttr(group)) {
                return this.getPersistentAttr(group);
            }
            return match;
        });
    }
}
exports.Data = Data;
Data.EMPTY_DEFAULT_VALUE = void 0;
Data.EMPTY_SLOT = { value: Data.EMPTY_DEFAULT_VALUE };
