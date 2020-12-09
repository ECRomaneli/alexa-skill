"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skill = void 0;
const AskCore = require("ask-sdk-core");
function Skill(skillHandler, builder = AskCore.SkillBuilders.custom()) {
    skillHandler.call(TrueSkill.Core, TrueSkill.Core);
    builder.addRequestHandlers.apply(builder, TrueSkill.handlers);
    return builder.withCustomUserAgent('trueskill/app').lambda();
}
exports.Skill = Skill;
var TrueSkill;
(function (TrueSkill) {
    TrueSkill.handlers = [];
    class Core {
        static launch(handler) {
            this.on(RequestType.LaunchRequest.get(), handler);
        }
        static on(selector, options, handler) {
            if (arguments.length < 3) {
                handler = options;
                options = {};
            }
            let context;
            TrueSkill.handlers.push({
                canHandle: (handlerInput) => {
                    context = new Context(handlerInput);
                    let s = RequestType.parseSelector(selector);
                    if (s.requestType !== context.getRequestType()
                        || (s.intentName !== void 0 && s.intentName !== context.getIntentName())) {
                        return false;
                    }
                    handler.call(context, context);
                    return context.isDone();
                },
                handle: (handlerInput) => {
                    let alexa = new Alexa(handlerInput);
                    context.getHandler().call(alexa, alexa);
                    return alexa.getResponse();
                }
            });
        }
    }
    TrueSkill.Core = Core;
    class InputWrapper {
        constructor(handlerInput) { this.handlerInput = handlerInput; }
        slot(slotName) {
            let slot = this.getSlot(slotName);
            if (slot === void 0 || slot.value === void 0) {
                return "";
            }
            return slot.value;
        }
        getRequestEnvelope() {
            return this.handlerInput.requestEnvelope;
        }
        getRequest() {
            return this.getRequestEnvelope().request;
        }
        getIntent() {
            return this.getRequest().intent;
        }
        getSlots() {
            return this.getIntent().slots;
        }
        getSlot(slotName) {
            let slots = this.getSlots();
            if (slots === void 0) {
                return void 0;
            }
            return slots[slotName];
        }
        fulfillString(str) {
            return str.replace(/{{([^}]+)}}/g, (_match, group) => this.slot(group));
        }
    }
    class Alexa extends InputWrapper {
        constructor() {
            super(...arguments);
            this.responseBuilder = this.handlerInput.responseBuilder;
        }
        say(speechOutput, fulfillString = true) {
            if (fulfillString) {
                speechOutput = this.fulfillString(speechOutput);
            }
            this.responseBuilder.speak(this.fulfillString(speechOutput));
            return this;
        }
        ask(speechOutput, repromptSpeechOutput = speechOutput, fulfillString = true) {
            if (fulfillString) {
                speechOutput = this.fulfillString(speechOutput);
                repromptSpeechOutput = this.fulfillString(repromptSpeechOutput);
            }
            this.responseBuilder.speak(speechOutput).reprompt(repromptSpeechOutput);
            return this;
        }
        getResponse() {
            return this.responseBuilder.getResponse();
        }
    }
    class Context extends InputWrapper {
        constructor() {
            super(...arguments);
            this.eligibility = false;
            this.invert = false;
        }
        isEligible() {
            return this.isDone() || !this.invert === this.eligibility;
        }
        isDone() {
            return this.handler !== void 0;
        }
        getHandler() {
            return this.handler;
        }
        not() {
            if (this.isDone()) {
                return this;
            }
            this.invert = !this.invert;
            return this;
        }
        hasSlot(...slotNames) {
            if (this.isDone()) {
                return this;
            }
            if (slotNames.length === 0) {
                this.eligibility = this.getSlots() != void 0;
                return this;
            }
            this.eligibility = !slotNames.some((slotName) => this.getSlot(slotName) === void 0);
            return this;
        }
        when(condition) {
            if (this.isDone()) {
                return this;
            }
            this.eligibility = condition();
            return this;
        }
        do(handler) {
            if (!this.isDone() && this.isEligible()) {
                this.handler = handler;
            }
        }
        default(handler) {
            this.handler = handler;
        }
        getRequestType() {
            return AskCore.getRequestType(this.getRequestEnvelope());
        }
        getIntentName() {
            return AskCore.getIntentName(this.getRequestEnvelope());
        }
    }
    class RequestType {
        constructor(id, value) {
            this.id = id;
            this.value = value;
            RequestType.AllValues[value] = this;
        }
        static parseEnum(data) {
            return RequestType.AllValues[data.trim()];
        }
        static parseSelector(rawSelector) {
            if (typeof rawSelector !== 'string') {
                return rawSelector;
            }
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
        get(intentName) {
            return { requestType: this.value, intentName };
        }
    }
    RequestType.AllValues = {};
    RequestType.LaunchRequest = new RequestType(1, "LaunchRequest");
    RequestType.IntentRequest = new RequestType(2, "IntentRequest");
})(TrueSkill || (TrueSkill = {}));
