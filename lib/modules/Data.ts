import { Slot } from "ask-sdk-model";
import { AttributeType } from "../enums/Attributetype";
import { Relative, toRelative } from "../utils/Response";
import { InputWrapper } from "./InputWrapper";
import { Collection } from "../utils/Types";

export class Data extends InputWrapper {
    private static EMPTY_DEFAULT_VALUE = void 0;
    private static EMPTY_SLOT = { value: Data.EMPTY_DEFAULT_VALUE };

    /* SLOTS */

    /**
     * Get slot value or undefined if not exists.
     * @param slotName Slot name.
     */
    public slot(slotName: string): string {
        return this.getSlot(slotName, Data.EMPTY_SLOT).value;
    }
    
    /**
     * Get all request slots.
     */
    public getSlots(/*safeReturn: boolean = true*/): Collection<Slot> {
        let intent = this.getIntent();
        if (intent === void 0) { return {}; }
        let slots = intent.slots;
        return slots/* || (safeReturn ? {} : void 0)*/;
    }

    /**
     * Verify if specified slot exists.
     * @param slotName Slot name.
     */
    public hasSlot(slotName: string): boolean {
        let slots: Collection<Slot> = this.getSlots();
        let slot = slots[slotName];
        // When slot is not recognized, '?' is returned
        return slot !== void 0 && slot.value !== '?';
    }

    /**
     * Get slot value or, if not, the default value.
     * @param slotName Slot name.
     * @param defaultValue Default value.
     */
    public getSlot(slotName: string, defaultValue?: any): Slot {
        return this.hasSlot(slotName) ? 
            this.getSlots()[slotName] : 
            defaultValue;
    }

    /* REQUEST ATTRIBUTES */

    /**
     * Get or set attribute.
     * @param attrName Attribute name.
     * @param value Attribute value or undefined.
     */
    public requestAttr(attrName: string, value: any): this;
    public requestAttr(attrName: string, value?: any): any {
        return this.attr(AttributeType.REQUEST, attrName, value);
    }

    /**
     * Get all attributes.
     */
    public getRequestAttrs(): any {
        return this.getAttrs(AttributeType.REQUEST);
    }

    /**
     * Set a collection of attributes.
     * @param attrs Collection of attributes.
     */
    public setRequestAttrs(attrs: Collection<any>): this {
        return this.setAttrs(AttributeType.REQUEST, attrs);
    }

    /**
     * Verify if attribute exists.
     * @param attrName Attribute names.
     */
    public hasRequestAttr(attrName: string[] | string): Collection<any> | false {
        return this.hasAttr(AttributeType.REQUEST, attrName);
    }

    /**
     * Get attribute value or, if not, the default value.
     * @param attrName Attribute name.
     * @param defaultValue Default value.
     */
    public getRequestAttr(attrName: string, defaultValue?: any) {
        return this.getAttr(AttributeType.REQUEST, attrName, defaultValue);
    }

    /**
     * Set attribute value.
     * @param attrName Attribute name.
     * @param value Attribute value.
     */
    public setRequestAttr(attrName: string, value: any): this {
        return this.setAttr(AttributeType.REQUEST, attrName, value);
    }

    /* SESSION ATTRIBUTES */

    /**
     * Get or set attribute.
     * @param attrName Attribute name.
     * @param value Attribute value or undefined.
     */
    public sessionAttr(attrName: string, value: any): this;
    public sessionAttr(attrName: string, value?: any): any {
        return this.attr(AttributeType.SESSION, attrName, value);
    }

    /**
     * Get all attributes.
     */
    public getSessionAttrs(): any {
        return this.getAttrs(AttributeType.SESSION);
    }

    /**
     * Set a collection of attributes.
     * @param attrs Collection of attributes.
     */
    public setSessionAttrs(attrs: Collection<any>): this {
        return this.setAttrs(AttributeType.SESSION, attrs);
    }

    /**
     * Verify if attribute exists.
     * @param attrName Attribute names.
     */
    public hasSessionAttr(attrName: string[] | string): Collection<any> | false {
        return this.hasAttr(AttributeType.SESSION, attrName);
    }

    /**
     * Get attribute value or, if not, the default value.
     * @param attrName Attribute name.
     * @param defaultValue Default value.
     */
    public getSessionAttr(attrName: string, defaultValue?: any) {
        return this.getAttr(AttributeType.SESSION, attrName, defaultValue);
    }

    /**
     * Set attribute value.
     * @param attrName Attribute name.
     * @param value Attribute value.
     */
    public setSessionAttr(attrName: string, value: any): this {
        return this.setAttr(AttributeType.SESSION, attrName, value);
    }

    /* PERSISTENT ATTRIBUTES */

    /**
     * Get or set attribute.
     * @param attrName Attribute name.
     * @param value Attribute value or undefined.
     */
    public persistentAttr(attrName: string, value: any): this;
    public persistentAttr(attrName: string): any;
    public persistentAttr(attrName: string, value?: any): any {
        return this.attr(AttributeType.PERSISTENT, attrName, value);
    }

    /**
     * Get all attributes.
     */
    public getPersistentAttrs(): Promise<Collection<any>> {
        return this.getAttrs(AttributeType.PERSISTENT);
    }

    /**
     * Set a collection of attributes.
     * @param attrs Collection of attributes.
     */
    public setPersistentAttrs(attrs: Collection<any>): this {
        return this.setAttrs(AttributeType.PERSISTENT, attrs);
    }

    /**
     * Verify if attribute exists.
     * @param attrName Attribute names.
     */
    public hasPersistentAttr(attrName: string[] | string): Promise<Collection<any> | false> {
        return this.hasAttr(AttributeType.PERSISTENT, attrName);
    }

