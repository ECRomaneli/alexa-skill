const { Skill } = require('../dist/module/main');
const { AttributeType } = require('../dist/module/enums/AttributeType');
const { InterceptorType } = require('../dist/module/enums/InterceptorType');
const { FileSystemPersistenceAdapter } = require('fs-persistence-adapter');

exports.handler = Skill(($) => {
    $.launch((context) => {
        context.hasSessionAttr(['day', 'month', 'year']).do((alexa, data) => {
            let day = data.sessionAttr('day');
            let month = data.sessionAttr('month');
            let year = data.sessionAttr('year');
            alexa.say('Bem vindo de volta. Voce nasceu em {{day}} de {{month}} de {{year}}. Teste: ');
        });

        context.default((alexa) => {
            alexa.ask(
                'Oi! Bem vindo ao Hora do bolo. Quando eh seu aniversahrio?',
                'Eu nasci em 6 de novembro de 2014. Quando voce nasceu?');
        });
    });
    
    $.on('CaptureBirthdayIntent', true, async (alexa, data) => {
        await data.saveSlotsAsAttrs(AttributeType.PERSISTENT);
        alexa.say('Uau! Vou me lembrar que voce nasceu em {{day}} de {{month}} de {{year}}.');
    });

    $.intercept(InterceptorType.REQUEST, async function loadBirthday(data) {
        await data.swapAttrs(AttributeType.PERSISTENT, AttributeType.SESSION, ['day', 'month', 'year']);
    })

    $   .help(true, (alexa) => alexa.ask('Voce pode dizer um "oi" pra mim! Como posso te ajudar?'))
        .cancel(true, (alexa) => alexa.say('Cancelado. Tchau!'))
        .stop(true, (alexa) => alexa.say('Tchau!'))
        .intent(true, (alexa) => alexa.say('Voce apenas acionou um intent nao capturada!'))
        .sessionEnded(true, (alexa) => { alexa.say('Fim da sessao'); })
        .persistenceAdapter(new FileSystemPersistenceAdapter('data/'));
});