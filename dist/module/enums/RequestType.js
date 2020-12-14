"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestType = void 0;
class RequestType {
    constructor(id, value) {
        this.id = id;
        this.value = value;
        RequestType.AllValues[value] = this;
    }
    static parseEnum(data) {
        return RequestType.AllValues[data.trim()];
    }
    static parseSelector(rawSelector) {
        if (typeof rawSelector !== 'string') {
            return rawSelector;
        }
        let splitted = rawSelector.replace(/\s/g, '').split(':');
        if (splitted.length == 1) {
            return {
                requestType: RequestType.IntentRequest.value,
                intentName: splitted[0]
            };
        }
        return {
            requestType: splitted[1],
            intentName: splitted[0].length ? splitted[0] : void 0
        };
    }
    get(intentName) {
        return { requestType: this.value, intentName };
    }
}
exports.RequestType = RequestType;
RequestType.AllValues = {};
RequestType.LaunchRequest = new RequestType(1, "LaunchRequest");
RequestType.IntentRequest = new RequestType(2, "IntentRequest");
