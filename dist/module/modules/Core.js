"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Core = void 0;
const ASKCore = require("ask-sdk-core");
const InterceptorType_1 = require("../enums/InterceptorType");
const RequestType_1 = require("../enums/RequestType");
const Response_1 = require("../utils/Response");
const Context_1 = require("./Context");
const Response_2 = require("./Response");
const Data_1 = require("./Data");
class Core {
    static launch(handlerOrTransContext, handler) {
        return this.on(RequestType_1.RequestType.Launch.get(), handlerOrTransContext, handler);
    }
    static intent(handlerOrTransContext, handler) {
        return this.on(RequestType_1.RequestType.Intent.get(), handlerOrTransContext, handler);
    }
    static sessionEnded(handlerOrTransContext, handler) {
        return this.on(RequestType_1.RequestType.SessionEnded.get(), handlerOrTransContext, handler);
    }
    static help(handlerOrTransContext, handler) {
        return this.on('AMAZON.HelpIntent', handlerOrTransContext, handler);
    }
    static cancel(handlerOrTransContext, handler) {
        return this.on('AMAZON.CancelIntent', handlerOrTransContext, handler);
    }
    static stop(handlerOrTransContext, handler) {
        return this.on('AMAZON.StopIntent', handlerOrTransContext, handler);
    }
    static on(selector, handlerOrTransContext, handler) {
        let transitiveContext = handlerOrTransContext === true;
        if (!transitiveContext && handler === void 0) {
            handler = handlerOrTransContext;
        }
        let context;
        Core.handlers.push({
            canHandle: (handlerInput) => {
                context = new Context_1.Context(handlerInput);
                let s = RequestType_1.RequestType.parseSelector(selector);
                if (s.requestType !== context.getRequestType()
                    || (s.intentName !== void 0 && s.intentName !== context.getIntentName())) {
                    return false;
                }
                if (transitiveContext) {
                    context.default(handler);
                    return true;
                }
                handler.call(context, context);
                return context.resolve();
            },
            handle: (handlerInput) => {
                let data = new Data_1.Data(handlerInput);
                let response = Response_2.improveResponseBuilder(handlerInput);
                let relative = context.getHandler().call(data, response, data);
                return Response_1.toRelative(relative, () => response.getResponse());
            }
        });
        return Core;
    }
    static intercept(type, handler) {
        let list = type === InterceptorType_1.InterceptorType.REQUEST ? Core.requestInterceptors : Core.responseInterceptors;
        list.push({
            process: (handlerInput, response) => {
                let data = new Data_1.Data(handlerInput);
                return handler(data, response);
            }
        });
        return Core;
    }
    static withPersistenceAdapter(persistenceAdapter) {
        Core.persistenceAdapter = persistenceAdapter;
        return Core;
    }
    static withApiClient(apiClient = new ASKCore.DefaultApiClient()) {
        Core.apiClient = apiClient;
        return Core;
    }
    static customUserAgent(customUserAgent) {
        Core.userAgent = customUserAgent;
        return Core;
    }
}
exports.Core = Core;
Core.handlers = [];
Core.requestInterceptors = [];
Core.responseInterceptors = [];
