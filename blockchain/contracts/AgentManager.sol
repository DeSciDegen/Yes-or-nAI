// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;


contract AgentManager {
    mapping(address => address) private userAgent;

    event AgentCreated(address indexed user, address agent);

    function connectUserToAgent(address userAddress, address agentAddressReceived) public {
        address agentAddress = userAgent[userAddress];
        require(agentAddress == address(0), "Agent already exists");
        userAgent[userAddress] = agentAddressReceived;
        emit AgentCreated(userAddress, agentAddressReceived);

    }

    function getAgent(address userAddress) public view returns (address) {
        address agentAddress = userAgent[userAddress];
        require(agentAddress != address(0), "User doesn't have a related agent!");
        return agentAddress;
    }
}
