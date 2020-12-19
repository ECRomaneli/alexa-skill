import { CustomSkillBuilder, LambdaHandler, SkillBuilders } from "ask-sdk-core";
import { Core } from "./modules/Core";
const { version } = require('../../package.json');

export type TrueSkill = ($: typeof Core) => void;
export function TrueSkill(skillHandler: TrueSkill, builder: CustomSkillBuilder = SkillBuilders.custom()): LambdaHandler {
    skillHandler.call(Core, Core, builder);
    Core.persistenceAdapter !== void 0 && builder.withPersistenceAdapter(Core.persistenceAdapter);
    Core.apiClient !== void 0 && builder.withApiClient(Core.apiClient);
    Core.handlers.length && builder.addRequestHandlers.apply(builder, Core.handlers);
    Core.requestInterceptors.length && builder.addRequestInterceptors.apply(builder, Core.requestInterceptors);
    Core.responseInterceptors.length && builder.addResponseInterceptors.apply(builder, Core.responseInterceptors);
    return builder.withCustomUserAgent(Core.userAgent || `trueskill/${version}`).lambda();
}
export const Skill = TrueSkill;