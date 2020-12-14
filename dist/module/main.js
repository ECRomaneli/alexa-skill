"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skill = exports.TrueSkill = void 0;
const ask_sdk_core_1 = require("ask-sdk-core");
const Core_1 = require("./modules/Core");
function TrueSkill(skillHandler, builder = ask_sdk_core_1.SkillBuilders.custom()) {
    skillHandler.call(Core_1.Core, Core_1.Core, builder);
    builder.addRequestHandlers.apply(builder, Core_1.Core.handlers);
    return builder.withCustomUserAgent('trueskill/app').lambda();
}
exports.TrueSkill = TrueSkill;
exports.Skill = TrueSkill;
