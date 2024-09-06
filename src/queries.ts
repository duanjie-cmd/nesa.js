import {
  createProtobufRpcClient,
  QueryClient,
} from "@cosmjs/stargate";
import {
  QueryClientImpl as ClientQuery,
  // QueryModelAllResponse,
  // QueryModelResponse,
  QueryParamsResponse,
  QueryInferenceAgentResponse,
  QuerySessionResponse,
  QueryVRFSeedResponse,
  QuerySessionByAgentResponse,
  // QuerySessionByAgentResponse
} from "./codec/agent/v1/query";
// ./codec/agent/v1/query
import { SessionStatus } from "./codec/agent/v1/agent";
import { toTimestamp } from "./codec/helpers";
// import {
//   SessionStatus
// } from './codec/agent/v1/agent';
import {
  QueryClientImpl as SendClientQuery,
  QueryAllBalancesResponse
 } from './codec/cosmos/bank/v1beta1/query'
import { PageRequest } from "./codec/cosmos/base/query/v1beta1/pagination";

export interface AgentExtension {
  readonly agent: {
    // readonly modelRequest: (name: string) => Promise<QueryModelResponse>;
    // readonly modelRequestAll: (key: Uint8Array, offset: Long, limit: Long, countTotal: boolean, reverse: boolean) => Promise<QueryModelAllResponse>;
    readonly params: () => Promise<QueryParamsResponse>;
    readonly inferenceAgentRequest: (account: string, modelName: string, limit: Long, key: Uint8Array) => Promise<QueryInferenceAgentResponse>;
    readonly sessionRequest: (id: string) => Promise<QuerySessionResponse>;
    readonly sessionByAgentRequest: (account: string, status: SessionStatus | undefined,expireTime: Date, limit: Long, orderDesc: boolean, key: Uint8Array, ) => Promise<QuerySessionByAgentResponse>;
    readonly VRFSeedRequest: (account: string) => Promise<QueryVRFSeedResponse>;
  };
}
// public async getSessionByAgent(account: string, status: SessionStatus, limit: Long, orderDesc: boolean, key: Uint8Array, expireTime?: Date): Promise<QuerySessionByAgentResponse> {
//   const result = await this.query.agent.sessionByAgentRequest(account, status, expireTime, limit, orderDesc, key);
//   return result;
// }
export function setupAgentExtension(base: QueryClient): AgentExtension {
  const rpc = createProtobufRpcClient(base);
  const agentQueryService = new ClientQuery(rpc);

  return {
    agent: {
      // modelRequest: async (name: string) => {
      //   return await agentQueryService.ModelRequest({ name });
      // },
      // modelRequestAll: async (key: Uint8Array, offset: Long, limit: Long, countTotal: boolean, reverse: boolean) => {
      //   return await agentQueryService.ModelRequestAll({pagination: {key, offset, limit, countTotal, reverse}});
      // },
      params: async () => {
        return await agentQueryService.Params({});
      },
      inferenceAgentRequest: async (account: string, modelName: string, limit: Long, key: Uint8Array) => {
        return await agentQueryService.InferenceAgentRequest({ account, modelName, limit, key });
      },
      sessionRequest: async (id: string) => {
        return await agentQueryService.SessionRequest({ id });
      },
      sessionByAgentRequest: async (account: string, status: SessionStatus | undefined, expireTime: Date, limit: Long, orderDesc: boolean, key: Uint8Array) => {
        return await agentQueryService.SessionByAgentRequest({ account, status,expireTime : toTimestamp(expireTime), limit, orderDesc, key });
      },
      VRFSeedRequest: async (account: string) => {
        return await agentQueryService.VRFSeedRequest({ account });
      }
    }
  }
}

export function setupSendExtension(base: QueryClient) {
  const rpc = createProtobufRpcClient(base);
  const sendQueryService = new SendClientQuery(rpc);
  return {
    send: {
      allBalances: async (address:string, pagination?: PageRequest): Promise<QueryAllBalancesResponse> => {
        return await sendQueryService.AllBalances({
          address,
          pagination
        });
      },
    }
  }
}