    /**
     * Get attribute value or, if not, the default value.
     * @param attrName Attribute name.
     * @param defaultValue Default value.
     */
    public getPersistentAttr(attrName: string, defaultValue?: any) : Promise<any> {
        return this.getAttr(AttributeType.PERSISTENT, attrName, defaultValue);
    }

    /**
     * Set attribute value.
     * @param attrName Attribute name.
     * @param value Attribute value.
     */
    public setPersistentAttr(attrName: string, value: any): this {
        return this.setAttr(AttributeType.PERSISTENT, attrName, value);
    }

    /**
     * Save persistent attribute.
     */
    public async savePersistentAttrs() {
        return this.getAttributesManager().savePersistentAttributes();
    }

    /* GENERIC ATTRIBUTES */

    /**
     * Get or set attribute.
     * @param attrName Attribute name.
     * @param value Attribute value or undefined.
     */
    public attr(type: AttributeType, attrName: string, value: any): this;
    public attr(type: AttributeType, attrName: string, value?: any): any {
        if (value !== void 0) { 
            this.setAttr(type, attrName, value);
            return this;
        }
        return this.getAttr(type, attrName, Data.EMPTY_DEFAULT_VALUE);
    }

    /**
     * Verify if attribute exists.
     * @param type Attribute type.
     * @param attrName Attribute names.
     * @param useSessionCache if attribute type is PERSISTENT, use or not session cache. Default false.
     */
    public hasAttr(type: AttributeType.PERSISTENT, attrName: string[] | string, useSessionCache?: boolean): Promise<Collection<any> | false>;
    public hasAttr(type: AttributeType, attrName: string[] | string): Collection<any> | false;
    public hasAttr(type: AttributeType, attrName: string[] | string, useSessionCache?: boolean): Relative<Collection<any> | false> {
        return toRelative(this.getAttrs(<any> type, useSessionCache), (a) => {
            let arr = (attrName instanceof Array) ? attrName : [attrName];
            return arr.every((attrName) => a.hasOwnProperty(attrName)) ? a : false;
        });
    }

    /**
     * Get all attributes.
     * @param type Attribute type.
     * @param useSessionCache if attribute type is PERSISTENT, use or not session cache. Default false.
     */
    public getAttrs(type: AttributeType.PERSISTENT, useSessionCache?: boolean): Promise<Collection<any>>;
    public getAttrs(type: AttributeType): Collection<any>;
    public getAttrs(type: AttributeType, useSessionCache?: boolean): Relative<Collection<any>> {
        return this.getAttributesManager()['get' + type + 'Attributes'](useSessionCache) || {};
    }

    /**
     * Get attribute value or, if not, the default value.
     * @param type Attribute type.
     * @param attrName Attribute name.
     * @param defaultValue Default value.
     * @param useSessionCache if attribute type is PERSISTENT, use or not session cache. Default false.
     */
    public getAttr(type: AttributeType.PERSISTENT, attrName: string[] | string, defaultValue?: any, useSessionCache?: boolean): Promise<any>;
    public getAttr(type: AttributeType, attrName: string, defaultValue?: any): any;
    public getAttr(type: AttributeType, attrName: string, defaultValue?: any, useSessionCache?: boolean): Relative<any> {
        return toRelative(this.hasAttr(<any> type, attrName, useSessionCache), (a) => a ? a[attrName] : defaultValue);
    }

    /**
     * Set a collection of attributes.
     * @param type Attribute type.
     * @param attrs Collection of attributes.
     */
    public setAttrs(type: AttributeType, attrs: Collection<any>): this {
        this.getAttributesManager()["set" + type + "Attributes"](attrs);
        return this;
    }

    /**
     * Set attribute value.
     * @param type Attribute type.
     * @param attrName Attribute name.
     * @param value Attribute value.
     * @param useSessionCache if attribute type is PERSISTENT, use or not session cache. Default false.
     */
    public setAttr(type: AttributeType, attrName: string, value: any, useSessionCache?: boolean): this {
        let attrs: Collection<any> = this.getAttrs(<any> type, useSessionCache);
        attrs[attrName] = value;
        return this.setAttrs(type, attrs);
    }

    /**
     * Save slot as attribute.
     * @param type Attribute type.
     * @param slotName Slot name.
     */
    public saveSlotsAsAttrs(type: AttributeType.PERSISTENT, slotName?: string[]): Promise<void>;
    public saveSlotsAsAttrs(type: AttributeType, slotName?: string[]): void;
    public saveSlotsAsAttrs(type: AttributeType, slotNames?: string[]): Relative<void> {
        let attrs: Collection<any> = {};

        if (slotNames === void 0) {
            let slots: Collection<Slot> = this.getSlots();
            for (let slotName in slots) { attrs[slotName] = this.slot(slotName); }
        } else {
            if (slotNames.length === 0) { return; }
            slotNames.forEach((slotName) => attrs[slotName] = this.slot(slotName));
        }

        this.setAttrs(type, attrs);

        if (type === AttributeType.PERSISTENT) {
            return this.savePersistentAttrs();
        }
    }

    /**
     * Swap the attributes from/to attribute.
     * @param fromType From type.
     * @param toType To type.
     * @param attrName Attributes or undefined.
     */
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

    /**
     * Filter attributes. Return a new Collection.
     * @param attrs Collection of attributes.
     * @param attrNames Attributes to be filtered.
     */
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

    /* USER DATA */

    /**
     * Get session user ID.
     */
    public getUserId(): string {
        return this.getSession().user.userId;
    }

    /**
     * Get context device ID.
     */
    public getDeviceId(): string {
        return this.getContext().System.device.deviceId;
    }

    /* FULFILL STRING */

    /**
     * Replace slots and attributes into a string. From the most specific to the most generic.
     * @param str Raw string.
     */
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