const { Skill } = require('../dist/module/trueskill');

exports.handler = Skill(($) => {
    $.launch((context) => {
        context.default((alexa) => {
            alexa.ask(
                'Hello! Welcome to Caketime. What is your birthday?',
                'I was born Nov. 6th, 2014. When were you born?');
        });
    });
    
    $.on("CaptureBirthdayIntent", (context) => {
        context.hasSlot("day").do((alexa) => {
            alexa.say("Ahaa, seu aniversario eh em {{day}} de {{month}} de {{year}}!");
        });
    });
});