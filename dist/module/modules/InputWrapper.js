"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputWrapper = void 0;
class InputWrapper {
    constructor(handlerInput) {
        this.handlerInput = handlerInput;
    }
    getAttributesManager() {
        return this.handlerInput.attributesManager;
    }
    getRequestEnvelope() {
        return this.handlerInput.requestEnvelope;
    }
    getServiceClient() {
        const clientFactory = this.handlerInput.serviceClientFactory;
        return clientFactory ? this.handlerInput.serviceClientFactory.getUpsServiceClient() : void 0;
    }
    getContext() {
        return this.getRequestEnvelope().context;
    }
    getSession() {
        return this.getRequestEnvelope().session;
    }
    getRequest() {
        return this.getRequestEnvelope().request;
    }
    getIntent() {
        return this.getRequest().intent;
    }
}
exports.InputWrapper = InputWrapper;
