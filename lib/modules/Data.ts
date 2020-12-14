import { Slot } from "ask-sdk-model";
import { AttributeType } from "../enums/Attributetype";
import { Relative, toRelative } from "../utils/Response";
import { InputWrapper } from "./InputWrapper";
import { Collection } from "../utils/Types";

export class Data extends InputWrapper {
    private static EMPTY_DEFAULT_VALUE = void 0;
    private static EMPTY_SLOT = { value: Data.EMPTY_DEFAULT_VALUE };

    /* SLOTS */

    public slot(slotName: string): string {
        return this.getSlot(slotName, Data.EMPTY_SLOT).value;
    }
    
    public getSlots(/*safeReturn: boolean = true*/): Collection<Slot> {
        let slots = this.getIntent().slots;
        return slots/* || (safeReturn ? {} : void 0)*/;
    }

    public hasSlot(slotName: string): boolean {
        let slots: Collection<Slot> = this.getSlots();
        let slot = slots[slotName];
        // When slot is not recognized, '?' is returned
        return slot !== void 0 && slot.value !== '?';
    }

    public getSlot(slotName: string, defaultValue?: any): Slot {
        return this.hasSlot(slotName) ? 
            this.getSlots()[slotName] : 
            defaultValue;
    }

    /* REQUEST ATTRIBUTES */

    public requestAttr(attrName: string, value: any): this;
    public requestAttr(attrName: string, value?: any): any {
        return this.attr(AttributeType.REQUEST, attrName, value);
    }

    public getRequestAttrs(): any {
        return this.getAttrs(AttributeType.REQUEST);
    }

    public setRequestAttrs(attrs: Collection<any>): this {
        return this.setAttrs(AttributeType.REQUEST, attrs);
    }

    public hasRequestAttr(attrName: string[] | string): Collection<any> | false {
        return this.hasAttr(AttributeType.REQUEST, attrName);
    }

    public getRequestAttr(attrName: string, defaultValue?: any) {
        return this.getAttr(AttributeType.REQUEST, attrName, defaultValue);
    }

    public setRequestAttr(attrName: string, value: any): this {
        return this.setAttr(AttributeType.REQUEST, attrName, value);
    }

    /* SESSION ATTRIBUTES */

    public sessionAttr(attrName: string, value: any): this;
    public sessionAttr(attrName: string, value?: any): any {
        return this.attr(AttributeType.SESSION, attrName, value);
    }

    public getSessionAttrs(): any {
        return this.getAttrs(AttributeType.SESSION);
    }

    public setSessionAttrs(attrs: Collection<any>): this {
        return this.setAttrs(AttributeType.SESSION, attrs);
    }

    public hasSessionAttr(attrName: string[] | string): Collection<any> | false {
        return this.hasAttr(AttributeType.SESSION, attrName);
    }

    public getSessionAttr(attrName: string, defaultValue?: any) {
        return this.getAttr(AttributeType.SESSION, attrName, defaultValue);
    }

    public setSessionAttr(attrName: string, value: any): this {
        return this.setAttr(AttributeType.SESSION, attrName, value);
    }

    /* PERSISTENT ATTRIBUTES */

    public persistentAttr(attrName: string, value: any): this;
    public persistentAttr(attrName: string): any;
    public persistentAttr(attrName: string, value?: any): any {
        return this.attr(AttributeType.PERSISTENT, attrName, value);
    }

    public getPersistentAttrs(): Promise<Collection<any>> {
        return this.getAttrs(AttributeType.PERSISTENT);
    }

    public setPersistentAttrs(attrs: Collection<any>): this {
        return this.setAttrs(AttributeType.PERSISTENT, attrs);
    }

    public hasPersistentAttr(attrName: string[] | string): Promise<Collection<any> | false> {
        return this.hasAttr(AttributeType.PERSISTENT, attrName);
    }

    public getPersistentAttr(attrName: string, defaultValue?: any) : Promise<any> {
        return this.getAttr(AttributeType.PERSISTENT, attrName, defaultValue);
    }

    public setPersistentAttr(attrName: string, value: any): this {
        return this.setAttr(AttributeType.PERSISTENT, attrName, value);
    }

    public async savePersistentAttrs() {
        return this.getAttributesManager().savePersistentAttributes();
    }

    /* GENERIC ATTRIBUTES */

    public attr(type: AttributeType, attrName: string, value: any): this;
    public attr(type: AttributeType, attrName: string, value?: any): any {
        if (value !== void 0) { 
            this.setAttr(type, attrName, value);
            return this;
        }
        return this.getAttr(type, attrName, Data.EMPTY_DEFAULT_VALUE);
    }

