<h1 align='center'>True Skill Framework</h1>
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

    2 weeks for first stable release!!!

## What is Alexa

Alexa is Amazon’s cloud-based voice service (...). You can build natural voice experiences that offer customers a more intuitive way to interact with the technology they use every day (...).

## What is a Skill

In this context, a `Skill` is the name assigned to an application designed to enhance Alexa's functionalities.

Learn more about Skills on [Alexa Skills Kit](https://developer.amazon.com/en-US/alexa/alexa-skills-kit/start).

## The True Skill Framework

True Skill Framework or just True Skill is a fast, friendly and easy-to-use Skill Creation Helper for JavaScript. It makes the creation of an custom skill less repetitive and more intuitive, working side-by-side with the ASK Core. An perfect combination of what you want and what you write.

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

    exports.handler = Alexa.SkillBuilders.custom().addRequestHandlers(LaunchRequestHandler).lambda();
```

- True Skill

```javascript
    const { Skill } = require('@ecromaneli/true-skill'); // or { TrueSkill }

    Skill(($) => {
        $.on('LaunchRequest', (context, alexa) => alexa.say('Hello World!'));
    });
```

## Get Started

### Working...

## Author

- Created and maintained by [Emerson C. Romaneli](https://github.com/ECRomaneli) (@ECRomaneli).

## License

[Under MIT License](https://github.com/ECRomaneli/true-skill/blob/master/LICENSE)