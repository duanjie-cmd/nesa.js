import { QueryClient } from "@cosmjs/stargate";
import { QueryClientImpl as ClientQuery } from "./codec/agent/v1/query";
import { SessionStatus } from "./codec/agent/v1/agent";
import { QueryClientImpl as DHTClientQuery } from "./codec/dht/v1/query";
export declare function setupAgentExtension(base: QueryClient): {
    agent: {
        agentQueryService: ClientQuery;
        params: () => Promise<import("./codec/agent/v1/query").QueryParamsResponse>;
        inferenceAgentRequest: (account: string, modelName: string, limit: Long, key: Uint8Array) => Promise<import("./codec/agent/v1/query").QueryInferenceAgentResponse>;
        sessionRequest: (id: string) => Promise<import("./codec/agent/v1/query").QuerySessionResponse>;
        sessionByAgentRequest: (account: string, status: SessionStatus | undefined, expireTime: Date, limit: Long, orderDesc: boolean, key: Uint8Array) => Promise<import("./codec/agent/v1/query").QuerySessionByAgentResponse>;
        VRFSeedRequest: (account: string) => Promise<import("./codec/agent/v1/query").QueryVRFSeedResponse>;
    };
};
export declare function setupDHTExtension(base: QueryClient): {
    dht: {
        dhtQueryService: DHTClientQuery;
        getModel: (modelName: string) => Promise<import("./codec/dht/v1/query").QueryGetModelResponse>;
    };
};
