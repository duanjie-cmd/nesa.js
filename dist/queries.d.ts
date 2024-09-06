/// <reference types="long" />
import { QueryClient } from "@cosmjs/stargate";
import { QueryParamsResponse, QueryInferenceAgentResponse, QuerySessionResponse, QueryVRFSeedResponse, QuerySessionByAgentResponse } from "./codec/agent/v1/query";
import { SessionStatus } from "./codec/agent/v1/agent";
import { QueryAllBalancesResponse } from './codec/cosmos/bank/v1beta1/query';
import { PageRequest } from "./codec/cosmos/base/query/v1beta1/pagination";
export interface AgentExtension {
    readonly agent: {
        readonly params: () => Promise<QueryParamsResponse>;
        readonly inferenceAgentRequest: (account: string, modelName: string, limit: Long, key: Uint8Array) => Promise<QueryInferenceAgentResponse>;
        readonly sessionRequest: (id: string) => Promise<QuerySessionResponse>;
        readonly sessionByAgentRequest: (account: string, status: SessionStatus | undefined, expireTime: Date, limit: Long, orderDesc: boolean, key: Uint8Array) => Promise<QuerySessionByAgentResponse>;
        readonly VRFSeedRequest: (account: string) => Promise<QueryVRFSeedResponse>;
    };
}
export declare function setupAgentExtension(base: QueryClient): AgentExtension;
export declare function setupSendExtension(base: QueryClient): {
    send: {
        allBalances: (address: string, pagination?: PageRequest) => Promise<QueryAllBalancesResponse>;
    };
};
