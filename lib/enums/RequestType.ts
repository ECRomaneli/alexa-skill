import { Selector } from "../modules/Core";

export class RequestType {
    private static AllValues: { [name: string] : RequestType } = {};

    static readonly LaunchRequest = new RequestType(1, 'LaunchRequest');
    static readonly IntentRequest = new RequestType(2, 'IntentRequest');
    static readonly SessionEndedRequest = new RequestType(3, 'SessionEndedRequest');

    private constructor (public readonly id: number, public readonly value: string) {
        RequestType.AllValues[value] = this;
    }

    public static parseEnum(data: string): RequestType {
        return RequestType.AllValues[data.trim()];
    }

    public static parseSelector(rawSelector: Selector | string): Selector {
        if (typeof rawSelector !== 'string') { return rawSelector; }
        let splitted = rawSelector.replace(/\s/g, '').split(':');

        return {
            requestType: splitted.length > 1 ? splitted[1] : RequestType.IntentRequest.value,
            intentName: splitted[0].length ? splitted[0] : void 0
        };
    }

    public get(intentName?: string): Selector {
        return { requestType: this.value, intentName };
    }
}