import { AttributesManager, HandlerInput } from 'ask-sdk-core';
import { Intent, Request, RequestEnvelope } from 'ask-sdk-model';
export declare abstract class InputWrapper {
    protected handlerInput: HandlerInput;
    constructor(handlerInput: HandlerInput);
    getAttributesManager(): AttributesManager;
    getRequestEnvelope(): RequestEnvelope;
    getRequest(): Request;
    getIntent(): Intent;
}
