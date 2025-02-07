const {expect} = require("chai");
const {ethers, network} = require("hardhat");


describe("AgentManager", () => {

    let owner;
    let agent;
    let user;
    let agentManager;

    beforeEach(async () => {
        [owner, agent, user] = await ethers.getSigners();
        const AgentManager = await ethers.getContractFactory("AgentManager", owner);
        agentManager = await AgentManager.deploy();
        await agentManager.deploymentTransaction().wait();
        console.log("AgentManager Contract successful deployed with address: ", await agentManager.getAddress());

        const AiDaoToken = await ethers.getContractFactory("AiDaoToken");
        aiDaoToken = await AiDaoToken.deploy();
        await aiDaoToken.deploymentTransaction().wait();

    })


    describe("AgentManager", () => {
        it("Should connect a User To an Agent if doesn't exist", async () => {

            const tx = await agentManager.connectUserToAgent(user.address, agent.address)
            let agentAddr = await agentManager.getAgent(user.address);

            expect(agentAddr).to.eq(agent.address);
            expect(tx).to
                .emit(agentManager, "AgentCreated")
                .withArgs(user.address, agent.address);
        })

        it("Shouldn't connect a User To an Agent if exists", async () => {
            agentManager.connectUserToAgent(user.address, agent.address);

            await expect(agentManager.connectUserToAgent(user.address, agent.address))
                .to.be.revertedWith("Agent already exists");
        })

        it("Check delegation", async () => {
            const tokensToMint = 20;
            await aiDaoToken.mint(user.address, tokensToMint);
            console.log(`voting power before : ${await aiDaoToken.getVotes(agent.address)}`)
            await aiDaoToken.connect(user).delegate(agent.address);
            let agentVotes = await aiDaoToken.getVotes(agent.address);
            console.log(`voting power before : ${agentVotes}`)

            expect(agentVotes).to.eq(tokensToMint);
        })
    })
})