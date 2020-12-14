"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Core = void 0;
const RequestType_1 = require("../enums/RequestType");
const Alexa_1 = require("./Alexa");
const Context_1 = require("./Context");
const Data_1 = require("./Data");
class Core {
    static launch(handler) {
        this.on(RequestType_1.RequestType.LaunchRequest.get(), handler);
    }
    static on(selector, options, intentHandler) {
        if (arguments.length < 3) {
            intentHandler = options;
            options = {};
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
                intentHandler.call(context, context);
                return context.resolve();
            },
            handle: (handlerInput) => {
                let data = new Data_1.Data(handlerInput);
                let alexa = new Alexa_1.Alexa(handlerInput, data);
                let response = context.getHandler().call(alexa, alexa, data);
                if (response instanceof Promise) {
                    return (() => __awaiter(this, void 0, void 0, function* () {
                        yield response;
                        return alexa.getResponse();
                    }))();
                }
                return alexa.getResponse();
            }
        });
    }
}
exports.Core = Core;
Core.handlers = [];
