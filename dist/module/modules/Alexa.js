"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Alexa = void 0;
const Data_1 = require("./Data");
const InputWrapper_1 = require("./InputWrapper");
class Alexa extends InputWrapper_1.InputWrapper {
    constructor(handlerInput, data = new Data_1.Data(handlerInput)) {
        super(handlerInput);
        this.responseBuilder = this.handlerInput.responseBuilder;
        this.data = data;
    }
    say(speechOutput, fulfillString = true) {
        if (fulfillString) {
            speechOutput = this.data.fulfillString(speechOutput);
        }
        this.responseBuilder.speak(this.data.fulfillString(speechOutput));
        return this;
    }
    ask(speechOutput, repromptSpeechOutput = speechOutput, fulfillString = true) {
        if (fulfillString) {
            speechOutput = this.data.fulfillString(speechOutput);
            repromptSpeechOutput = this.data.fulfillString(repromptSpeechOutput);
        }
        this.responseBuilder.speak(speechOutput).reprompt(repromptSpeechOutput);
        return this;
    }
    getResponse() {
        return this.responseBuilder.getResponse();
    }
}
exports.Alexa = Alexa;
