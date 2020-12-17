import { AttributeType } from "../enums/Attributetype";
import { Data } from "./Data";
import { InputWrapper } from "./InputWrapper";
import { Relative } from "../utils/Response";
import { Alexa } from './Alexa';
export declare type RequestHandler = (alexa: Alexa, data?: Data) => Relative<void>;
declare type Condition = () => Relative<boolean>;
export declare class Context extends InputWrapper {
    static NoRulesAcceptedException: string;
    private async;
    private data;
    private rules;
    not(): this;
    hasSlot(...slotNames: string[]): this;
    hasRequestAttr(...attrNames: string[]): this;
    hasSessionAttr(...attrNames: string[]): this;
    hasPersistentAttr(...attrNames: string[]): this;
    hasAttr(type: AttributeType, ...attrNames: string[]): this;
    private _hasAttr;
    when(condition: Condition): this;
    do(handler: RequestHandler): void;
    default(handler: RequestHandler): void;
    getHandler(): RequestHandler;
    getRequestType(): string;
    getIntentName(): string;
    resolve(): Relative<boolean>;
    private resolveRule;
    private createRule;
    private getCurrentRule;
}
export {};
