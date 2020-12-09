"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skill = void 0;
const AskCore = require("ask-sdk-core");
function Skill(skillDefinition) {
    skillDefinition(TrueSkill.Core);
    let builder = AskCore.SkillBuilders.custom();
    builder.addRequestHandlers.apply(builder, TrueSkill.handlers);
    builder.withCustomUserAgent('trueskill/app').lambda();
}
exports.Skill = Skill;
var TrueSkill;
(function (TrueSkill) {
    TrueSkill.handlers = [];
    class Core {
        static on(_intentName, options, handler) {
            if (arguments.length < 3) {
                handler = options;
                options = {};
            }
            let context;
            let alexa;
            TrueSkill.handlers.push({
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
    TrueSkill.Core = Core;
    class InputWrapper {
        constructor(handlerInput) { this.handlerInput = handlerInput; }
    }
    class Alexa extends InputWrapper {
        constructor() {
            super(...arguments);
            this.responseBuilder = this.handlerInput.responseBuilder;
        }
        say(speechOutput) {
            this.responseBuilder.speak(speechOutput);
            return this;
        }
        ask(repromptSpeechOutput) {
            this.responseBuilder.reprompt(repromptSpeechOutput);
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
            this.invert = true;
            return this;
        }
        hasSlot(...slotNames) {
            if (slotNames.length === 0) {
                this.eligibility = this.getSlots() != void 0;
                return this;
            }
            this.eligibility = !slotNames.some((slotName) => this.getSlot(slotName) === void 0);
            return this;
        }
        when(condition) {
            this.eligibility = condition();
            return this;
        }
        do(handler) {
            if (!this.isDone() && this.isEligible()) {
                this.handler = handler;
            }
        }
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
        getRequestType() {
            return AskCore.getRequestType(this.getRequestEnvelope());
        }
        getIntentName() {
            return AskCore.getIntentName(this.getRequestEnvelope());
        }
    }
})(TrueSkill || (TrueSkill = {}));
