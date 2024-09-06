"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Params = exports.protobufPackage = void 0;
/* eslint-disable */
const duration_1 = require("../../google/protobuf/duration");
const coin_1 = require("../../cosmos/base/v1beta1/coin");
const model_1 = require("./model");
const _m0 = __importStar(require("protobufjs/minimal"));
const helpers_1 = require("../../helpers");
exports.protobufPackage = "dht.v1";
function createBaseParams() {
    return {
        orchestratorValidTime: duration_1.Duration.fromPartial({}),
        minerValidTime: duration_1.Duration.fromPartial({}),
        adminAccount: "",
        orchestratorMinDeposit: coin_1.Coin.fromPartial({}),
        minerMinDeposit: coin_1.Coin.fromPartial({}),
        orchestratorUnbondingPeriod: duration_1.Duration.fromPartial({}),
        minerUnbondingPeriod: duration_1.Duration.fromPartial({}),
        labelAdminAccount: "",
        reputationAdminAccount: "",
        priceTokenDenoms: [],
        modelDefaultTokenPrice: undefined,
    };
}
exports.Params = {
    typeUrl: "/dht.v1.Params",
    encode(message, writer = _m0.Writer.create()) {
        if (message.orchestratorValidTime !== undefined) {
            duration_1.Duration.encode(message.orchestratorValidTime, writer.uint32(10).fork()).ldelim();
        }
        if (message.minerValidTime !== undefined) {
            duration_1.Duration.encode(message.minerValidTime, writer.uint32(18).fork()).ldelim();
        }
        if (message.adminAccount !== "") {
            writer.uint32(26).string(message.adminAccount);
        }
        if (message.orchestratorMinDeposit !== undefined) {
            coin_1.Coin.encode(message.orchestratorMinDeposit, writer.uint32(34).fork()).ldelim();
        }
        if (message.minerMinDeposit !== undefined) {
            coin_1.Coin.encode(message.minerMinDeposit, writer.uint32(42).fork()).ldelim();
        }
        if (message.orchestratorUnbondingPeriod !== undefined) {
            duration_1.Duration.encode(message.orchestratorUnbondingPeriod, writer.uint32(50).fork()).ldelim();
        }
        if (message.minerUnbondingPeriod !== undefined) {
            duration_1.Duration.encode(message.minerUnbondingPeriod, writer.uint32(58).fork()).ldelim();
        }
        if (message.labelAdminAccount !== "") {
            writer.uint32(66).string(message.labelAdminAccount);
        }
        if (message.reputationAdminAccount !== "") {
            writer.uint32(74).string(message.reputationAdminAccount);
        }
        for (const v of message.priceTokenDenoms) {
            writer.uint32(82).string(v);
        }
        if (message.modelDefaultTokenPrice !== undefined) {
            model_1.TokenPrice.encode(message.modelDefaultTokenPrice, writer.uint32(90).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseParams();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.orchestratorValidTime = duration_1.Duration.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.minerValidTime = duration_1.Duration.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.adminAccount = reader.string();
                    break;
                case 4:
                    message.orchestratorMinDeposit = coin_1.Coin.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.minerMinDeposit = coin_1.Coin.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.orchestratorUnbondingPeriod = duration_1.Duration.decode(reader, reader.uint32());
                    break;
                case 7:
                    message.minerUnbondingPeriod = duration_1.Duration.decode(reader, reader.uint32());
                    break;
                case 8:
                    message.labelAdminAccount = reader.string();
                    break;
                case 9:
                    message.reputationAdminAccount = reader.string();
                    break;
                case 10:
                    message.priceTokenDenoms.push(reader.string());
                    break;
                case 11:
                    message.modelDefaultTokenPrice = model_1.TokenPrice.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const obj = createBaseParams();
        if ((0, helpers_1.isSet)(object.orchestratorValidTime))
            obj.orchestratorValidTime = duration_1.Duration.fromJSON(object.orchestratorValidTime);
        if ((0, helpers_1.isSet)(object.minerValidTime))
            obj.minerValidTime = duration_1.Duration.fromJSON(object.minerValidTime);
        if ((0, helpers_1.isSet)(object.adminAccount))
            obj.adminAccount = String(object.adminAccount);
        if ((0, helpers_1.isSet)(object.orchestratorMinDeposit))
            obj.orchestratorMinDeposit = coin_1.Coin.fromJSON(object.orchestratorMinDeposit);
        if ((0, helpers_1.isSet)(object.minerMinDeposit))
            obj.minerMinDeposit = coin_1.Coin.fromJSON(object.minerMinDeposit);
        if ((0, helpers_1.isSet)(object.orchestratorUnbondingPeriod))
            obj.orchestratorUnbondingPeriod = duration_1.Duration.fromJSON(object.orchestratorUnbondingPeriod);
        if ((0, helpers_1.isSet)(object.minerUnbondingPeriod))
            obj.minerUnbondingPeriod = duration_1.Duration.fromJSON(object.minerUnbondingPeriod);
        if ((0, helpers_1.isSet)(object.labelAdminAccount))
            obj.labelAdminAccount = String(object.labelAdminAccount);
        if ((0, helpers_1.isSet)(object.reputationAdminAccount))
            obj.reputationAdminAccount = String(object.reputationAdminAccount);
        if (Array.isArray(object?.priceTokenDenoms))
            obj.priceTokenDenoms = object.priceTokenDenoms.map((e) => String(e));
        if ((0, helpers_1.isSet)(object.modelDefaultTokenPrice))
            obj.modelDefaultTokenPrice = model_1.TokenPrice.fromJSON(object.modelDefaultTokenPrice);
        return obj;
    },
    toJSON(message) {
        const obj = {};
        message.orchestratorValidTime !== undefined &&
            (obj.orchestratorValidTime = message.orchestratorValidTime
                ? duration_1.Duration.toJSON(message.orchestratorValidTime)
                : undefined);
        message.minerValidTime !== undefined &&
            (obj.minerValidTime = message.minerValidTime ? duration_1.Duration.toJSON(message.minerValidTime) : undefined);
        message.adminAccount !== undefined && (obj.adminAccount = message.adminAccount);
        message.orchestratorMinDeposit !== undefined &&
            (obj.orchestratorMinDeposit = message.orchestratorMinDeposit
                ? coin_1.Coin.toJSON(message.orchestratorMinDeposit)
                : undefined);
        message.minerMinDeposit !== undefined &&
            (obj.minerMinDeposit = message.minerMinDeposit ? coin_1.Coin.toJSON(message.minerMinDeposit) : undefined);
        message.orchestratorUnbondingPeriod !== undefined &&
            (obj.orchestratorUnbondingPeriod = message.orchestratorUnbondingPeriod
                ? duration_1.Duration.toJSON(message.orchestratorUnbondingPeriod)
                : undefined);
        message.minerUnbondingPeriod !== undefined &&
            (obj.minerUnbondingPeriod = message.minerUnbondingPeriod
                ? duration_1.Duration.toJSON(message.minerUnbondingPeriod)
                : undefined);
        message.labelAdminAccount !== undefined && (obj.labelAdminAccount = message.labelAdminAccount);
        message.reputationAdminAccount !== undefined &&
            (obj.reputationAdminAccount = message.reputationAdminAccount);
        if (message.priceTokenDenoms) {
            obj.priceTokenDenoms = message.priceTokenDenoms.map((e) => e);
        }
        else {
            obj.priceTokenDenoms = [];
        }
        message.modelDefaultTokenPrice !== undefined &&
            (obj.modelDefaultTokenPrice = message.modelDefaultTokenPrice
                ? model_1.TokenPrice.toJSON(message.modelDefaultTokenPrice)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = createBaseParams();
        if (object.orchestratorValidTime !== undefined && object.orchestratorValidTime !== null) {
            message.orchestratorValidTime = duration_1.Duration.fromPartial(object.orchestratorValidTime);
        }
        if (object.minerValidTime !== undefined && object.minerValidTime !== null) {
            message.minerValidTime = duration_1.Duration.fromPartial(object.minerValidTime);
        }
        message.adminAccount = object.adminAccount ?? "";
        if (object.orchestratorMinDeposit !== undefined && object.orchestratorMinDeposit !== null) {
            message.orchestratorMinDeposit = coin_1.Coin.fromPartial(object.orchestratorMinDeposit);
        }
        if (object.minerMinDeposit !== undefined && object.minerMinDeposit !== null) {
            message.minerMinDeposit = coin_1.Coin.fromPartial(object.minerMinDeposit);
        }
        if (object.orchestratorUnbondingPeriod !== undefined && object.orchestratorUnbondingPeriod !== null) {
            message.orchestratorUnbondingPeriod = duration_1.Duration.fromPartial(object.orchestratorUnbondingPeriod);
        }
        if (object.minerUnbondingPeriod !== undefined && object.minerUnbondingPeriod !== null) {
            message.minerUnbondingPeriod = duration_1.Duration.fromPartial(object.minerUnbondingPeriod);
        }
        message.labelAdminAccount = object.labelAdminAccount ?? "";
        message.reputationAdminAccount = object.reputationAdminAccount ?? "";
        message.priceTokenDenoms = object.priceTokenDenoms?.map((e) => e) || [];
        if (object.modelDefaultTokenPrice !== undefined && object.modelDefaultTokenPrice !== null) {
            message.modelDefaultTokenPrice = model_1.TokenPrice.fromPartial(object.modelDefaultTokenPrice);
        }
        return message;
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyYW1zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvZGVjL2RodC92MS9wYXJhbXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxvQkFBb0I7QUFDcEIsNkRBQTBEO0FBQzFELHlEQUFzRDtBQUN0RCxtQ0FBcUM7QUFDckMsd0RBQTBDO0FBQzFDLDJDQUEwRDtBQUM3QyxRQUFBLGVBQWUsR0FBRyxRQUFRLENBQUM7QUFleEMsU0FBUyxnQkFBZ0I7SUFDdkIsT0FBTztRQUNMLHFCQUFxQixFQUFFLG1CQUFRLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQztRQUMvQyxjQUFjLEVBQUUsbUJBQVEsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDO1FBQ3hDLFlBQVksRUFBRSxFQUFFO1FBQ2hCLHNCQUFzQixFQUFFLFdBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDO1FBQzVDLGVBQWUsRUFBRSxXQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQztRQUNyQywyQkFBMkIsRUFBRSxtQkFBUSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUM7UUFDckQsb0JBQW9CLEVBQUUsbUJBQVEsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDO1FBQzlDLGlCQUFpQixFQUFFLEVBQUU7UUFDckIsc0JBQXNCLEVBQUUsRUFBRTtRQUMxQixnQkFBZ0IsRUFBRSxFQUFFO1FBQ3BCLHNCQUFzQixFQUFFLFNBQVM7S0FDbEMsQ0FBQztBQUNKLENBQUM7QUFDWSxRQUFBLE1BQU0sR0FBRztJQUNwQixPQUFPLEVBQUUsZ0JBQWdCO0lBQ3pCLE1BQU0sQ0FBQyxPQUFlLEVBQUUsU0FBcUIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUU7UUFDOUQsSUFBSSxPQUFPLENBQUMscUJBQXFCLEtBQUssU0FBUyxFQUFFLENBQUM7WUFDaEQsbUJBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHFC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