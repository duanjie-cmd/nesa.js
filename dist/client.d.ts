/// <reference types="long" />
import { OfflineSigner } from "@cosmjs/proto-signing";
import { SigningStargateClient, SigningStargateClientOptions, GasPrice, Event, QueryClient } from "@cosmjs/stargate";
import { CometClient } from "@cosmjs/tendermint-rpc";
import { Logger } from './logger';
import { VRF } from './codec/agent/v1/tx';
import { Payment, Params, SessionStatus, TokenPrice } from "./codec/agent/v1/agent";
import { Coin } from "./codec/cosmos/base/v1beta1/coin";
import { setupAgentExtension, setupDHTExtension } from './queries';
import { QueryParamsResponse, QueryInferenceAgentResponse, QuerySessionResponse, QueryVRFSeedResponse, QuerySessionByAgentResponse } from "./codec/agent/v1/query";
import { StdFee } from "@cosmjs/amino";
import { QueryGetModelResponse } from "./codec/dht/v1/query";
export type NesaClientOptions = SigningStargateClientOptions & {
    logger?: Logger;
    gasPrice: GasPrice;
    estimatedBlockTime: number;
    estimatedIndexerTime: number;
};
export interface MsgResult {
    readonly events: readonly Event[];
    /** Transaction hash (might be used as transaction ID). Guaranteed to be non-empty upper-case hex */
    readonly transactionHash: string;
    /** block height where this transaction was committed - only set if we send 'block' mode */
    readonly height: number;
}
export type RegisterSessionResult = MsgResult & {
    readonly account: string;
};
export declare class NesaClient {
    readonly gasPrice: GasPrice;
    readonly sign: SigningStargateClient;
    readonly query: QueryClient & ReturnType<typeof setupAgentExtension> & ReturnType<typeof setupDHTExtension>;
    readonly tm: CometClient;
    readonly senderAddress: string;
    readonly logger: Logger;
    readonly chainId: string;
    readonly estimatedBlockTime: number;
    readonly estimatedIndexerTime: number;
    private broadcastPromise;
    private signResult;
    static connectWithSigner(endpoint: string, signer: OfflineSigner, senderAddress: string, chainId: string | undefined, options: NesaClientOptions): Promise<NesaClient>;
    private constructor();
    updateParams(authority: string, params: Params): Promise<MsgResult>;
    registerInferenceAgent(url: string, version: Long): Promise<MsgResult>;
    broadcastRegisterSession(): any;
    signRegisterSession(sessionId: string, modelName: string, fee: StdFee, lockBalance: Coin, vrf: VRF, tokenPrice: TokenPrice): Promise<any>;
    registerSession(sessionId: string, modelName: string, lockBalance?: Coin, vrf?: VRF): Promise<RegisterSessionResult>;
    submitPayment(sessionId: string, signature: Uint8Array, payment?: Payment): Promise<MsgResult>;
    registerModel(creator: string, modelName: string, blockCids: string[], allowList: string[], tokenPrice?: TokenPrice): Promise<MsgResult>;
    updateModel(modelName: string, allowList: string[], tokenPrice: TokenPrice): Promise<MsgResult>;
    getParams(): Promise<QueryParamsResponse>;
    getInferenceAgent(account: string, modelName: string, limit: Long, key: Uint8Array): Promise<QueryInferenceAgentResponse>;
    getSession(sessionId: string): Promise<QuerySessionResponse>;
    getSessionByAgent(account: string, status: SessionStatus | undefined, expireTime: Date, limit: Long, orderDesc: boolean, key: Uint8Array): Promise<QuerySessionByAgentResponse>;
    getVRFSeed(account: string): Promise<QueryVRFSeedResponse>;
    getModel(modelName: string): Promise<QueryGetModelResponse>;
}
