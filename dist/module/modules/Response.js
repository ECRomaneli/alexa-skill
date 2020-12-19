"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.improveResponseBuilder = void 0;
const Data_1 = require("./Data");
/**
 * TODO: Create own ResponseBuilder.
 */
function improveResponseBuilder(handlerInput) {
    const data = new Data_1.Data(handlerInput);
    const builder = handlerInput.responseBuilder;
    builder['say'] = function (speechOutput, fulfillString = true) {
        if (fulfillString) {
            speechOutput = data.fulfillString(speechOutput);
        }
        return builder.speak(speechOutput);
    };
    builder['ask'] = function (speechOutput, repromptSpeechOutput = speechOutput, fulfillString = true) {
        if (fulfillString) {
            let equals = speechOutput === repromptSpeechOutput;
            repromptSpeechOutput = data.fulfillString(repromptSpeechOutput);
            speechOutput = equals ? repromptSpeechOutput : data.fulfillString(speechOutput);
        }
        return builder.speak(speechOutput).reprompt(repromptSpeechOutput);
    };
    return builder;
}
exports.improveResponseBuilder = improveResponseBuilder;
// export class Response extends InputWrapper {
//     private responseBuilder: ResponseBuilder = this.handlerInput.responseBuilder;
//     private data: Data;
//     constructor (handlerInput: HandlerInput, data: Data = new Data(handlerInput)) {
//         super(handlerInput);
//         this.data = data;
//     }
//     public say(speechOutput: string, fulfillString: boolean = true): this {
//         if (fulfillString) { speechOutput = this.data.fulfillString(speechOutput); }
//         this.responseBuilder.speak(speechOutput);
//         return this;
//     }
//     public ask(speechOutput: string, repromptSpeechOutput: string = speechOutput, fulfillString: boolean = true): this {
//         if (fulfillString) {
//             let equals = speechOutput === repromptSpeechOutput;
//             repromptSpeechOutput = this.data.fulfillString(repromptSpeechOutput);
//             speechOutput = equals ? repromptSpeechOutput : this.data.fulfillString(speechOutput);
//         }
//         this.responseBuilder.speak(speechOutput).reprompt(repromptSpeechOutput);
//         return this;
//     }
//     public toASKResponse(): ASKResponse {
//         return this.responseBuilder.getResponse();
//     }
// }
