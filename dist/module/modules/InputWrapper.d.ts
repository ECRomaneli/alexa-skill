import { AttributesManager, HandlerInput } from 'ask-sdk-core';
import { Context, Intent, Request, RequestEnvelope, services, Session } from 'ask-sdk-model';
export declare abstract class InputWrapper {
    protected handlerInput: HandlerInput;
    constructor(handlerInput: HandlerInput);
    getAttributesManager(): AttributesManager;
    getRequestEnvelope(): RequestEnvelope;
    getServiceClient(): services.ups.UpsServiceClient;
    getContext(): Context;
    getSession(): Session;
    getRequest(): Request;
    getIntent(): Intent;
}
