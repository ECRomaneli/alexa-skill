export type TrueSkill = ($: typeof TrueSkill.Core) => void;

import AskCore = require('ask-sdk-core');
import { Intent, Request, RequestEnvelope, Response, Slot } from 'ask-sdk-model';

export function Skill(skillHandler: TrueSkill, builder: AskCore.CustomSkillBuilder = AskCore.SkillBuilders.custom()): AskCore.LambdaHandler {
    skillHandler.call(TrueSkill.Core, TrueSkill.Core, builder);
    builder.addRequestHandlers.apply(builder, TrueSkill.handlers);
    return builder.withCustomUserAgent('trueskill/app').lambda();
}

export enum AttributeType {
    REQUEST = 'Request', SESSION = 'Session', PERSISTENT = 'Persistent'
}

namespace TrueSkill {
    type Condition = () => boolean;
    type Map<K> = { [key: string]: K; };
    type Selector = { requestType: string, intentName?: string };

    type IntentHandler = (context?: Context, alexa?: Alexa) => void;
    type RequestHandler = (alexa: Alexa, data?: Data) => void;

    export const handlers: AskCore.RequestHandler[] = [];

    export class Core {
        static launch(handler: IntentHandler): void {
            this.on(RequestType.LaunchRequest.get(), handler);
        }

        static on(selector: string | Selector, handler: IntentHandler): void;
        static on(selector: string | Selector, options: IntentHandler | Object, handler?: IntentHandler): void {
            if (arguments.length < 3) {
                handler = <IntentHandler> options;
                options = {};
            }

            let context: Context;
  
            handlers.push({
                canHandle: (handlerInput) => {
                    context = new Context(handlerInput);

                    let s: Selector = RequestType.parseSelector(selector);
                    if (s.requestType !== context.getRequestType()
                    || (s.intentName !== void 0 && s.intentName !== context.getIntentName())) {
                        return false;
                    }

                    try { handler.call(context, context); }
                    catch (ex) { if (ex === ContextFoundException) { return true; } else { throw ex; } }
                    return false;
                },
                handle: (handlerInput) => {
                    let data: Data = new Data(handlerInput);
                    let alexa: Alexa = new Alexa(handlerInput, data);
                    context.getHandler().call(alexa, alexa, data);
                    return alexa.getResponse();
                }
            });
        }
    }

    abstract class InputWrapper {
        protected handlerInput: AskCore.HandlerInput;

        constructor (handlerInput: AskCore.HandlerInput) {
            this.handlerInput = handlerInput;
        }

        public getAttributesManager(): AskCore.AttributesManager {
            return this.handlerInput.attributesManager;
        }

        public getRequestEnvelope(): RequestEnvelope {
            return this.handlerInput.requestEnvelope;
        }

        public getRequest(): Request {
            return this.getRequestEnvelope().request;
        }

        public getIntent(): Intent {
            return  (<any> this.getRequest()).intent;
        }
    }

    class Context extends InputWrapper {
        public static ContextFoundException = "ContextFoundException";
        private data: Data = new Data(this.handlerInput);
        private eligibility: boolean = false;
        private invert: boolean = false;
        private handler: RequestHandler;

        private isEligible(): boolean {
            return !this.invert === this.eligibility;
        }

        public getHandler(): RequestHandler {
            return this.handler;
        }

        public not() : this {
            this.invert = !this.invert;
            return this;
        }

        public hasSlot(...slotNames: string[]): this {
            if (slotNames.length === 0) {
                this.eligibility = this.data.getSlots(false) !== void 0;
                return this;
            }

            this.eligibility = !slotNames.some((slotName) => !this.data.hasSlot(slotName));
            return this;
        }

        public hasSessionAttr(...attrNames: string[]): this {
            if (attrNames.length === 0) {
                this.eligibility = this.data.getSlots(false) !== void 0;
                return this;
            }

            this.eligibility = !attrNames.some((attrName) => !this.data.hasSessionAttr(attrName));
            return this;
        }
        

        public when(condition: Condition): this {
            this.eligibility = condition();
            return this;
        }

        public do(handler: RequestHandler): void {
            if (this.isEligible()) { this.default(handler); }
        }

        public default(handler: RequestHandler): void {
            this.handler = handler;
            throw Context.ContextFoundException;
        }

        public getRequestType(): string {
            return AskCore.getRequestType(this.getRequestEnvelope());
        }

        public getIntentName(): string {
            return AskCore.getIntentName(this.getRequestEnvelope());
        }
    }

    class Alexa extends InputWrapper {
        private responseBuilder: AskCore.ResponseBuilder = this.handlerInput.responseBuilder;
        private data: Data;

        constructor (handlerInput: AskCore.HandlerInput, data: Data = new Data(handlerInput)) {
            super(handlerInput);
            this.data = data;
        }

        public say(speechOutput: string, fulfillString: boolean = true): this {
            if (fulfillString) { speechOutput = this.data.fulfillString(speechOutput); }
            this.responseBuilder.speak(this.data.fulfillString(speechOutput));
            return this;
        }

        public ask(speechOutput: string, repromptSpeechOutput: string = speechOutput, fulfillString: boolean = true): this {
            if (fulfillString) {
                speechOutput = this.data.fulfillString(speechOutput);
                repromptSpeechOutput = this.data.fulfillString(repromptSpeechOutput);
            }
            this.responseBuilder.speak(speechOutput).reprompt(repromptSpeechOutput);
            return this;
        }

