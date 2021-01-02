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

## What is Alexa

Alexa is Amazon’s cloud-based voice service (...). You can build natural voice experiences that offer customers a more intuitive way to interact with the technology they use every day (...).

## What is a Skill

In this context, a `Skill` is the name assigned to an application designed to enhance Alexa's functionalities.

Learn more about Skills on [Alexa Skills Kit](https://developer.amazon.com/en-US/alexa/alexa-skills-kit/start).

## The True Skill Library

True Skill Library or just True Skill is a fast, friendly and easy-to-use Skill Creation Helper for JavaScript. It makes the creation of an custom skill less repetitive and more intuitive, working side-by-side with the ASK Core. An perfect combination of what you want and what you write.

## Install

When you creating your skill, just import `ask-sdk-core`, `ask-sdk-model` and `true-skill` into your `package.json`, or alternatively run:

```bash
    npm i ask-sdk-core
    npm i ask-sdk-model
    npm i @ecromaneli/true-skill

```

Last tested:

```json
    "ask-sdk-core": "^2.7.0",
    "ask-sdk-model": "^1.19.0",
```

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
            context.default(response => response.say('Hello World!'));
        });

        // Can be used 'SomeIntent: IntentRequest' too
        $.on('SomeIntent', (context) => {
            context.hasSlot('someSlot').do(response => response.say('someSlot value is {{someSlot}}.')); 
            context.default(response => response.ask('What is someSlot value?', 'What?'));
        });
    });

    // [EXTRA]
    // You can also access slots with data parameter
    (...)
        context.hasSlot('someSlot').do((response, data) => {
            response.say('someSlot value is {{someSlot}}.');
            console.log(data.slot('someSlot'));
        }); 
    (...)
```

## Get Started

To start using TrueSkill you need to:

- Import TrueSkill into your project;
- Create you handlers using Request Selectors, the order is important;
- Configure your persistence adapter if needed;
- Test you Skill.

## Importing

Import `Skill` or `TrueSkill` and set your global lambda variable (default is `handler`) to Skill return.

```javascript
    const { Skill } = require('@ecromaneli/true-skill'); // or { TrueSkill }

    exports.handler = Skill($ => {
        // Your skill code here...
    });
```

## How to Handle Requests

<p align='center'><img src='https://i.postimg.cc/Y9nJKR2M/workflow.png' width='90%'></p>

First thing first, you need to know how to use `Request Selectors`.

### Handler Selectors

With TrueSkill you can use the Request Selectors to say for the application, what request you want to handle.

The pattern to handle directly an Request Type, is `:RequestType`. For example, you can handle Launch requests using:

```javascript
    $.on(':LaunchRequest', requestHandler);
```

or the shortcut:

```javascript
    $.launch(requestHandler);
```

For handle an intent, you don't need to specify an request type, that's because the `IntentRequest` is the default type.
For that, just use the intent name. See the example below:

```javascript
    $.on('FooIntent', requestHandler);
```

### Shortcuts

Some shortcuts has been implemented based on default request types and built-in intents. See the list below:

```javascript
    // :LaunchRequest
    launch(contextHandler: ContextHandler): Core;
    launch(onlyDefaultContext: true, requestHandler: RequestHandler): Core;

    // :SessionEndedRequest
    sessionEnded(contextHandler: ContextHandler): Core;
    sessionEnded(onlyDefaultContext: true, requestHandler: RequestHandler): Core;

    // Amazon Help Intent
    help(contextHandler: ContextHandler): Core;
    help(onlyDefaultContext: true, requestHandler: RequestHandler): Core;

    // Amazon Cancel Intent
    cancel(contextHandler: ContextHandler): Core;
    cancel(onlyDefaultContext: true, requestHandler: RequestHandler): Core;

    // Amazon Stop Intent
    stop(contextHandler: ContextHandler): Core;
    stop(onlyDefaultContext: true, requestHandler: RequestHandler): Core;

    // Handle any request
    intent(contextHandler: ContextHandler): Core;
    intent(onlyDefaultContext: true, requestHandler: RequestHandler): Core;
