"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skill = exports.TrueSkill = void 0;
const ask_sdk_core_1 = require("ask-sdk-core");
const Core_1 = require("./modules/Core");
const { version } = require('../../package.json');
function TrueSkill(skillHandler, builder = ask_sdk_core_1.SkillBuilders.custom()) {
    skillHandler.call(Core_1.Core, Core_1.Core, builder);
    Core_1.Core.persistenceAdapter !== void 0 && builder.withPersistenceAdapter(Core_1.Core.persistenceAdapter);
    Core_1.Core.apiClient !== void 0 && builder.withApiClient(Core_1.Core.apiClient);
    Core_1.Core.handlers.length && builder.addRequestHandlers.apply(builder, Core_1.Core.handlers);
    Core_1.Core.requestInterceptors.length && builder.addRequestInterceptors.apply(builder, Core_1.Core.requestInterceptors);
    Core_1.Core.responseInterceptors.length && builder.addResponseInterceptors.apply(builder, Core_1.Core.responseInterceptors);
    return builder.withCustomUserAgent(Core_1.Core.userAgent || `trueskill/${version}`).lambda();
}
exports.TrueSkill = TrueSkill;
exports.Skill = TrueSkill;
