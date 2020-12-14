import { CustomSkillBuilder, LambdaHandler, SkillBuilders } from "ask-sdk-core";
import { Core } from "./modules/Core";

export type TrueSkill = ($: typeof Core) => void;
export function TrueSkill(skillHandler: TrueSkill, builder: CustomSkillBuilder = SkillBuilders.custom()): LambdaHandler {
    skillHandler.call(Core, Core, builder);
    builder.addRequestHandlers.apply(builder, Core.handlers);
    return builder.withCustomUserAgent('trueskill/app').lambda();
}
export const Skill = TrueSkill;