import { NesaClient } from "./client";
import { ChainInfo } from "@keplr-wallet/types";
import { QueryGetModelResponse } from "./codec/dht/v1/query";
declare class WalletOperation {
    static getNesaClient(chainInfo: ChainInfo, offlineSigner: any): Promise<any>;
    static registerSession(client: NesaClient, modelName: string, lockAmount: string, denom: string, chainInfo: ChainInfo, offlineSigner: any): Promise<any>;
    static requestAgentInfo(client: NesaClient, agentName: string, modelName: string): Promise<any>;
    static requestParams(client: NesaClient): Promise<any>;
    static requestVrfSeed(client: NesaClient, offlineSigner: any): Promise<any>;
    static requestModel(client: NesaClient, modelName: string): Promise<QueryGetModelResponse>;
}
export default WalletOperation;
