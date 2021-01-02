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
        return {
            requestType: splitted.length > 1 ? splitted[1] : RequestType.Intent.value,
            intentName: splitted[0].length ? splitted[0] : void 0
        };
    }
    get(intentName) {
        return { requestType: this.value, intentName };
    }
}
exports.RequestType = RequestType;
RequestType.AllValues = {};
RequestType.Launch = new RequestType(1, 'LaunchRequest');
RequestType.Intent = new RequestType(2, 'IntentRequest');
RequestType.SessionEnded = new RequestType(3, 'SessionEndedRequest');
