import { HandlerInput, ResponseBuilder } from "ask-sdk-core";
import { Data } from "./Data";

/**
 * TODO: Create own ResponseBuilder.
 */
export function improveResponseBuilder(handlerInput: HandlerInput): ResponseBuilder {
    const data = new Data(handlerInput);
    const builder: ResponseBuilder = handlerInput.responseBuilder;

    builder['say'] = function (speechOutput: string, fulfillString: boolean = true): ResponseBuilder {
        if (fulfillString) { speechOutput = data.fulfillString(speechOutput); }
        return builder.speak(speechOutput);
    }

    builder['ask'] = function (speechOutput: string, repromptSpeechOutput: string = speechOutput, fulfillString: boolean = true): ResponseBuilder {
        if (fulfillString) {
            let equals = speechOutput === repromptSpeechOutput;
            repromptSpeechOutput = data.fulfillString(repromptSpeechOutput);
            speechOutput = equals ? repromptSpeechOutput : data.fulfillString(speechOutput);
            
        }
        return builder.speak(speechOutput).reprompt(repromptSpeechOutput);
    }

    return builder;
}

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