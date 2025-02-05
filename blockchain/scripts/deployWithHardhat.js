//IMPORTANT ---------------->
//run deploy -> npx hardhat run scripts/deployWithHardhat.js --network arbitrum
//run deploy on Goerli -> npx hardhat run scripts/deployWithHardhat.js --network arbitrumTestnet
//run deploy on Hardhat L1 -> npx hardhat run scripts/deployWithHardhat.js --network hardhat

const { ethers, upgrades } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log(`🚀 Deploying contracts with the account: ${deployer.address}`);

    // Deploy Token
    const AiDaoToken = await ethers.getContractFactory("AiDaoToken");
    const token = await AiDaoToken.deploy();
    await token.waitForDeployment();
    console.log(`✅ AiDaoToken deployed to: ${await token.getAddress()}`);

    // Deploy Timelock (via Proxy)
    const Timelock = await ethers.getContractFactory("TimelockControllerUpgradeable");
    const timelock = await upgrades.deployProxy(
        Timelock,
        [2 * 24 * 60 * 60, [deployer.address], [deployer.address], deployer.address],
        { initializer: "initialize" }
    );
    await timelock.waitForDeployment();
    console.log(`✅ Timelock deployed to: ${await timelock.getAddress()}`);

    // Deploy Governor (via Proxy)
    const AiDaoGovernor = await ethers.getContractFactory("AiDaoGovernor");
    const governor = await upgrades.deployProxy(
        AiDaoGovernor,
        [await token.getAddress(), await timelock.getAddress()],
        { initializer: "initialize" }
    );
    await governor.waitForDeployment();
    console.log(`✅ Governor Proxy deployed to: ${await governor.getAddress()}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});


