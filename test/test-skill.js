const { Skill, AttributeType } = require('../dist/module/trueskill');

exports.handler = Skill(($, builder) => {
    $.launch((context) => {
        context.hasSessionAttr(['day', 'month', 'year']).do((alexa) => {
            alexa.say('Welcome back. It looks like there are X more days until your y-th birthday.');
        });

        context.default((alexa) => {
            alexa.ask(
                'Hello! Welcome to Caketime. What is your birthday?',
                'I was born Nov. 6th, 2014. When were you born?');
        });
    });
    
    $.on("CaptureBirthdayIntent", (context) => {
        // context.hasSessionAttr(['day', 'month', 'year']).do((alexa) => {

        // });

        context.default(async (alexa, data) => {
            await data.saveSlotsAsAttrs(AttributeType.PERSISTENT);
            alexa.say("Thanks, I'll remember that you were born {{month}} {{day}} {{year}}.");
        });
    });
});