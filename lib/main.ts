import { CustomSkillBuilder, LambdaHandler, SkillBuilders } from "ask-sdk-core";
import { Core } from "./modules/Core";

export type TrueSkill = ($: typeof Core) => void;
export function TrueSkill(skillHandler: TrueSkill, builder: CustomSkillBuilder = SkillBuilders.custom()): LambdaHandler {
    skillHandler.call(Core, Core, builder);
    Core.persAdapter !== void 0 && builder.withPersistenceAdapter(Core.persAdapter);
    Core.handlers.length && builder.addRequestHandlers.apply(builder, Core.handlers);
    Core.requestInterceptors.length && builder.addRequestInterceptors.apply(builder, Core.requestInterceptors);
    Core.responseInterceptors.length && builder.addResponseInterceptors.apply(builder, Core.responseInterceptors);
    return builder.withCustomUserAgent(Core.userAgent || 'trueskill/app').lambda();
}
export const Skill = TrueSkill;