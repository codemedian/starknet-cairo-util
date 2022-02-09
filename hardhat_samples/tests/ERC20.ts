import { expect } from "chai";
//@ts-ignore
import { starknet } from "hardhat";
//@ts-ignore
import { StarknetContract, StarknetContractFactory } from "hardhat/types/runtime";
import { Account } from "./utils/Account"

describe("Sample ERC20 test with Account", function () {
    this.timeout(300_000); // 5 min - recommended if used with Alpha testnet
    // this.timeout(30_000); // 30 seconds - recommended if used with starknet-devnet

    let accountContractFactory: StarknetContractFactory;
    let mintableTokenContractFactory: StarknetContractFactory;


    let testToken: StarknetContract
    let user1: Account
    let user2: Account

    before(async function () {
        accountContractFactory = await starknet.getContractFactory("Account");
        mintableTokenContractFactory = await starknet.getContractFactory("ERC20_Mintable");
        user1 = new Account(accountContractFactory);
        user2 = new Account(accountContractFactory);


        console.log("Deploying ...");
        await user1.deploy();
        await user2.deploy();

        testToken = await mintableTokenContractFactory.deploy({
            name: starknet.stringToBigInt("TestToken"),
            symbol: starknet.stringToBigInt("TT"),
            initial_supply: { low: 100000, high: 0 },
            recipient: BigInt(user1.getContract().address),
            owner: BigInt(user1.getContract().address)
        });

        console.log("Deployed:", {
            "users": [
                user1.getContract().address
            ],
            "token": testToken.address
        });
    });

    it("Check wallet has token balance", async function () {
        const { balance } = await testToken.call("balanceOf", { "account": BigInt(user1.getContract().address) });
        expect(balance.low).to.be.deep.equal(100000n);
    })

    it("Test approve alloance", async function () {
        await user1.approve(testToken.address, user2.getContract().address, 50)

        let { remaining } = await testToken.call("allowance", { owner: BigInt(user1.getContract().address), spender: BigInt(user2.getContract().address) })
        expect(remaining.low).to.be.deep.equal(50n);
    })
});
