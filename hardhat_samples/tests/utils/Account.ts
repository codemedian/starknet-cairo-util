
import { StarknetContract, StarknetContractFactory } from "hardhat/types/runtime";
import { ec, sign } from "@toruslabs/starkware-crypto"
import { hash } from "starknet"
import BN from 'bn.js';
import { BigNumberish } from "starknet/dist/utils/number";

export class Account {
    private readonly keyPair;
    private readonly publicKey;
    private readonly contractFactory: StarknetContractFactory;
    private account: StarknetContract | undefined;

    constructor(contractFactory: StarknetContractFactory) {
        const privateKey = BigInt("1628448741648245036800002906075225705100596136133912895015035902954123957052");
        this.keyPair = ec.keyFromPrivate(privateKey, 'hex');
        this.publicKey = ec.keyFromPublic(this.keyPair.getPublic(true, 'hex'), 'hex').pub.getX().toString(16);
        this.contractFactory = contractFactory;
    }

    public async deploy(): Promise<StarknetContract> {
        this.account = await this.contractFactory.deploy({ _public_key: this.getPublicKeyFelt() })
        return this.account
    }

    public async send(to: string, selector: string, calldata: BigNumberish[]): Promise<void> {
        const { res: nonce } = await this.account!.call("get_nonce");
        const selectorBn = hash.starknetKeccak(selector)
        const msgHash = hash.computeHashOnElements([
            this.account!.address,
            to,
            selectorBn,
            hash.computeHashOnElements(calldata),
            nonce
        ]);

        const signedMessage = sign(this.keyPair, BigInt(msgHash).toString(16));
        const signature = [
            BigInt("0x" + signedMessage.r.toString(16)),
            BigInt("0x" + signedMessage.s.toString(16))
        ];

        return this.account?.invoke("execute", {
            to: BigInt(to),
            selector: BigInt(selectorBn.toString()),
            calldata: calldata.map(it => BigInt(it.toString())),
            nonce: nonce
        }, signature)
    }

    public getPublicKeyFelt(): BigInt {
        return BigInt("0x" + this.publicKey)
    }

    public getContract(): StarknetContract {
        return this.account!;
    }

    public async approve(token: string, receiver: string, amount: number) {
        return this.send(token, "approve", [receiver, new BN(amount), new BN(0)])
    }

    public async depositIntoRide(conductor: StarknetContract, amount: number) {
        return this.send(conductor.address, "deposit", [new BN(amount), new BN(0)])
    }

}
