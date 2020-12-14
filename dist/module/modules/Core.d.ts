import { RequestHandler } from "ask-sdk-core";
import { Context } from "./Context";
export declare type Selector = {
    requestType: string;
    intentName?: string;
};
declare type IntentHandler = (context?: Context) => void;
export declare class Core {
    static handlers: RequestHandler[];
    static launch(handler: IntentHandler): void;
    static on(selector: string | Selector, handler: IntentHandler): void;
}
export {};
