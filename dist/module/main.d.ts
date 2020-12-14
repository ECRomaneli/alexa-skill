import { CustomSkillBuilder, LambdaHandler } from "ask-sdk-core";
import { Core } from "./modules/Core";
export declare type TrueSkill = ($: typeof Core) => void;
export declare function TrueSkill(skillHandler: TrueSkill, builder?: CustomSkillBuilder): LambdaHandler;
export declare const Skill: typeof TrueSkill;
