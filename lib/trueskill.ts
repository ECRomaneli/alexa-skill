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
    type ResponseHandler = (alexa?: Alexa) => void;
    

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

                    handler.call(context, context);
                    return context.isDone();
                },
                handle: (handlerInput) => {
                    let alexa: Alexa = new Alexa(handlerInput);
                    context.getHandler().call(alexa, alexa);
                    return alexa.getResponse();
                }
            });
        }
    }

    class InputWrapper {
        protected handlerInput: AskCore.HandlerInput;
        constructor (handlerInput: AskCore.HandlerInput) { this.handlerInput = handlerInput; }

        public slot(slotName: string): string {
            let slot: Slot = this.getSlot(slotName);
            if (slot === void 0 || slot.value === void 0) { return ""; }
            return slot.value;
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

        public getSlots(): Map<Slot> | void {
            return this.getIntent().slots;
        }

        public getSlot(slotName: string): Slot {
            let slots = this.getSlots();
            if (slots === void 0) { return void 0; }
            return slots[slotName];
        }

        public fulfillString(str: string): string {
            return str.replace(/{{([^}]+)}}/g, (_match, group) => this.slot(group));
        }
    }

    class Alexa extends InputWrapper {
        private responseBuilder: AskCore.ResponseBuilder = this.handlerInput.responseBuilder;

        public say(speechOutput: string, fulfillString: boolean = true): this {
            if (fulfillString) { speechOutput = this.fulfillString(speechOutput); }
            this.responseBuilder.speak(this.fulfillString(speechOutput));
            return this;
        }

        public ask(speechOutput: string, repromptSpeechOutput: string = speechOutput, fulfillString: boolean = true): this {
            if (fulfillString) {
                speechOutput = this.fulfillString(speechOutput);
                repromptSpeechOutput = this.fulfillString(repromptSpeechOutput);
            }
            this.responseBuilder.speak(speechOutput).reprompt(repromptSpeechOutput);
            return this;
        }

        public getResponse(): Response {
            return this.responseBuilder.getResponse();
        }
    }

    class Context extends InputWrapper {
        private eligibility: boolean = false;
        private invert: boolean = false;
        private handler: ResponseHandler;

        private isEligible(): boolean {
            return this.isDone() || !this.invert === this.eligibility;
        }

        public isDone(): boolean {
            return this.handler !== void 0;
        }

        public getHandler(): ResponseHandler {
            return this.handler;
        }

        public not() : this {
            if (this.isDone()) { return this; }

            this.invert = !this.invert;
            return this;
        }

        public hasSlot(...slotNames: string[]): this {
            if (this.isDone()) { return this; }

            if (slotNames.length === 0) {
                this.eligibility = this.getSlots() != void 0;
                return this;
            }

            this.eligibility = !slotNames.some((slotName) => this.getSlot(slotName) === void 0);
            return this;
        }
        

        public when(condition: Condition): this {
            if (this.isDone()) { return this; }

            this.eligibility = condition();
            return this;
        }

        public do(handler: ResponseHandler): void {
            if (!this.isDone() && this.isEligible()) { this.handler = handler; }
        }

        public default(handler: ResponseHandler): void {
            this.handler = handler;
        }

        public getRequestType(): string {
            return AskCore.getRequestType(this.getRequestEnvelope());
        }

        public getIntentName(): string {
            return AskCore.getIntentName(this.getRequestEnvelope());
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