export type TrueSkill = ($: typeof TrueSkill.Core) => void;

import AskCore = require('ask-sdk-core');
import { Intent, Request, RequestEnvelope, Response, Slot } from 'ask-sdk-model';

export function Skill(skillHandler: TrueSkill, builder: AskCore.CustomSkillBuilder = AskCore.SkillBuilders.custom()): AskCore.LambdaHandler {
    skillHandler.call(TrueSkill.Core, TrueSkill.Core);
    builder.addRequestHandlers.apply(builder, TrueSkill.handlers);
    return builder.withCustomUserAgent('trueskill/app').lambda();
}

namespace TrueSkill {
    type Condition = () => boolean;
    type Map<K> = { [key: string]: K; };
    type Selector = { requestType: string, intentName?: string };

    type IntentHandler = (context?: Context, alexa?: Alexa) => void;
    type RequestHandler = (alexa: Alexa, data?: Data) => void;

    const ContextFoundException = "ContextFoundException";

    export const handlers: AskCore.RequestHandler[] = [];

    export interface PersistenceAdapter {}

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

    class Data extends InputWrapper {
        public slot(slotName: string): string {
            return this.getSlot(slotName, {value: ""}).value;
        }

        public sessionAttr(attrName: string, value: any): this;
        public sessionAttr(attrName: string, value?: any): any {
            if (value !== void 0) { 
                this.setSessionAttr(attrName, value);
                return this;
            }
            return this.getSessionAttr(attrName, "");
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

        public getSessionAttrs(safeReturn: boolean = true): Object {
            return this.getAttributesManager().getSessionAttributes() || (safeReturn ? {} : void 0);
        }

        public hasSessionAttr(attrName: string): boolean {
            return this.getSessionAttrs().hasOwnProperty(attrName);
        }

        public getSessionAttr(attrName: string, defaultValue?: any) {
            return this.hasSessionAttr(attrName) ? 
                this.getSessionAttrs()[attrName] : 
                defaultValue;
        }

        public setSessionAttr(attrName: string, value: any): this {
            let attrs: Map<any> = {};
            attrs[attrName] = value;
            return this.setSessionAttrs(attrs);
        }

        public setSessionAttrs(sessionAttrs: Map<any>): this {
            this.getAttributesManager().setSessionAttributes(sessionAttrs);
            return this;
        }

        public fulfillString(str: string): string {
            return str.replace(/{{([^}]+)}}/g, (_match, group) => this.slot(group));
        }
    }

    class Context extends InputWrapper {
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
            throw ContextFoundException;
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