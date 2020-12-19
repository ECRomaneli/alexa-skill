import { Slot } from "ask-sdk-model";
import { AttributeType } from "../enums/Attributetype";
import { InputWrapper } from "./InputWrapper";
import { Collection } from "../utils/Types";
export declare class Data extends InputWrapper {
    private static EMPTY_DEFAULT_VALUE;
    private static EMPTY_SLOT;
    /**
     * Get slot value or undefined if not exists.
     * @param slotName Slot name.
     */
    slot(slotName: string): string;
    /**
     * Get all request slots.
     */
    getSlots(): Collection<Slot>;
    /**
     * Verify if specified slot exists.
     * @param slotName Slot name.
     */
    hasSlot(slotName: string): boolean;
    /**
     * Get slot value or, if not, the default value.
     * @param slotName Slot name.
     * @param defaultValue Default value.
     */
    getSlot(slotName: string, defaultValue?: any): Slot;
    /**
     * Get or set attribute.
     * @param attrName Attribute name.
     * @param value Attribute value or undefined.
     */
    requestAttr(attrName: string, value: any): this;
    /**
     * Get all attributes.
     */
    getRequestAttrs(): any;
    /**
     * Set a collection of attributes.
     * @param attrs Collection of attributes.
     */
    setRequestAttrs(attrs: Collection<any>): this;
    /**
     * Verify if attribute exists.
     * @param attrName Attribute names.
     */
    hasRequestAttr(attrName: string[] | string): Collection<any> | false;
    /**
     * Get attribute value or, if not, the default value.
     * @param attrName Attribute name.
     * @param defaultValue Default value.
     */
    getRequestAttr(attrName: string, defaultValue?: any): any;
    /**
     * Set attribute value.
     * @param attrName Attribute name.
     * @param value Attribute value.
     */
    setRequestAttr(attrName: string, value: any): this;
    /**
     * Get or set attribute.
     * @param attrName Attribute name.
     * @param value Attribute value or undefined.
     */
    sessionAttr(attrName: string, value: any): this;
    /**
     * Get all attributes.
     */
    getSessionAttrs(): any;
    /**
     * Set a collection of attributes.
     * @param attrs Collection of attributes.
     */
    setSessionAttrs(attrs: Collection<any>): this;
    /**
     * Verify if attribute exists.
     * @param attrName Attribute names.
     */
    hasSessionAttr(attrName: string[] | string): Collection<any> | false;
    /**
     * Get attribute value or, if not, the default value.
     * @param attrName Attribute name.
     * @param defaultValue Default value.
     */
    getSessionAttr(attrName: string, defaultValue?: any): any;
    /**
     * Set attribute value.
     * @param attrName Attribute name.
     * @param value Attribute value.
     */
    setSessionAttr(attrName: string, value: any): this;
    /**
     * Get or set attribute.
     * @param attrName Attribute name.
     * @param value Attribute value or undefined.
     */
    persistentAttr(attrName: string, value: any): this;
    persistentAttr(attrName: string): any;
    /**
     * Get all attributes.
     */
    getPersistentAttrs(): Promise<Collection<any>>;
    /**
     * Set a collection of attributes.
     * @param attrs Collection of attributes.
     */
    setPersistentAttrs(attrs: Collection<any>): this;
    /**
     * Verify if attribute exists.
     * @param attrName Attribute names.
     */
    hasPersistentAttr(attrName: string[] | string): Promise<Collection<any> | false>;
    /**
     * Get attribute value or, if not, the default value.
     * @param attrName Attribute name.
     * @param defaultValue Default value.
     */
    getPersistentAttr(attrName: string, defaultValue?: any): Promise<any>;
    /**
     * Set attribute value.
     * @param attrName Attribute name.
     * @param value Attribute value.
     */
    setPersistentAttr(attrName: string, value: any): this;
    /**
     * Save persistent attribute.
     */
    savePersistentAttrs(): Promise<void>;
    /**
     * Get or set attribute.
     * @param attrName Attribute name.
     * @param value Attribute value or undefined.
     */
    attr(type: AttributeType, attrName: string, value: any): this;
    /**
     * Verify if attribute exists.
     * @param type Attribute type.
     * @param attrName Attribute names.
     * @param useSessionCache if attribute type is PERSISTENT, use or not session cache. Default false.
     */
    hasAttr(type: AttributeType.PERSISTENT, attrName: string[] | string, useSessionCache?: boolean): Promise<Collection<any> | false>;
    hasAttr(type: AttributeType, attrName: string[] | string): Collection<any> | false;
    /**
     * Get all attributes.
     * @param type Attribute type.
     * @param useSessionCache if attribute type is PERSISTENT, use or not session cache. Default false.
     */
    getAttrs(type: AttributeType.PERSISTENT, useSessionCache?: boolean): Promise<Collection<any>>;
    getAttrs(type: AttributeType): Collection<any>;
    /**
     * Get attribute value or, if not, the default value.
     * @param type Attribute type.
     * @param attrName Attribute name.
     * @param defaultValue Default value.
     * @param useSessionCache if attribute type is PERSISTENT, use or not session cache. Default false.
     */
    getAttr(type: AttributeType.PERSISTENT, attrName: string[] | string, defaultValue?: any, useSessionCache?: boolean): Promise<any>;
    getAttr(type: AttributeType, attrName: string, defaultValue?: any): any;
    /**
     * Set a collection of attributes.
     * @param type Attribute type.
     * @param attrs Collection of attributes.
     */
    setAttrs(type: AttributeType, attrs: Collection<any>): this;
    /**
     * Set attribute value.
     * @param type Attribute type.
     * @param attrName Attribute name.
     * @param value Attribute value.
     * @param useSessionCache if attribute type is PERSISTENT, use or not session cache. Default false.
     */
    setAttr(type: AttributeType, attrName: string, value: any, useSessionCache?: boolean): this;
    /**
     * Save slot as attribute.
     * @param type Attribute type.
     * @param slotName Slot name.
     */
    saveSlotsAsAttrs(type: AttributeType.PERSISTENT, slotName?: string[]): Promise<void>;
    saveSlotsAsAttrs(type: AttributeType, slotName?: string[]): void;
    /**
     * Swap the attributes from/to attribute.
     * @param fromType From type.
     * @param toType To type.
     * @param attrName Attributes or undefined.
     */
    swapAttrs(fromType: AttributeType, toType: AttributeType.PERSISTENT, attrName?: string[]): Promise<void>;
    swapAttrs(fromType: AttributeType.PERSISTENT, toType: AttributeType, attrName?: string[]): Promise<void>;
    swapAttrs(fromType: AttributeType, toType: AttributeType, attrName?: string[]): void;
    /**
     * Filter attributes. Return a new Collection.
     * @param attrs Collection of attributes.
     * @param attrNames Attributes to be filtered.
     */
    private filterAttr;
    /**
     * Get session user ID.
     */
    getUserId(): string;
    /**
     * Get context device ID.
     */
    getDeviceId(): string;
    /**
     * Replace slots and attributes into a string. From the most specific to the most generic.
     * @param str Raw string.
     */
    fulfillString(str: string): string;
}
