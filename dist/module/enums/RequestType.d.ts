import { Selector } from "../modules/Core";
export declare class RequestType {
    readonly id: number;
    readonly value: string;
    private static AllValues;
    static readonly Launch: RequestType;
    static readonly Intent: RequestType;
    static readonly SessionEnded: RequestType;
    private constructor();
    static parseEnum(data: string): RequestType;
    static parseSelector(rawSelector: Selector | string): Selector;
    get(intentName?: string): Selector;
}
