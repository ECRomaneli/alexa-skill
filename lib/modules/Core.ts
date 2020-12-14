import { HandlerInput, RequestHandler } from "ask-sdk-core";
import { RequestType } from "../enums/RequestType";
import { Alexa } from "./Alexa";
import { Context } from "./Context";
import { Data } from "./Data";

export type Selector = { requestType: string, intentName?: string };
type IntentHandler = (context?: Context) => void;

export class Core {
    static handlers: RequestHandler[] = [];
    
    static launch(handler: IntentHandler): void {
        this.on(RequestType.LaunchRequest.get(), handler);
    }

    static on(selector: string | Selector, handler: IntentHandler): void;
    static on(selector: string | Selector, options: IntentHandler | Object, intentHandler?: IntentHandler): void {
        if (arguments.length < 3) {
            intentHandler = <IntentHandler> options;
            options = {};
        }

        let context: Context;

        Core.handlers.push({
            canHandle: (handlerInput: HandlerInput) => {
                context = new Context(handlerInput);

                let s: Selector = RequestType.parseSelector(selector);
                if (s.requestType !== context.getRequestType()
                || (s.intentName !== void 0 && s.intentName !== context.getIntentName())) {
                    return false;
                }

                intentHandler.call(context, context);
                return context.resolve();
            },
            handle: (handlerInput) => {
                let data: Data = new Data(handlerInput);
                let alexa: Alexa = new Alexa(handlerInput, data);

                let response = context.getHandler().call(alexa, alexa, data);

                if (response instanceof Promise) {
                    return (async () => {
                        await response;
                        return alexa.getResponse();
                    })();
                }

                return alexa.getResponse();
            }
        });
    }
}