```

See more about `onlyDefaultContext` bellow.

### Controlling your Context

After learn how to use the `Selectors`, you need to know how to separate the different contexts of the captured `Request`.
For example, if you have a persistent attribute or slot, and you want to give a different answer to your user, you need to specify that.

When you use the `.on()` or any shortcut (see the section above), you need to pass an handler. This handler receive as parameter an attribute called `Context`. The `Context` are responsible to identify what `RequestHandler` will be called based on your `Rules`. For example, you can do:

```javascript
    (...)
        $.launch(context => {
            context.when(data => data.persistentAttr('firstTime') === false).do((response) => {
                response.say('Hello again!');
            });

            context.default(async (response, data) => {
                data.persistentAttr('firstTime', false);
                await data.savePersistentAttr();
                response.say('First time!');
            });
        });
    (...)
```

In this example, on the first time, the Alexa will say `First time!` and set an persistent attribute called `firstTime` as `false`. When your Skill been called again, the Alexa will say `Hello again!` because the `.when()` rule.

To create an `Rule`, you can use some of that functions and shortcuts:

```javascript
    // Test the condition passed as parameter. Can return promise.
    when(condition: (data) => boolean | Promise<boolean>): this;

    // Negate any rule passed
    not(): this;

     // Verify if any (or specified) slot exists
    hasSlot(): this;
    hasSlot(slotNames?: string | string[]): this;

    // Verify if any (or specified) request attribute exists
    hasRequestAttr(): this;
    hasRequestAttr(attrNames?: string | string[]): this;

    // Verify if any (or specified) request attribute exists
    hasSessionAttr(): this;
    hasSessionAttr(attrNames?: string | string[]): this;

    // Verify if any (or specified) request attribute exists
    hasPersistentAttr(): this;
    hasPersistentAttr(attrNames?: string | string[]): this;

    // Verify if any (or specified) attribute exists with the type specified
    // NOTE: AttributeType can be imported by @ecromaneli/TrueSkill package too.
    hasAttr(): this;
    hasAttr(type: AttributeType, attrNames?: string | string[]): this;
```

If you context has only the default case, you can short your `.on()` call passing `true` to `onlyDefaultContext` parameter.

```javascript
    $.on('selector', /* onlyDefaultContext */ true, RequestHandler)
```

With this, you no longer pass an `ContextHandler` as parameter, you pass the `RequestHandler` directly.

### Handle Requests

Now, with your set of rules, it's time to respond the Request. When a rule condition returns `true`, an `RequestHandler` is called. He, is the responsible to perform an response.

The `RequestHandler` have 2 parameters, `Response` and `Data`. The `Response` are directly responsible to send the Request Response at final of your handler execution. And the `Data`, responsible to provide any important information (slots and attributes) retrieved by the request or persisted into your application.

Example:

speak()
```javascript
    $.on('fooIntent', (context) => {
        context.default((response, data) => {
            data.sessionAttr('key', 'value');
            response.say('The session attribute key = {{value}}');
        });
    });
```

.reprompt()
```javascript
    $.on('fooIntent', (context) => {
        context.default((response, data) => {
            response.ask('speak', 'reprompt');
        });
    });
```

## Progress

### First stable

- Structure and topology [**DONE**];
- Launch and intents [**DONE**];
- Context cases [**DONE**];
- Slots and session attributes [**DONE**];
- Persistent attributes [**DONE**];
- Help and other defaults responses [**DONE**];
- Interceptors [**DONE**];
- PersistentAdapter [**DONE**]; (See FSPersistenceAdapter project too)
- Testing... [**IN PROGRESS**].

### Beta Objectives

- Usage;
- Documentation.

### Future

- Smart Home Module;
- Infinite possibilities \*-*.

## Author

- Created and maintained by [Emerson C. Romaneli](https://github.com/ECRomaneli) (@ECRomaneli).

## License

[Under MIT License](https://github.com/ECRomaneli/true-skill/blob/master/LICENSE)