export type TrueSkill = ($: typeof TrueSkill.Core) => void;

import AskCore = require('ask-sdk-core');
import { canfulfill, Intent, Request, RequestEnvelope, Response, Slot } from 'ask-sdk-model';

export function Skill(skillDefinition: TrueSkill): void {
    skillDefinition(TrueSkill.Core);
    
    let builder: AskCore.CustomSkillBuilder = AskCore.SkillBuilders.custom();
    builder.addRequestHandlers.apply(builder, TrueSkill.handlers);
    builder.withCustomUserAgent('trueskill/app').lambda();
}

namespace TrueSkill {
    type Condition = () => boolean;
    type IntentHandler = (context?: Context, alexa?: Alexa) => void;
    type ResponseHandler = (alexa?: Alexa) => void;
    type Map<K> = { [key: string]: K; }

    export const handlers: AskCore.RequestHandler[] = [];

    export interface PersistenceAdapter {  }

    export class Core {
        static on(intentName: string, handler: IntentHandler): void;
        static on(_intentName: string, options: IntentHandler | Object, handler?: IntentHandler): void {
            if (arguments.length < 3) {
                handler = <IntentHandler> options;
                options = {};
            }

            let context: Context;
            let alexa: Alexa;

            handlers.push({
                canHandle: (handlerInput) => {
                    context = new Context(handlerInput);
                    alexa = new Alexa(handlerInput);

                    

                    handler(context, alexa);
                    return context.isDone();
                },
                handle: (handlerInput) => {
                    alexa = new Alexa(handlerInput);
                    (context.getHandler())(alexa);
                    return alexa.getResponse();
                }
            });
        }
    }

    class InputWrapper {
        protected handlerInput: AskCore.HandlerInput;
        constructor (handlerInput: AskCore.HandlerInput) { this.handlerInput = handlerInput; }
    }

    class Alexa extends InputWrapper {
        private responseBuilder: AskCore.ResponseBuilder = this.handlerInput.responseBuilder;

        public say(speechOutput: string): this {
            this.responseBuilder.speak(speechOutput);
            return this;
        }

        public ask(repromptSpeechOutput: string): this {
            this.responseBuilder.reprompt(repromptSpeechOutput);
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
            this.invert = true;
            return this;
        }

        public hasSlot(...slotNames: string[]): this {
            if (slotNames.length === 0) {
                this.eligibility = this.getSlots() != void 0;
                return this;
            }

            this.eligibility = !slotNames.some((slotName) => this.getSlot(slotName) === void 0);
            return this;
        }
        

        public when(condition: Condition): this {
            this.eligibility = condition();
            return this;
        }

        public do(handler: ResponseHandler): void {
            if (!this.isDone() && this.isEligible()) { this.handler = handler; }
        }

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
            return  (<canfulfill.CanFulfillIntentRequest> this.getRequest()).intent;
        }

        public getSlots(): Map<Slot> | void {
            return this.getIntent().slots;
        }

        public getSlot(slotName: string): Slot {
            let slots = this.getSlots();
            if (slots === void 0) { return void 0; }
            return slots[slotName];
        }

        public getRequestType(): string {
            return AskCore.getRequestType(this.getRequestEnvelope());
        }

        public getIntentName(): string {
            return AskCore.getIntentName(this.getRequestEnvelope());
        }
    }
}