        public getResponse(): Response {
            return this.responseBuilder.getResponse();
        }
    }

    class Data extends InputWrapper {
        private static EMPTY_SLOT = { value: '' };

        /* SLOTS */

        public slot(slotName: string): string {
            return this.getSlot(slotName, Data.EMPTY_SLOT).value;
        }
        
        public getSlots(safeReturn: boolean = true): Map<Slot> {
            let slots = this.getIntent().slots;
            return slots || (safeReturn ? {} : void 0);
        }

        public hasSlot(slotName: string): boolean {
            let slots: Map<Slot> = this.getSlots();
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

        public getRequestAttrs(safeReturn?: boolean): any {
            return this.getAttrs(AttributeType.REQUEST, safeReturn);
        }

        public setRequestAttrs(attrs: Map<any>): this {
            return this.setAttrs(AttributeType.REQUEST, attrs);
        }

        public hasRequestAttr(attrName: string): boolean {
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

        public getSessionAttrs(safeReturn?: boolean): any {
            return this.getAttrs(AttributeType.SESSION, safeReturn);
        }

        public setSessionAttrs(attrs: Map<any>): this {
            return this.setAttrs(AttributeType.SESSION, attrs);
        }

        public hasSessionAttr(attrName: string): boolean {
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
        public persistentAttr(attrName: string, value?: any): any {
            return this.attr(AttributeType.PERSISTENT, attrName, value);
        }

        public getPersistentAttrs(safeReturn?: boolean): any {
            return this.getAttrs(AttributeType.PERSISTENT, safeReturn);
        }

        public setPersistentAttrs(attrs: Map<any>): this {
            return this.setAttrs(AttributeType.PERSISTENT, attrs);
        }

        public hasPersistentAttr(attrName: string): boolean {
            return this.hasAttr(AttributeType.PERSISTENT, attrName);
        }

        public getPersistentAttr(attrName: string, defaultValue?: any) {
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
            return this.getAttr(type, attrName, "");
        }

        public getAttrs(type: AttributeType, safeReturn: boolean = true): Map<any> {
            return this.getAttributesManager()['get' + type + 'Attributes']() || (safeReturn ? {} : void 0);
        }

        public hasAttr(type: AttributeType, attrName: string): boolean {
            return this.getAttrs(type, true).hasOwnProperty(attrName);
        }

        public getAttr(type: AttributeType, attrName: string, defaultValue?: any): any {
            return this.hasAttr(type, attrName) ? 
                this.getAttrs(type, false)[attrName] : 
                defaultValue;
        }

        public setAttr(type: AttributeType, attrName: string, value: any): this {
            let attrs: Map<any> = {};
            attrs[attrName] = value;
            return this.setAttrs(type, attrs);
        }

        public setAttrs(type: AttributeType, attrs: Map<any>): this {
            this.getAttributesManager()["set" + type + "Attributes"](attrs);
            return this;
        }

        public saveSlotsAsAttrs(slotName?: string[]): void;
        public saveSlotsAsAttrs(attrType: AttributeType, slotName?: string[]): void;
        public saveSlotsAsAttrs(attrTypeOrSlotName?: AttributeType | string[], slotNames?: string[]): void | Promise<void> {
            let type: AttributeType;

            if (arguments.length === 2) {
                type = <any> attrTypeOrSlotName;
            } else {
                type = AttributeType.REQUEST;
                slotNames = <any> attrTypeOrSlotName;
            }

            const slots: Map<Slot> = this.getSlots();

            let attrs: Map<any> = {};
            if (slotNames === void 0) {
                for (let slotName in slots) { attrs[slotName] = this.getSlot(slotName); }
            } else {
                if (slotNames.length === 0) { return; }
                slotNames.forEach((slotName) => attrs[slotName] = this.getSlot(slotName));
            }
            this.setAttrs(type, attrs);

            if (type === AttributeType.PERSISTENT) {
                return this.savePersistentAttrs();
            }
        }

        public swapAttrs(fromType: AttributeType, toType: AttributeType, attrNames?: string[]): void {
            const fromAttrs = this.getAttrs(fromType);
            
            let attrs: Map<any> = {};
            if (attrNames === void 0) {
                for (let slotName in fromAttrs) { attrs[slotName] = this.getSlot(slotName); }
            } else {
                if (attrNames.length === 0) { return; }
                attrNames.forEach((slotName) => attrs[slotName] = fromAttrs[slotName]);
            }

            this.setAttrs(toType, attrs);
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

    class RequestType {
        private static AllValues: { [name: string] : RequestType } = {};
    
        static readonly LaunchRequest = new RequestType(1, "LaunchRequest");
        static readonly IntentRequest = new RequestType(2, "IntentRequest");
    
        private constructor (public readonly id: number, public readonly value: string) {
            RequestType.AllValues[value] = this;
        }
    
        public static parseEnum(data: string): RequestType {
            return RequestType.AllValues[data.trim()];
        }

        public static parseSelector(rawSelector: Selector | string): Selector {
            if (typeof rawSelector !== 'string') { return rawSelector; }

            let splitted = rawSelector.replace(/\s/g, '').split(':');

            if (splitted.length == 1) {
                return {
                    requestType: RequestType.IntentRequest.value,
                    intentName: splitted[0]
                };
            }

            return {
                requestType: splitted[1],
                intentName: splitted[0].length ? splitted[0] : void 0
            };
        }

        public get(intentName?: string): Selector {
            return { requestType: this.value, intentName };
        }
    }
}