"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupDHTExtension = exports.setupAgentExtension = void 0;
const stargate_1 = require("@cosmjs/stargate");
const query_1 = require("./codec/agent/v1/query");
const helpers_1 = require("./codec/helpers");
const query_2 = require("./codec/dht/v1/query");
function setupAgentExtension(base) {
    const rpc = (0, stargate_1.createProtobufRpcClient)(base);
    const agentQueryService = new query_1.QueryClientImpl(rpc);
    return {
        agent: {
            agentQueryService,
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
function setupDHTExtension(base) {
    const rpc = (0, stargate_1.createProtobufRpcClient)(base);
    const dhtQueryService = new query_2.QueryClientImpl(rpc);
    return {
        dht: {
            dhtQueryService,
            getModel: async (modelName) => {
                return await dhtQueryService.GetModel({
                    modelName
                });
            },
        }
    };
}
exports.setupDHTExtension = setupDHTExtension;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9xdWVyaWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLCtDQUcwQjtBQUMxQixrREFFZ0M7QUFFaEMsNkNBQThDO0FBQzlDLGdEQUU4QjtBQUc5QixTQUFnQixtQkFBbUIsQ0FBQyxJQUFpQjtJQUNuRCxNQUFNLEdBQUcsR0FBRyxJQUFBLGtDQUF1QixFQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFDLE1BQU0saUJBQWlCLEdBQUcsSUFBSSx1QkFBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRS9DLE9BQU87UUFDTCxLQUFLLEVBQUU7WUFDTCxpQkFBaUI7WUFDakIsTUFBTSxFQUFFLEtBQUssSUFBSSxFQUFFO2dCQUNqQixPQUFPLE1BQU0saUJBQWlCLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzVDLENBQUM7WUFDRCxxQkFBcUIsRUFBRSxLQUFLLEVBQUUsT0FBZSxFQUFFLFNBQWlCLEVBQUUsS0FBVyxFQUFFLEdBQWUsRUFBRSxFQUFFO2dCQUNoRyxPQUFPLE1BQU0saUJBQWlCLENBQUMscUJBQXFCLENBQUMsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQzNGLENBQUM7WUFDRCxjQUFjLEVBQUUsS0FBSyxFQUFFLEVBQVUsRUFBRSxFQUFFO2dCQUNuQyxPQUFPLE1BQU0saUJBQWlCLENBQUMsY0FBYyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUN4RCxDQUFDO1lBQ0QscUJBQXFCLEVBQUUsS0FBSyxFQUFFLE9BQWUsRUFBRSxNQUFpQyxFQUFDLFVBQWdCLEVBQUUsS0FBVyxFQUFFLFNBQWtCLEVBQUUsR0FBZSxFQUFFLEVBQUU7Z0JBQ3JKLE9BQU8sTUFBTSxpQkFBaUIsQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLElBQUEscUJBQVcsRUFBQyxVQUFVLENBQUMsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDeEksQ0FBQztZQUNELGNBQWMsRUFBRSxLQUFLLEVBQUUsT0FBZSxFQUFFLEVBQUU7Z0JBQ3hDLE9BQU8sTUFBTSxpQkFBaUIsQ0FBQyxjQUFjLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1lBQzdELENBQUM7U0FDRjtLQUNGLENBQUE7QUFDSCxDQUFDO0FBeEJELGtEQXdCQztBQUVELFNBQWdCLGlCQUFpQixDQUFDLElBQWlCO0lBQ2pELE1BQU0sR0FBRyxHQUFHLElBQUEsa0NBQXVCLEVBQUMsSUFBSSxDQUFDLENBQUM7SUFDMUMsTUFBTSxlQUFlLEdBQUcsSUFBSSx1QkFBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRWhELE9BQU87UUFDTCxHQUFHLEVBQUU7WUFDSCxlQUFlO1lBQ2YsUUFBUSxFQUFFLEtBQUssRUFBRSxTQUFpQixFQUFFLEVBQUU7Z0JBQ3BDLE9BQU8sTUFBTSxlQUFlLENBQUMsUUFBUSxDQUFDO29CQUNwQyxTQUFTO2lCQUNWLENBQUMsQ0FBQztZQUNMLENBQUM7U0FDRjtLQUNGLENBQUE7QUFDSCxDQUFDO0FBZEQsOENBY0MifQ==