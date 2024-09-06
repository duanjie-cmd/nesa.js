"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NesaClient = void 0;
const proto_signing_1 = require("@cosmjs/proto-signing");
const stargate_1 = require("@cosmjs/stargate");
const tendermint_rpc_1 = require("@cosmjs/tendermint-rpc");
const logger_1 = require("./logger");
const utils_1 = require("./utils");
const tx_1 = require("./codec/agent/v1/tx");
const queries_1 = require("./queries");
const tx_2 = require("cosmjs-types/cosmos/tx/v1beta1/tx");
const crypto_1 = require("@cosmjs/crypto");
const encoding_1 = require("@cosmjs/encoding");
const tx_3 = require("./codec/cosmos/bank/v1beta1/tx");
function nesaRegistry() {
    return new proto_signing_1.Registry([
        ...stargate_1.defaultRegistryTypes,
        ['/agent.v1.MsgUpdateParams', tx_1.MsgUpdateParams],
        // ['/agent.v1.MsgRegisterModel', MsgRegisterModel],
        ['/agent.v1.MsgRegisterInferenceAgent', tx_1.MsgRegisterInferenceAgent],
        ['/agent.v1.MsgRegisterSession', tx_1.MsgRegisterSession],
        ['/agent.v1.MsgSubmitPayment', tx_1.MsgSubmitPayment],
        ['/agent.v1.VRF', tx_1.VRF],
        ['/cosmos.bank.v1beta1.MsgSend', tx_3.MsgSend],
    ]);
}
class NesaClient {
    static async connectWithSigner(endpoint, signer, senderAddress, chainId, options) {
        const mergedOptions = {
            ...options,
            registry: nesaRegistry(),
        };
        const tmClient = await (0, tendermint_rpc_1.connectComet)(endpoint);
        const signingClient = await stargate_1.SigningStargateClient.createWithSigner(tmClient, signer, mergedOptions);
        if (!chainId) {
            chainId = await signingClient.getChainId();
        }
        return new NesaClient(signingClient, tmClient, senderAddress, chainId, options);
    }
    constructor(signingClient, tmClient, senderAddress, chainId, options) {
        this.sign = signingClient;
        this.tm = tmClient;
        this.query = stargate_1.QueryClient.withExtensions(tmClient, queries_1.setupAgentExtension, queries_1.setupSendExtension);
        this.senderAddress = senderAddress;
        this.chainId = chainId;
        // this.revisionNumber = parseRevisionNumber(chainId);
        this.gasPrice = options.gasPrice;
        this.logger = options.logger ?? new logger_1.NoopLogger();
        this.estimatedBlockTime = options.estimatedBlockTime;
        this.estimatedIndexerTime = options.estimatedIndexerTime;
    }
    async updateParams(authority, params) {
        this.logger.verbose('Update Params');
        const senderAddress = this.senderAddress;
        const updateParamsMsg = {
            typeUrl: '/agent.v1.MsgUpdateParams',
            value: tx_1.MsgUpdateParams.fromPartial({
                authority,
                params
            }),
        };
        this.logger.debug('Update Params Message: ', updateParamsMsg);
        const result = await this.sign.signAndBroadcast(senderAddress, [updateParamsMsg], 'auto');
        if ((0, stargate_1.isDeliverTxFailure)(result)) {
            throw new Error((0, utils_1.createDeliverTxFailureMessage)(result));
        }
        return {
            events: result.events,
            transactionHash: result.transactionHash,
            height: result.height,
        };
    }
    async registerInferenceAgent(
    // account: string,
    url, version) {
        this.logger.verbose(`Register Inference Agent`);
        const senderAddress = this.senderAddress;
        const registerInferenceAgentMsg = {
            typeUrl: '/agent.v1.MsgRegisterInferenceAgent',
            value: tx_1.MsgRegisterInferenceAgent.fromPartial({
                account: senderAddress,
                url,
                version
            }),
        };
        this.logger.debug('Register Model Message: ', registerInferenceAgentMsg);
        const result = await this.sign.signAndBroadcast(senderAddress, [registerInferenceAgentMsg], "auto");
        if ((0, stargate_1.isDeliverTxFailure)(result)) {
            throw new Error((0, utils_1.createDeliverTxFailureMessage)(result));
        }
        return {
            events: result.events,
            transactionHash: result.transactionHash,
            height: result.height
        };
    }
    broadcastRegisterSession() {
        if (!this.signResult) {
            return new Error('Please sign first');
        }
        if (this.broadcastPromise) {
            return this.broadcastPromise;
        }
        this.broadcastPromise = new Promise((resolve, reject) => {
            this.sign.broadcastTx(Uint8Array.from(tx_2.TxRaw.encode(this.signResult).finish()))
                .then((result) => {
                if ((0, stargate_1.isDeliverTxFailure)(result)) {
                    reject(new Error((0, utils_1.createDeliverTxFailureMessage)(result)));
                }
                else {
                    resolve({
                        events: result.events,
                        transactionHash: result.transactionHash,
                        height: result.height,
                        account: tx_1.MsgRegisterSessionResponse.decode(result.msgResponses[0]?.value).account
                    });
                }
            }).catch((error) => {
                reject(error);
            });
        });
    }
    async signRegisterSession(sessionId, modelName, fee, lockBalance, vrf) {
        this.logger.verbose(`Register Session`);
        const senderAddress = this.senderAddress;
        const registerSessionMsg = {
            typeUrl: '/agent.v1.MsgRegisterSession',
            value: tx_1.MsgRegisterSession.fromPartial({
                account: senderAddress,
                sessionId,
                modelName,
                lockBalance,
                vrf
            }),
        };
        const signResult = await this.sign.sign(senderAddress, [registerSessionMsg], fee, "");
        this.signResult = signResult;
        const hex = Buffer.from(Uint8Array.from(tx_2.TxRaw.encode(this.signResult).finish())).toString('hex');
        this.broadcastPromise = undefined;
        this.broadcastRegisterSession();
        return {
            sessionId,
            transactionHash: (0, encoding_1.toHex)((0, crypto_1.sha256)(Buffer.from(hex, 'hex'))).toUpperCase()
        };
    }
    async registerSession(
    // account: string,
    sessionId, modelName, lockBalance, vrf) {
        this.logger.verbose(`Register Session`);
        const senderAddress = this.senderAddress;
        const registerSessionMsg = {
            typeUrl: '/agent.v1.MsgRegisterSession',
            value: tx_1.MsgRegisterSession.fromPartial({
                account: senderAddress,
                sessionId,
                modelName,
                lockBalance,
                vrf
            }),
        };
        this.logger.debug('Register Session Message: ', registerSessionMsg);
        const result = await this.sign.signAndBroadcast(senderAddress, [registerSessionMsg], "auto");
        if ((0, stargate_1.isDeliverTxFailure)(result)) {
            throw new Error((0, utils_1.createDeliverTxFailureMessage)(result));
        }
        return {
            events: result.events,
            transactionHash: result.transactionHash,
            height: result.height,
            account: tx_1.MsgRegisterSessionResponse.decode(result.msgResponses[0]?.value).account
        };
    }
    async send(toAddress, amount) {
        this.logger.verbose(`send`);
        const senderAddress = this.senderAddress;
        const sendMsg = {
            typeUrl: '/cosmos.bank.v1beta1.MsgSend',
            value: tx_3.MsgSend.fromPartial({
                fromAddress: senderAddress,
                toAddress,
                amount
            }),
        };
        this.logger.debug('send Message: ', sendMsg);
        const result = await this.sign.signAndBroadcast(senderAddress, [sendMsg], "auto");
        if ((0, stargate_1.isDeliverTxFailure)(result)) {
            throw new Error((0, utils_1.createDeliverTxFailureMessage)(result));
        }
        return {
            events: result.events,
            transactionHash: result.transactionHash,
            height: result.height,
        };
    }
    async submitPayment(
    // account: string,
    sessionId, signature, payment) {
        this.logger.verbose(`Submit Payment`);
        const senderAddress = this.senderAddress;
        const submitPaymentMsg = {
            typeUrl: '/agent.v1.MsgSubmitPayment',
            value: tx_1.MsgSubmitPayment.fromPartial({
                account: senderAddress,
                sessionId,
                signature,
                payment
            }),
        };
        this.logger.debug('Submit Payment Message: ', submitPaymentMsg);
        const result = await this.sign.signAndBroadcast(senderAddress, [submitPaymentMsg], "auto");
        if ((0, stargate_1.isDeliverTxFailure)(result)) {
            throw new Error((0, utils_1.createDeliverTxFailureMessage)(result));
        }
        return {
            events: result.events,
            transactionHash: result.transactionHash,
            height: result.height,
        };
    }
    async getParams() {
        const result = await this.query.agent.params();
        return result;
    }
    async getInferenceAgent(account, modelName, limit, key) {
        const result = await this.query.agent.inferenceAgentRequest(account, modelName, limit, key);
        return result;
    }
    async getSession(sessionId) {
        const result = await this.query.agent.sessionRequest(sessionId);
        return result;
    }
    async getSessionByAgent(account, status, expireTime, limit, orderDesc, key) {
        const result = await this.query.agent.sessionByAgentRequest(account, status, expireTime, limit, orderDesc, key);
        return result;
    }
    async getVRFSeed(account) {
        const result = await this.query.agent.VRFSeedRequest(account);
        return result;
    }
    async getAllBalances(account) {
        const result = await this.query.send.allBalances(account);
        return result;
    }
}
exports.NesaClient = NesaClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx5REFBZ0U7QUFDaEUsK0NBUTBCO0FBQzFCLDJEQUFtRTtBQUNuRSxxQ0FBOEM7QUFDOUMsbUNBQXdEO0FBQ3hELDRDQVU2QjtBQUc3Qix1Q0FBb0Y7QUFZcEYsMERBQTBEO0FBQzFELDJDQUF1QztBQUN2QywrQ0FBeUM7QUFDekMsdURBQXlEO0FBVXpELFNBQVMsWUFBWTtJQUNuQixPQUFPLElBQUksd0JBQVEsQ0FBQztRQUNsQixHQUFHLCtCQUFvQjtRQUN2QixDQUFDLDJCQUEyQixFQUFFLG9CQUFlLENBQUM7UUFDOUMsb0RBQW9EO1FBQ3BELENBQUMscUNBQXFDLEVBQUUsOEJBQXlCLENBQUM7UUFDbEUsQ0FBQyw4QkFBOEIsRUFBRSx1QkFBa0IsQ0FBQztRQUNwRCxDQUFDLDRCQUE0QixFQUFFLHFCQUFnQixDQUFDO1FBQ2hELENBQUMsZUFBZSxFQUFFLFFBQUcsQ0FBQztRQUN0QixDQUFDLDhCQUE4QixFQUFFLFlBQU8sQ0FBQztLQUMxQyxDQUFDLENBQUE7QUFDSixDQUFDO0FBZUQsTUFBYSxVQUFVO0lBZ0JkLE1BQU0sQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQ25DLFFBQWdCLEVBQ2hCLE1BQXFCLEVBQ3JCLGFBQXFCLEVBQ3JCLE9BQTJCLEVBQzNCLE9BQTBCO1FBRTFCLE1BQU0sYUFBYSxHQUFHO1lBQ3BCLEdBQUcsT0FBTztZQUNWLFFBQVEsRUFBRSxZQUFZLEVBQUU7U0FDekIsQ0FBQztRQUNGLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBQSw2QkFBWSxFQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzlDLE1BQU0sYUFBYSxHQUFHLE1BQU0sZ0NBQXFCLENBQUMsZ0JBQWdCLENBQ2hFLFFBQVEsRUFDUixNQUFNLEVBQ04sYUFBYSxDQUNkLENBQUM7UUFDRixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDYixPQUFPLEdBQUcsTUFBTSxhQUFhLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDN0MsQ0FBQztRQUNELE9BQU8sSUFBSSxVQUFVLENBQ25CLGFBQWEsRUFDYixRQUFRLEVBQ1IsYUFBYSxFQUNiLE9BQU8sRUFDUCxPQUFPLENBQ1IsQ0FBQztJQUNKLENBQUM7SUFFRCxZQUNFLGFBQW9DLEVBQ3BDLFFBQXFCLEVBQ3JCLGFBQXFCLEVBQ3JCLE9BQWUsRUFDZixPQUEwQjtRQUUxQixJQUFJLENBQUMsSUFBSSxHQUFHLGFBQWEsQ0FBQztRQUMxQixJQUFJLENBQUMsRUFBRSxHQUFHLFFBQVEsQ0FBQztRQUNuQixJQUFJLENBQUMsS0FBSyxHQUFHLHNCQUFXLENBQUMsY0FBYyxDQUNyQyxRQUFRLEVBQ1IsNkJBQW1CLEVBQ25CLDRCQUFrQixDQUNuQixDQUFDO1FBQ0YsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7UUFDbkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsc0RBQXNEO1FBRXRELElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQztRQUNqQyxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksSUFBSSxtQkFBVSxFQUFFLENBQUM7UUFDakQsSUFBSSxDQUFDLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQztRQUNyRCxJQUFJLENBQUMsb0JBQW9CLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDO0lBQzNELENBQUM7SUFFTSxLQUFLLENBQUMsWUFBWSxDQUN2QixTQUFpQixFQUNqQixNQUFjO1FBRWQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDckMsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztRQUN6QyxNQUFNLGVBQWUsR0FBRztZQUN0QixPQUFPLEVBQUUsMkJBQTJCO1lBQ3BDLEtBQUssRUFBRSxvQkFBZSxDQUFDLFdBQVcsQ0FBQztnQkFDakMsU0FBUztnQkFDVCxNQUFNO2FBQ1AsQ0FBQztTQUNILENBQUM7UUFDRixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyx5QkFBeUIsRUFBRSxlQUFlLENBQUMsQ0FBQztRQUM5RCxNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQzdDLGFBQWEsRUFDYixDQUFDLGVBQWUsQ0FBQyxFQUNqQixNQUFNLENBQ1AsQ0FBQztRQUNGLElBQUksSUFBQSw2QkFBa0IsRUFBQyxNQUFNLENBQUMsRUFBRSxDQUFDO1lBQy9CLE1BQU0sSUFBSSxLQUFLLENBQUMsSUFBQSxxQ0FBNkIsRUFBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3pELENBQUM7UUFDRCxPQUFPO1lBQ0wsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNO1lBQ3JCLGVBQWUsRUFBRSxNQUFNLENBQUMsZUFBZTtZQUN2QyxNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU07U0FDdEIsQ0FBQztJQUNKLENBQUM7SUFFTSxLQUFLLENBQUMsc0JBQXNCO0lBQ2pDLG1CQUFtQjtJQUNuQixHQUFXLEVBQ1gsT0FBYTtRQUViLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLDBCQUEwQixDQUFDLENBQUM7UUFDaEQsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztRQUN6QyxNQUFNLHlCQUF5QixHQUFHO1lBQ2hDLE9BQU8sRUFBRSxxQ0FBcUM7WUFDOUMsS0FBSyxFQUFFLDhCQUF5QixDQUFDLFdBQVcsQ0FBQztnQkFDM0MsT0FBTyxFQUFFLGFBQWE7Z0JBQ3RCLEdBQUc7Z0JBQ0gsT0FBTzthQUNSLENBQUM7U0FDSCxDQUFDO1FBQ0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsMEJBQTBCLEVBQUUseUJBQXlCLENBQUMsQ0FBQztRQUN6RSxNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQzdDLGFBQWEsRUFDYixDQUFDLHlCQUF5QixDQUFDLEVBQzNCLE1BQU0sQ0FDUCxDQUFDO1FBQ0YsSUFBSSxJQUFBLDZCQUFrQixFQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFDL0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxJQUFBLHFDQUE2QixFQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDekQsQ0FBQztRQUVELE9BQU87WUFDTCxNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU07WUFDckIsZUFBZSxFQUFFLE1BQU0sQ0FBQyxlQUFlO1lBQ3ZDLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTTtTQUN0QixDQUFDO0lBQ0osQ0FBQztJQUVNLHdCQUF3QjtRQUM3QixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ3JCLE9BQU8sSUFBSSxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQTtRQUN2QyxDQUFDO1FBQ0QsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUMxQixPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQTtRQUM5QixDQUFDO1FBQ0QsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ3RELElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztpQkFDM0UsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7Z0JBQ2YsSUFBSSxJQUFBLDZCQUFrQixFQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7b0JBQy9CLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxJQUFBLHFDQUE2QixFQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDMUQsQ0FBQztxQkFBTSxDQUFDO29CQUNOLE9BQU8sQ0FBQzt3QkFDTixNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU07d0JBQ3JCLGVBQWUsRUFBRSxNQUFNLENBQUMsZUFBZTt3QkFDdkMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNO3dCQUNyQixPQUFPLEVBQUUsK0JBQTBCLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsT0FBTztxQkFDbEYsQ0FBQyxDQUFBO2dCQUNKLENBQUM7WUFDSCxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtnQkFDakIsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQ2YsQ0FBQyxDQUFDLENBQUE7UUFDTixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFFTSxLQUFLLENBQUMsbUJBQW1CLENBQzlCLFNBQWlCLEVBQ2pCLFNBQWlCLEVBQ2pCLEdBQVcsRUFDWCxXQUFrQixFQUNsQixHQUFTO1FBRVQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUN4QyxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO1FBQ3pDLE1BQU0sa0JBQWtCLEdBQUc7WUFDekIsT0FBTyxFQUFFLDhCQUE4QjtZQUN2QyxLQUFLLEVBQUUsdUJBQWtCLENBQUMsV0FBVyxDQUFDO2dCQUNwQyxPQUFPLEVBQUUsYUFBYTtnQkFDdEIsU0FBUztnQkFDVCxTQUFTO2dCQUNULFdBQVc7Z0JBQ1gsR0FBRzthQUNKLENBQUM7U0FDSCxDQUFDO1FBQ0YsTUFBTSxVQUFVLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FDckMsYUFBYSxFQUNiLENBQUMsa0JBQWtCLENBQUMsRUFDcEIsR0FBRyxFQUNILEVBQUUsQ0FDSCxDQUFBO1FBQ0QsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUE7UUFDNUIsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDaEcsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFNBQVMsQ0FBQTtRQUNqQyxJQUFJLENBQUMsd0JBQXdCLEVBQUUsQ0FBQTtRQUMvQixPQUFPO1lBQ0wsU0FBUztZQUNULGVBQWUsRUFBRSxJQUFBLGdCQUFLLEVBQUMsSUFBQSxlQUFNLEVBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRTtTQUN0RSxDQUFBO0lBQ0gsQ0FBQztJQUVNLEtBQUssQ0FBQyxlQUFlO0lBQzFCLG1CQUFtQjtJQUNuQixTQUFpQixFQUNqQixTQUFpQixFQUNqQixXQUFrQixFQUNsQixHQUFTO1FBRVQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUN4QyxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO1FBQ3pDLE1BQU0sa0JBQWtCLEdBQUc7WUFDekIsT0FBTyxFQUFFLDhCQUE4QjtZQUN2QyxLQUFLLEVBQUUsdUJBQWtCLENBQUMsV0FBVyxDQUFDO2dCQUNwQyxPQUFPLEVBQUUsYUFBYTtnQkFDdEIsU0FBUztnQkFDVCxTQUFTO2dCQUNULFdBQVc7Z0JBQ1gsR0FBRzthQUNKLENBQUM7U0FDSCxDQUFDO1FBQ0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsNEJBQTRCLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztRQUNwRSxNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQzdDLGFBQWEsRUFDYixDQUFDLGtCQUFrQixDQUFDLEVBQ3BCLE1BQU0sQ0FDUCxDQUFDO1FBQ0YsSUFBSSxJQUFBLDZCQUFrQixFQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFDL0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxJQUFBLHFDQUE2QixFQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDekQsQ0FBQztRQUVELE9BQU87WUFDTCxNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU07WUFDckIsZUFBZSxFQUFFLE1BQU0sQ0FBQyxlQUFlO1lBQ3ZDLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTTtZQUNyQixPQUFPLEVBQUUsK0JBQTBCLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsT0FBTztTQUNsRixDQUFDO0lBQ0osQ0FBQztJQUVNLEtBQUssQ0FBQyxJQUFJLENBQ2YsU0FBaUIsRUFDakIsTUFBYztRQUVkLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzVCLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDekMsTUFBTSxPQUFPLEdBQUc7WUFDZCxPQUFPLEVBQUUsOEJBQThCO1lBQ3ZDLEtBQUssRUFBRSxZQUFPLENBQUMsV0FBVyxDQUFDO2dCQUN6QixXQUFXLEVBQUUsYUFBYTtnQkFDMUIsU0FBUztnQkFDVCxNQUFNO2FBQ1AsQ0FBQztTQUNILENBQUM7UUFDRixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM3QyxNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQzdDLGFBQWEsRUFDYixDQUFDLE9BQU8sQ0FBQyxFQUNULE1BQU0sQ0FDUCxDQUFDO1FBQ0YsSUFBSSxJQUFBLDZCQUFrQixFQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFDL0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxJQUFBLHFDQUE2QixFQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDekQsQ0FBQztRQUVELE9BQU87WUFDTCxNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU07WUFDckIsZUFBZSxFQUFFLE1BQU0sQ0FBQyxlQUFlO1lBQ3ZDLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTTtTQUN0QixDQUFDO0lBQ0osQ0FBQztJQUVNLEtBQUssQ0FBQyxhQUFhO0lBQ3hCLG1CQUFtQjtJQUNuQixTQUFpQixFQUNqQixTQUFxQixFQUNyQixPQUFpQjtRQUVqQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3RDLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDekMsTUFBTSxnQkFBZ0IsR0FBRztZQUN2QixPQUFPLEVBQUUsNEJBQTRCO1lBQ3JDLEtBQUssRUFBRSxxQkFBZ0IsQ0FBQyxXQUFXLENBQUM7Z0JBQ2xDLE9BQU8sRUFBRSxhQUFhO2dCQUN0QixTQUFTO2dCQUNULFNBQVM7Z0JBQ1QsT0FBTzthQUNSLENBQUM7U0FDSCxDQUFDO1FBQ0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsMEJBQTBCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUNoRSxNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQzdDLGFBQWEsRUFDYixDQUFDLGdCQUFnQixDQUFDLEVBQ2xCLE1BQU0sQ0FDUCxDQUFDO1FBQ0YsSUFBSSxJQUFBLDZCQUFrQixFQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFDL0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxJQUFBLHFDQUE2QixFQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDekQsQ0FBQztRQUVELE9BQU87WUFDTCxNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU07WUFDckIsZUFBZSxFQUFFLE1BQU0sQ0FBQyxlQUFlO1lBQ3ZDLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTTtTQUN0QixDQUFDO0lBQ0osQ0FBQztJQUVNLEtBQUssQ0FBQyxTQUFTO1FBQ3BCLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDL0MsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVNLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxPQUFlLEVBQUUsU0FBaUIsRUFBRSxLQUFXLEVBQUUsR0FBZTtRQUM3RixNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzVGLE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFTSxLQUFLLENBQUMsVUFBVSxDQUFDLFNBQWlCO1FBQ3ZDLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2hFLE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFTSxLQUFLLENBQUMsaUJBQWlCLENBQUMsT0FBZSxFQUFFLE1BQWlDLEVBQUUsVUFBZ0IsRUFBRSxLQUFXLEVBQUUsU0FBa0IsRUFBRSxHQUFlO1FBQ25KLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBQyxVQUFVLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxHQUFHLENBQUcsQ0FBQztRQUNqSCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBRU0sS0FBSyxDQUFDLFVBQVUsQ0FBQyxPQUFlO1FBQ3JDLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzlELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFTSxLQUFLLENBQUMsY0FBYyxDQUFDLE9BQWU7UUFDekMsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDMUQsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztDQUNGO0FBbFVELGdDQWtVQyJ9