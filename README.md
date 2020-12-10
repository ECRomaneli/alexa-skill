<h1 align='center'>True Skill for Alexa</h1>
<p align='center'>
Skills for Alexa in a Nutshell
</p>
<p align='center'>
    <a href="https://www.npmjs.com/package/@ecromaneli/true-skill"><img src="https://img.shields.io/npm/v/@ecromaneli/true-skill.svg" alt="module version"></a>&nbsp;
    <a href="https://github.com/ECRomaneli/true-skill/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="GitHub license"></a>&nbsp;
    <!--<img src="https://circleci.com/gh/ECRomaneli/mQuery.svg?style=shield" alt="CircleCI">&nbsp;-->
    <a href="https://github.com/ECRomaneli/true-skill"><img src="https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat" alt="contributions welcome"></a>
</p>

## Working...

    1.5 weeks for first stable release!!!

## What is Alexa

Alexa is Amazon’s cloud-based voice service (...). You can build natural voice experiences that offer customers a more intuitive way to interact with the technology they use every day (...).

## What is a Skill

In this context, a `Skill` is the name assigned to an application designed to enhance Alexa's functionalities.

Learn more about Skills on [Alexa Skills Kit](https://developer.amazon.com/en-US/alexa/alexa-skills-kit/start).

## The True Skill Library

True Skill Library or just True Skill is a fast, friendly and easy-to-use Skill Creation Helper for JavaScript. It makes the creation of an custom skill less repetitive and more intuitive, working side-by-side with the ASK Core. An perfect combination of what you want and what you write.

## Install

When you creating your skill, just import true-skill into your `package.json`, or alternatively run:

    npm i @ecromaneli/true-skill

## Comparison

Just a simple example of basic work:

- ASK Core

```javascript
    const Alexa = require('ask-sdk-core');

    const LaunchRequestHandler = {
        canHandle(handlerInput) {
            return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
        },
        handle(handlerInput) {
            const speakOutput = 'Hello World!';
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
        }
    };

    const SomeIntentWithSlotHandler = {
        canHandle(handlerInput) {
            return handlerInput.requestEnvelope.request.type === 'IntentRequest'
                && handlerInput.requestEnvelope.request.intent.name === 'SomeIntent'
                && handlerInput.requestEnvelope.request.intent.slots.someSlot !== void 0;
        },
        handle(handlerInput) {
            const someSlotValue = handlerInput.requestEnvelope.request.intent.slots.someSlot.value; 
            const speechText = `someSlot value is ${someSlotValue}.`;

            return handlerInput.responseBuilder
                .speak(speechText)
                .getResponse();
        }
    };

    const SomeIntentWithoutSlotHandler = {
        canHandle(handlerInput) {
            return handlerInput.requestEnvelope.request.type === 'IntentRequest'
                && handlerInput.requestEnvelope.request.intent.name === 'SomeIntent';
        },
        handle(handlerInput) {            
            const speechText = 'What is someSlot value?';
            const repromptText = 'What?';
            return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(repromptText)
                .getResponse();
        }
    };

    exports.handler = Alexa.SkillBuilders.custom()
        .addRequestHandlers(
            LaunchRequestHandler, 
            SomeIntentWithSlotHandler,
            SomeIntentWithoutSlotHandler)
        .lambda();
```

- True Skill

```javascript
    const { Skill } = require('@ecromaneli/true-skill'); // or { TrueSkill }

    exports.handler = Skill(($) => {
        $.launch((context) => {
            context.default(alexa => alexa.say('Hello World!'));
        });

        // Can be used 'SomeIntent: IntentRequest' too
        $.on('SomeIntent', (context) => {
            context.hasSlot('someSlot').do(alexa => alexa.say('someSlot value is {{someSlot}}.')); 
            context.default(alexa => alexa.ask('What is someSlot value?', 'What?'));
        });
    });

    // [EXTRA]
    // You can also access slots with data parameter
    (...)
        context.hasSlot('someSlot').do((alexa, data) => {
            alexa.say('someSlot value is {{someSlot}}.');
            console.log(data.slot('someSlot'));
        }); 
    (...)
```

## Get Started

### Working...

## Progress

### First stable

- Structure and topology [DONE];
- Launch and intents [DONE];
- Context cases [DONE];
- Slots and session attributes [DONE];
- Storage modules;
- Help and errors responses;
- Interceptors.

### Future

- Smart Home Module;
- Infinite possibilities \*-*.

## Author

- Created and maintained by [Emerson C. Romaneli](https://github.com/ECRomaneli) (@ECRomaneli).

## License

[Under MIT License](https://github.com/ECRomaneli/true-skill/blob/master/LICENSE)