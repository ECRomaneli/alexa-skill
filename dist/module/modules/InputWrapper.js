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
    getRequest() {
        return this.getRequestEnvelope().request;
    }
    getIntent() {
        return this.getRequest().intent;
    }
}
exports.InputWrapper = InputWrapper;
