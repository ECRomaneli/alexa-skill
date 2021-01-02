import ASKCore = require('ask-sdk-core');
import { AttributeType } from "../enums/Attributetype";
import { RuleStatus } from "../enums/RuleStatus";
import { Data } from "./Data";
import { InputWrapper } from "./InputWrapper";
import { isEmptyObject } from "../utils/Object";
import { Relative } from "../utils/Response";
import { Response } from 'ask-sdk-model';

export type RequestHandler = (response: Response, data?: Data) => Relative<void>;
type Condition = () => Relative<boolean>;
type ContextRule = { status: RuleStatus, not?: boolean, conditions: Condition[], handler?: RequestHandler };

export class Context extends InputWrapper {
    public static NoRulesAcceptedException = "NoRulesAcceptedException";
    private async: true | void;
    private data: Data = new Data(this.handlerInput);
    private rules: ContextRule[] = [];

    public not() : this {
        this.getCurrentRule().not = true;
        return this;
    }

    public hasSlot(slotNames?: string | string[]): this {
        slotNames = (slotNames instanceof Array) ? slotNames : [slotNames];
        return this.when(slotNames && slotNames.length ?
            (() => (<string[]> slotNames).every(slotName => this.data.hasSlot(slotName))) :
            (() => !isEmptyObject(this.data.getSlots()))
        );
    }

    public hasRequestAttr(attrNames?: string | string[]): this {
        return this.hasAttr(AttributeType.REQUEST, attrNames);
    }

    public hasSessionAttr(attrNames?: string | string[]): this {
        return this.hasAttr(AttributeType.SESSION, attrNames);
    }

    public hasPersistentAttr(attrNames?: string | string[]): this {
        return this.hasAttr(AttributeType.PERSISTENT, attrNames);
    }

    public hasAttr(type: AttributeType, attrNames?: string | string[]): this {
        if (type === AttributeType.PERSISTENT) {
            this.async = true;
        }
        return this.when(attrNames && attrNames.length ?
            (() => !!this.data.hasAttr(type, attrNames)) :
            (() => !isEmptyObject(this.data.getAttrs(type)))
        );
    }

    public when(condition: Condition): this {
        this.getCurrentRule().conditions.push(condition);
        return this;
    }

    public do(handler: RequestHandler): void {
        this.getCurrentRule().handler = handler;
        this.createRule();
    }

    public default(handler: RequestHandler): void {
        let rule: ContextRule = this.getCurrentRule();
        rule.status = RuleStatus.ACCEPTED;
        rule.handler = handler;
    }

    public getHandler(): RequestHandler {
        let rule = this.rules.find(r => r.status === RuleStatus.ACCEPTED);
        if (!rule) { throw Context.NoRulesAcceptedException; }
        return rule.handler;
    }

    public getRequestType(): string {
        return ASKCore.getRequestType(this.getRequestEnvelope());
    }

    public getIntentName(): string {
        return ASKCore.getIntentName(this.getRequestEnvelope());
    }

    public resolve(): Relative<boolean> {
        if (!this.async) { return this.rules.some(r => this.resolveRule(r)); }

        return (async () => {
            for (let i = 0; i < this.rules.length; ++i) {
                let result = await this.resolveRule(this.rules[i]);
                if (result) { return true; }
            }
            return false;
        })();
    }

    private resolveRule(rule: ContextRule): Relative<boolean> {
        if (!this.async) {
            if (rule.conditions.some(c => rule.not ? c() : !c())) {
                rule.status = RuleStatus.REJECTED;
                return false;
            }
            rule.status = RuleStatus.ACCEPTED;
            return true;
        }

        return (async () => {
            for (let i = 0; i < rule.conditions.length; ++i) {
                let result = await rule.conditions[i]();
                if (rule.not ? result : !result) {
                    rule.status = RuleStatus.REJECTED;
                    return false;
                }
            }
            rule.status = RuleStatus.ACCEPTED;
            return true;
        })();
    }

    private createRule(): void {
        this.rules.push({ status: RuleStatus.PENDING, conditions: [] });
    }

    private getCurrentRule(): ContextRule {
        if (this.rules.length === 0) { this.createRule(); }
        return this.rules[this.rules.length - 1];
    }
}