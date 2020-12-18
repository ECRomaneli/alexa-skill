import { Selector } from "../modules/Core";
export declare class RequestType {
    readonly id: number;
    readonly value: string;
    private static AllValues;
    static readonly LaunchRequest: RequestType;
    static readonly IntentRequest: RequestType;
    static readonly SessionEndedRequest: RequestType;
    private constructor();
    static parseEnum(data: string): RequestType;
    static parseSelector(rawSelector: Selector | string): Selector;
    get(intentName?: string): Selector;
}
