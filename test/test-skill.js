const { Skill } = require('../dist/module/main');
const { AttributeType } = require('../dist/module/enums/AttributeType');
const { InterceptorType } = require('../dist/module/enums/InterceptorType');
const { FileSystemPersistenceAdapter } = require('fs-persistence-adapter');

exports.handler = Skill(($) => {
    $.launch((context) => {
        context.hasSessionAttr(['day', 'month', 'year']).do(async (response, data) => {
            let userTimeZone;

        try {
            const serviceClient = data.getServiceClient();
            userTimeZone = await serviceClient.getSystemTimeZone(data.getDeviceId());
        } catch (error) {
            if (error.name !== 'ServiceError') {
                return response.say("Tive um problema conectando no servisso."); // Problema com acentuacao
            }
            console.log('error', error.message);
        }
            const birthday = getNextBirthday(data.sessionAttr('day'), data.sessionAttr('month'), data.sessionAttr('year'), userTimeZone);
            if (birthday.nextBirthday < 1) {
                return response.say('Hoje eh seu aniversario, parabens!');
            }
            response.say(`Bem vindo de volta. Faltam ${birthday.nextBirthday} dias para o seu aniversario de ${birthday.age} anos.`);
        });

        context.default((response) => {
            response.ask(
                'Oi! Bem vindo ao Hora do bolo. Quando eh seu aniversahrio?',
                'Eu nasci em 6 de novembro de 2014. Quando voce nasceu?');
        });
    });
    
    $.on('CaptureBirthdayIntent', true, async (response, data) => {
        await data.saveSlotsAsAttrs(AttributeType.PERSISTENT);
        response.say('Uau! Vou me lembrar que voce nasceu em {{day}} de {{month}} de {{year}}.');
    });

    $.intercept(InterceptorType.REQUEST, async function loadBirthday(data) {
        await data.swapAttrs(AttributeType.PERSISTENT, AttributeType.SESSION, ['day', 'month', 'year']);
    });

    $   .help(true, (response) => response.ask('Voce pode dizer um "oi" pra mim! Como posso te ajudar?'))
        .cancel(true, (response) => response.say('Cancelado. Tchau!'))
        .stop(true, (response) => response.say('Tchau!'))
        .intent(true, (response) => response.say('Voce apenas acionou um intent nao capturada!'))
        .sessionEnded(true, (response) => { response.say('Fim da sessao'); })
        .withPersistenceAdapter(new FileSystemPersistenceAdapter('data/'))
        .withApiClient();
});

function getNextBirthday(day, month, year, timeZone) {
    const oneDay = 24*60*60*1000;

    // getting the current date with the time
    const currentDateTime = new Date(new Date().toLocaleString(["pt-BR", "en-US"], { timeZone }));

    // removing the time from the date because it affects our difference calculation
    const currentDate = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate());
    let currentYear = currentDate.getFullYear();

    let nextBirthday = Date.parse(`${month} ${day}, ${currentYear}`);

    if (currentDate.getTime() > nextBirthday) {
        nextBirthday = Date.parse(`${month} ${day}, ${++currentYear}`);
    }

    return {
        age: currentYear - year,
        nextBirthday: (nextBirthday - currentDate.getTime()) / oneDay
    };
}