    public getAttrs(type: AttributeType.PERSISTENT, useSessionCache?: boolean): Promise<Collection<any>>;
    public getAttrs(type: AttributeType): Collection<any>;
    public getAttrs(type: AttributeType, useSessionCache?: boolean): Relative<Collection<any>> {
        return this.getAttributesManager()['get' + type + 'Attributes'](useSessionCache) || {};
    }

    public hasAttr(type: AttributeType.PERSISTENT, attrName: string[] | string, useSessionCache?: boolean): Promise<Collection<any> | false>;
    public hasAttr(type: AttributeType, attrName: string[] | string): Collection<any> | false;
    public hasAttr(type: AttributeType, attrName: string[] | string, useSessionCache?: boolean): Relative<Collection<any> | false> {
        return toRelative(this.getAttrs(<any> type, useSessionCache), (a) => {
            let arr = (attrName instanceof Array) ? attrName : [attrName];
            return arr.every((attrName) => a.hasOwnProperty(attrName)) ? a : false;
        });
    }

    public getAttr(type: AttributeType.PERSISTENT, attrName: string[] | string, defaultValue?: any, useSessionCache?: boolean): Promise<any>;
    public getAttr(type: AttributeType, attrName: string, defaultValue?: any): any;
    public getAttr(type: AttributeType, attrName: string, defaultValue?: any, useSessionCache?: boolean): Relative<any> {
        return toRelative(this.hasAttr(<any> type, attrName, useSessionCache), (a) => a ? a[attrName] : defaultValue);
    }


    public setAttr(type: AttributeType, attrName: string, value: any, useSessionCache?: boolean): this {
        let attrs: Collection<any> = this.getAttrs(<any> type, useSessionCache);
        attrs[attrName] = value;
        return this.setAttrs(type, attrs);
    }

    public setAttrs(type: AttributeType, attrs: Collection<any>): this {
        this.getAttributesManager()["set" + type + "Attributes"](attrs);
        return this;
    }

    public saveSlotsAsAttrs(attrType: AttributeType.PERSISTENT, slotName?: string[]): Promise<void>;
    public saveSlotsAsAttrs(attrType: AttributeType, slotName?: string[]): void;
    public saveSlotsAsAttrs(attrType: AttributeType, slotNames?: string[]): Relative<void> {
        let attrs: Collection<any> = {};

        if (slotNames === void 0) {
            let slots: Collection<Slot> = this.getSlots();
            for (let slotName in slots) { attrs[slotName] = this.slot(slotName); }
        } else {
            if (slotNames.length === 0) { return; }
            slotNames.forEach((slotName) => attrs[slotName] = this.slot(slotName));
        }

        this.setAttrs(attrType, attrs);

        if (attrType === AttributeType.PERSISTENT) {
            return this.savePersistentAttrs();
        }
    }

    public swapAttrs(fromType: AttributeType, toType: AttributeType.PERSISTENT, attrName?: string[]): Promise<void>;
    public swapAttrs(fromType: AttributeType.PERSISTENT, toType: AttributeType, attrName?: string[]): Promise<void>;
    public swapAttrs(fromType: AttributeType, toType: AttributeType, attrName?: string[]): void;
    public swapAttrs(fromType: AttributeType, toType: AttributeType, attrNames?: string[]): Relative<void> {
        if (fromType === toType) { return; }

        let fromAttrs = this.getAttrs(fromType);

        if (fromAttrs instanceof Promise) {
            return (async () => {
                fromAttrs = await fromAttrs;
                this.setAttrs(toType, this.filterAttr(fromAttrs, attrNames));
                if (toType === AttributeType.PERSISTENT) {
                    await this.savePersistentAttrs();
                }
            })();
        }

        this.setAttrs(toType, this.filterAttr(fromAttrs, attrNames));
        if (toType === AttributeType.PERSISTENT) {
            return this.savePersistentAttrs();
        }
    }

    private filterAttr(attrs: Collection<any>, attrNames?: string[]) {
        let filteredArr: Collection<any> = {};

        if (attrNames === void 0) {
            for (let attrName in attrs) { filteredArr[attrName] = attrs[attrName]; }
        } else {
            if (attrNames.length === 0) { return filteredArr; }
            attrNames.forEach((attrName) => filteredArr[attrName] = attrs[attrName]);
        }

        return filteredArr;
    }

    /* FULFILL STRING */

    public fulfillString(str: string): string {
        return str.replace(/{{([^}]+)}}/g, (match, group) => {
            if (this.hasSlot(group)) { return this.slot(group); }
            if (this.hasRequestAttr(group)) { return this.getRequestAttr(group); }
            if (this.hasSessionAttr(group)) { return this.getSessionAttr(group); }
            if (this.hasPersistentAttr(group)) { return this.getPersistentAttr(group); }
            return match;
        });
    }
}