import { AttributesManager, HandlerInput } from 'ask-sdk-core';
import { Intent, Request, RequestEnvelope } from 'ask-sdk-model';

export abstract class InputWrapper {
    protected handlerInput: HandlerInput;

    constructor (handlerInput: HandlerInput) {
        this.handlerInput = handlerInput;
    }

    public getAttributesManager(): AttributesManager {
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