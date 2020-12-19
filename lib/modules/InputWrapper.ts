import { AttributesManager, HandlerInput } from 'ask-sdk-core';
import { Context, Intent, Request, RequestEnvelope, services, Session } from 'ask-sdk-model';

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

    public getServiceClient(): services.ups.UpsServiceClient {
        const clientFactory: services.ServiceClientFactory = this.handlerInput.serviceClientFactory;
        return clientFactory ? this.handlerInput.serviceClientFactory.getUpsServiceClient() : void 0;
    }

    public getContext(): Context {
        return this.getRequestEnvelope().context;
    }

    public getSession(): Session {
        return this.getRequestEnvelope().session;
    }

    public getRequest(): Request {
        return this.getRequestEnvelope().request;
    }

    public getIntent(): Intent {
        return (<any> this.getRequest()).intent;
    }
}