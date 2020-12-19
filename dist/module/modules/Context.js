"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
const ASKCore = require("ask-sdk-core");
const Attributetype_1 = require("../enums/Attributetype");
const RuleStatus_1 = require("../enums/RuleStatus");
const Data_1 = require("./Data");
const InputWrapper_1 = require("./InputWrapper");
const Object_1 = require("../utils/Object");
class Context extends InputWrapper_1.InputWrapper {
    constructor() {
        super(...arguments);
        this.data = new Data_1.Data(this.handlerInput);
        this.rules = [];
    }
    not() {
        this.getCurrentRule().not = true;
        return this;
    }
    hasSlot(slotNames) {
        slotNames = (slotNames instanceof Array) ? slotNames : [slotNames];
        return this.when(slotNames && slotNames.length ?
            (() => slotNames.every(slotName => this.data.hasSlot(slotName))) :
            (() => !Object_1.isEmptyObject(this.data.getSlots())));
    }
    hasRequestAttr(attrNames) {
        return this.hasAttr(Attributetype_1.AttributeType.REQUEST, attrNames);
    }
    hasSessionAttr(attrNames) {
        return this.hasAttr(Attributetype_1.AttributeType.SESSION, attrNames);
    }
    hasPersistentAttr(attrNames) {
        return this.hasAttr(Attributetype_1.AttributeType.PERSISTENT, attrNames);
    }
    hasAttr(type, attrNames) {
        if (type === Attributetype_1.AttributeType.PERSISTENT) {
            this.async = true;
        }
        return this.when(attrNames && attrNames.length ?
            (() => !!this.data.hasAttr(type, attrNames)) :
            (() => !Object_1.isEmptyObject(this.data.getAttrs(type))));
    }
    when(condition) {
        this.getCurrentRule().conditions.push(condition);
        return this;
    }
    do(handler) {
        this.getCurrentRule().handler = handler;
        this.createRule();
    }
    default(handler) {
        let rule = this.getCurrentRule();
        rule.status = RuleStatus_1.RuleStatus.ACCEPTED;
        rule.handler = handler;
    }
    getHandler() {
        let rule = this.rules.find(r => r.status === RuleStatus_1.RuleStatus.ACCEPTED);
        if (!rule) {
            throw Context.NoRulesAcceptedException;
        }
        return rule.handler;
    }
    getRequestType() {
        return ASKCore.getRequestType(this.getRequestEnvelope());
    }
    getIntentName() {
        return ASKCore.getIntentName(this.getRequestEnvelope());
    }
    resolve() {
        if (!this.async) {
            return this.rules.some(r => this.resolveRule(r));
        }
        return (() => __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < this.rules.length; ++i) {
                let result = yield this.resolveRule(this.rules[i]);
                if (result) {
                    return true;
                }
            }
            return false;
        }))();
    }
    resolveRule(rule) {
        if (!this.async) {
            if (rule.conditions.some(c => rule.not ? c() : !c())) {
                rule.status = RuleStatus_1.RuleStatus.REJECTED;
                return false;
            }
            rule.status = RuleStatus_1.RuleStatus.ACCEPTED;
            return true;
        }
        return (() => __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < rule.conditions.length; ++i) {
                let result = yield rule.conditions[i]();
                if (rule.not ? result : !result) {
                    rule.status = RuleStatus_1.RuleStatus.REJECTED;
                    return false;
                }
            }
            rule.status = RuleStatus_1.RuleStatus.ACCEPTED;
            return true;
        }))();
    }
    createRule() {
        this.rules.push({ status: RuleStatus_1.RuleStatus.PENDING, conditions: [] });
    }
    getCurrentRule() {
        if (this.rules.length === 0) {
            this.createRule();
        }
        return this.rules[this.rules.length - 1];
    }
}
exports.Context = Context;
Context.NoRulesAcceptedException = "NoRulesAcceptedException";
