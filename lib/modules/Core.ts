import { HandlerInput, PersistenceAdapter, RequestHandler as ASKRequestHandler, RequestInterceptor, ResponseInterceptor } from "ask-sdk-core";
import { Response as ASKResponse } from "ask-sdk-model";
import { InterceptorType } from "../enums/InterceptorType";
import { RequestType } from "../enums/RequestType";
import { Relative, toRelative } from "../utils/Response";
import { Alexa } from "./Alexa";
import { Context, RequestHandler } from "./Context";
import { Data } from "./Data";

export type Selector = { requestType: string, intentName?: string };
type ContextHandler = (context?: Context) => void;
type InterceptorHandler = (data: Data, response?: ASKResponse) => Relative<void>;

export class Core {
    static userAgent: string;
    static handlers: ASKRequestHandler[] = [];
    static requestInterceptors: RequestInterceptor[] = [];
    static responseInterceptors: ResponseInterceptor[] = [];
    static persAdapter?: PersistenceAdapter;
    
    static launch(contextHandler: ContextHandler): Core;
    static launch(transitiveContext: true, requestHandler: RequestHandler): Core;
    static launch(transitiveContext: false, requestHandler: ContextHandler): Core;
    static launch(handlerOrTransContext: ContextHandler | boolean, handler?: ContextHandler | RequestHandler): Core {
        return this.on(RequestType.LaunchRequest.get(), handlerOrTransContext, handler);
    }

    static intent(contextHandler: ContextHandler): Core;
    static intent(transitiveContext: true, requestHandler: RequestHandler): Core;
    static intent(transitiveContext: false, requestHandler: ContextHandler): Core;
    static intent(handlerOrTransContext: ContextHandler | boolean, handler?: ContextHandler | RequestHandler): Core {
        return this.on(RequestType.IntentRequest.get(), handlerOrTransContext, handler);
    }

    static sessionEnded(contextHandler: ContextHandler): Core;
    static sessionEnded(transitiveContext: true, requestHandler: RequestHandler): Core;
    static sessionEnded(transitiveContext: false, requestHandler: ContextHandler): Core;
    static sessionEnded(handlerOrTransContext: ContextHandler | boolean, handler?: ContextHandler | RequestHandler): Core {
        return this.on(RequestType.SessionEndedRequest.get(), handlerOrTransContext, handler);
    }

    static help(contextHandler: ContextHandler): Core;
    static help(transitiveContext: true, requestHandler: RequestHandler): Core;
    static help(transitiveContext: false, requestHandler: ContextHandler): Core;
    static help(handlerOrTransContext: ContextHandler | boolean, handler?: ContextHandler | RequestHandler): Core {
        return this.on('AMAZON.HelpIntent', handlerOrTransContext, handler);
    }

    static cancel(contextHandler: ContextHandler): Core;
    static cancel(transitiveContext: true, requestHandler: RequestHandler): Core;
    static cancel(transitiveContext: false, requestHandler: ContextHandler): Core;
    static cancel(handlerOrTransContext: ContextHandler | boolean, handler?: ContextHandler | RequestHandler): Core {
        return this.on('AMAZON.CancelIntent', handlerOrTransContext, handler);
    }

    static stop(contextHandler: ContextHandler): Core;
    static stop(transitiveContext: true, requestHandler: RequestHandler): Core;
    static stop(transitiveContext: false, requestHandler: ContextHandler): Core;
    static stop(handlerOrTransContext: ContextHandler | boolean, handler?: ContextHandler | RequestHandler): Core {
        return this.on('AMAZON.StopIntent', handlerOrTransContext, handler);
    }

    static on(selector: string | Selector, contextHandler: ContextHandler): Core;
    static on(selector: string | Selector, transitiveContext: true, requestHandler: RequestHandler): Core;
    static on(selector: string | Selector, transitiveContext: false, requestHandler: ContextHandler): Core;
    static on(selector: string | Selector, handlerOrTransContext: ContextHandler | boolean, handler?: ContextHandler | RequestHandler): Core;
    static on(selector: string | Selector, handlerOrTransContext: ContextHandler | boolean, handler?: ContextHandler | RequestHandler): Core {
        let transitiveContext: boolean = handlerOrTransContext === true;

        if (!transitiveContext && handler === void 0) {
            handler = <any> handlerOrTransContext;
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

                if (transitiveContext) {
                    context.default(<RequestHandler> handler);
                    return true;
                }

                handler.call(context, context);
                return context.resolve();
            },
            handle: (handlerInput) => {
                let data: Data = new Data(handlerInput);
                let alexa: Alexa = new Alexa(handlerInput, data);

                let response = context.getHandler().call(alexa, alexa, data);

                return toRelative(response, () => alexa.getResponse());
            }
        });

        return Core;
    }

    static intercept(type: InterceptorType, handler: InterceptorHandler): Core {
        let list = type === InterceptorType.REQUEST ? Core.requestInterceptors : Core.responseInterceptors;

        list.push({
            process: (handlerInput, response?) => {
                let data: Data = new Data(handlerInput);
                return handler(data, response);
            }
        });
        
        return Core;
    }

    static persistenceAdapter(persistenceAdapter: PersistenceAdapter): Core {
        Core.persAdapter = persistenceAdapter;
        return Core;
    }

    static customUserAgent(customUserAgent: string): Core {
        Core.userAgent = customUserAgent;
        return Core;
    }
}