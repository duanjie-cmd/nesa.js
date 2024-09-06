"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSendExtension = exports.setupAgentExtension = void 0;
const stargate_1 = require("@cosmjs/stargate");
const query_1 = require("./codec/agent/v1/query");
const helpers_1 = require("./codec/helpers");
// import {
//   SessionStatus
// } from './codec/agent/v1/agent';
const query_2 = require("./codec/cosmos/bank/v1beta1/query");
// public async getSessionByAgent(account: string, status: SessionStatus, limit: Long, orderDesc: boolean, key: Uint8Array, expireTime?: Date): Promise<QuerySessionByAgentResponse> {
//   const result = await this.query.agent.sessionByAgentRequest(account, status, expireTime, limit, orderDesc, key);
//   return result;
// }
function setupAgentExtension(base) {
    const rpc = (0, stargate_1.createProtobufRpcClient)(base);
    const agentQueryService = new query_1.QueryClientImpl(rpc);
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
            inferenceAgentRequest: async (account, modelName, limit, key) => {
                return await agentQueryService.InferenceAgentRequest({ account, modelName, limit, key });
            },
            sessionRequest: async (id) => {
                return await agentQueryService.SessionRequest({ id });
            },
            sessionByAgentRequest: async (account, status, expireTime, limit, orderDesc, key) => {
                return await agentQueryService.SessionByAgentRequest({ account, status, expireTime: (0, helpers_1.toTimestamp)(expireTime), limit, orderDesc, key });
            },
            VRFSeedRequest: async (account) => {
                return await agentQueryService.VRFSeedRequest({ account });
            }
        }
    };
}
exports.setupAgentExtension = setupAgentExtension;
function setupSendExtension(base) {
    const rpc = (0, stargate_1.createProtobufRpcClient)(base);
    const sendQueryService = new query_2.QueryClientImpl(rpc);
    return {
        send: {
            allBalances: async (address, pagination) => {
                return await sendQueryService.AllBalances({
                    address,
                    pagination
                });
            },
        }
    };
}
exports.setupSendExtension = setupSendExtension;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9xdWVyaWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLCtDQUcwQjtBQUMxQixrREFVZ0M7QUFHaEMsNkNBQThDO0FBQzlDLFdBQVc7QUFDWCxrQkFBa0I7QUFDbEIsbUNBQW1DO0FBQ25DLDZEQUcyQztBQWMzQyxzTEFBc0w7QUFDdEwscUhBQXFIO0FBQ3JILG1CQUFtQjtBQUNuQixJQUFJO0FBQ0osU0FBZ0IsbUJBQW1CLENBQUMsSUFBaUI7SUFDbkQsTUFBTSxHQUFHLEdBQUcsSUFBQSxrQ0FBdUIsRUFBQyxJQUFJLENBQUMsQ0FBQztJQUMxQyxNQUFNLGlCQUFpQixHQUFHLElBQUksdUJBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUUvQyxPQUFPO1FBQ0wsS0FBSyxFQUFFO1lBQ0wsMENBQTBDO1lBQzFDLDJEQUEyRDtZQUMzRCxLQUFLO1lBQ0wsa0hBQWtIO1lBQ2xILDZHQUE2RztZQUM3RyxLQUFLO1lBQ0wsTUFBTSxFQUFFLEtBQUssSUFBSSxFQUFFO2dCQUNqQixPQUFPLE1BQU0saUJBQWlCLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzVDLENBQUM7WUFDRCxxQkFBcUIsRUFBRSxLQUFLLEVBQUUsT0FBZSxFQUFFLFNBQWlCLEVBQUUsS0FBVyxFQUFFLEdBQWUsRUFBRSxFQUFFO2dCQUNoRyxPQUFPLE1BQU0saUJBQWlCLENBQUMscUJBQXFCLENBQUMsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQzNGLENBQUM7WUFDRCxjQUFjLEVBQUUsS0FBSyxFQUFFLEVBQVUsRUFBRSxFQUFFO2dCQUNuQyxPQUFPLE1BQU0saUJBQWlCLENBQUMsY0FBYyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUN4RCxDQUFDO1lBQ0QscUJBQXFCLEVBQUUsS0FBSyxFQUFFLE9BQWUsRUFBRSxNQUFpQyxFQUFFLFVBQWdCLEVBQUUsS0FBVyxFQUFFLFNBQWtCLEVBQUUsR0FBZSxFQUFFLEVBQUU7Z0JBQ3RKLE9BQU8sTUFBTSxpQkFBaUIsQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUMsVUFBVSxFQUFHLElBQUEscUJBQVcsRUFBQyxVQUFVLENBQUMsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDeEksQ0FBQztZQUNELGNBQWMsRUFBRSxLQUFLLEVBQUUsT0FBZSxFQUFFLEVBQUU7Z0JBQ3hDLE9BQU8sTUFBTSxpQkFBaUIsQ0FBQyxjQUFjLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1lBQzdELENBQUM7U0FDRjtLQUNGLENBQUE7QUFDSCxDQUFDO0FBN0JELGtEQTZCQztBQUVELFNBQWdCLGtCQUFrQixDQUFDLElBQWlCO0lBQ2xELE1BQU0sR0FBRyxHQUFHLElBQUEsa0NBQXVCLEVBQUMsSUFBSSxDQUFDLENBQUM7SUFDMUMsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLHVCQUFlLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbEQsT0FBTztRQUNMLElBQUksRUFBRTtZQUNKLFdBQVcsRUFBRSxLQUFLLEVBQUUsT0FBYyxFQUFFLFVBQXdCLEVBQXFDLEVBQUU7Z0JBQ2pHLE9BQU8sTUFBTSxnQkFBZ0IsQ0FBQyxXQUFXLENBQUM7b0JBQ3hDLE9BQU87b0JBQ1AsVUFBVTtpQkFDWCxDQUFDLENBQUM7WUFDTCxDQUFDO1NBQ0Y7S0FDRixDQUFBO0FBQ0gsQ0FBQztBQWJELGdEQWFDIn0=