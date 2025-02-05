require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require("dotenv").config();

module.exports = {
    solidity: "0.8.20",
    networks: {
        arbitrum: {
            url: process.env.ARBITRUM_RPC_URL,
            accounts: [process.env.PRIVATE_KEY],
            chainId: 42161, // Arbitrum One
        },
        arbitrumTestnet: {
            url: process.env.ARBITRUM_TESTNET_RPC_URL,
            accounts: [process.env.PRIVATE_KEY],
            chainId: 421613, // Arbitrum Goerli
        },
        hardhat: {
            chainId: 31337,
            allowUnlimitedContractSize: true,
        },
    },
    etherscan: {
        apiKey: process.env.ARBISCAN_API_KEY, // ADD FOR VERIFICATION
    },
    settings: {
        optimizer: {
            enabled: true,
            runs: 200,
        },
        viaIR: true, // Enable "Intermediate Representation" for better optimization
    },
};
