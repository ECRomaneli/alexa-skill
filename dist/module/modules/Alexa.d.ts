import { HandlerInput } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import { Data } from "./Data";
import { InputWrapper } from "./InputWrapper";
export declare class Alexa extends InputWrapper {
    private responseBuilder;
    private data;
    constructor(handlerInput: HandlerInput, data?: Data);
    say(speechOutput: string, fulfillString?: boolean): this;
    ask(speechOutput: string, repromptSpeechOutput?: string, fulfillString?: boolean): this;
    getResponse(): Response;
}
