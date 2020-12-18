import { HandlerInput, ResponseBuilder } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import { Data } from "./Data";
import { InputWrapper } from "./InputWrapper";

export class Alexa extends InputWrapper {
    private responseBuilder: ResponseBuilder = this.handlerInput.responseBuilder;
    private data: Data;

    constructor (handlerInput: HandlerInput, data: Data = new Data(handlerInput)) {
        super(handlerInput);
        this.data = data;
    }

    public say(speechOutput: string, fulfillString: boolean = true): this {
        if (fulfillString) { speechOutput = this.data.fulfillString(speechOutput); }
        this.responseBuilder.speak(speechOutput);
        return this;
    }

    public ask(speechOutput: string, repromptSpeechOutput: string = speechOutput, fulfillString: boolean = true): this {
        if (fulfillString) {
            let equals = speechOutput === repromptSpeechOutput;
            repromptSpeechOutput = this.data.fulfillString(repromptSpeechOutput);
            speechOutput = equals ? repromptSpeechOutput : this.data.fulfillString(speechOutput);
            
        }
        this.responseBuilder.speak(speechOutput).reprompt(repromptSpeechOutput);
        return this;
    }

    public getResponse(): Response {
        return this.responseBuilder.getResponse();
    }
}