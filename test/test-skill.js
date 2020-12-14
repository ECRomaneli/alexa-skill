const { Skill } = require('../dist/module/main');
const { AttributeType } = require('../dist/module/enums/AttributeType');

exports.handler = Skill(($, builder) => {
    $.launch((context) => {
        context.hasSessionAttr().do((alexa, data) => {
            alexa.say('Welcome back. It looks like there are X more days until your y-th birthdayy.' + data.sessionAttr('day'));
        });

        context.default((alexa) => {
            alexa.ask(
                'Hello! Welcome to Caketime. What is your birthday?',
                'I was born Nov. 6th, 2014. When were you born?');
        });
    });
    
    $.on("CaptureBirthdayIntent", (context) => {
        context.default(async (alexa, data) => {
            await data.saveSlotsAsAttrs(AttributeType.PERSISTENT);
            alexa.say("Thanks, I'll remember that you were born {{month}} {{day}} {{year}}.");
        });
    });

    const LoadBirthdayInterceptor = {
        async process(handlerInput) {
            const attributesManager = handlerInput.attributesManager;
            const sessionAttributes = await attributesManager.getPersistentAttributes() || {};
            
            const year = sessionAttributes.hasOwnProperty('year') ? sessionAttributes.year : 0;
            const month = sessionAttributes.hasOwnProperty('month') ? sessionAttributes.month : 0;
            const day = sessionAttributes.hasOwnProperty('day') ? sessionAttributes.day : 0;
            
            if (year && month && day) {
                attributesManager.setSessionAttributes(sessionAttributes);
            }
        }
    }

    const { FileSystemPersistenceAdapter } = require('fs-persistence-adapter');
    builder.withPersistenceAdapter(
        new FileSystemPersistenceAdapter("data/")
    ).addRequestInterceptors(LoadBirthdayInterceptor);
});