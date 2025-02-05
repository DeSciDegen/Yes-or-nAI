// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/governance/GovernorUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorVotesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorVotesQuorumFractionUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorTimelockControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorCountingSimpleUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/governance/utils/IVotes.sol";
import "./ArbSys.sol";

contract AiDaoGovernor is
Initializable,
GovernorUpgradeable,
GovernorVotesUpgradeable,
GovernorVotesQuorumFractionUpgradeable,
GovernorTimelockControlUpgradeable,
GovernorCountingSimpleUpgradeable {

    address constant ARB_SYS_ADDRESS = 0x0000000000000000000000000000000000000064;
    ArbSys internal constant arbsys = ArbSys(ARB_SYS_ADDRESS);



    function initialize(IVotes _token, TimelockControllerUpgradeable _timelock) public initializer {
        __Governor_init("AiDaoGovernor");
        __GovernorVotes_init(_token);
        __GovernorVotesQuorumFraction_init(4);
        __GovernorTimelockControl_init(_timelock);
    }

    function isArbitrum() internal view returns (bool) {
        return block.chainid == 42161 || block.chainid == 421613;
        // Arbitrum One & Testnet
    }

    function votingDelay() public view override returns (uint256) {
        return isArbitrum() ? 150 : 1 days;
        //30 minutes for arbitrum
    }

    function votingPeriod() public view override returns (uint256) {
        return isArbitrum() ? 1000 : 1 weeks;
        //3 days for arbitrum
    }

    function proposalThreshold() public pure override returns (uint256) {
        return 100 * 10 ** 18;
        // Мінімум 100 токенів для створення пропозиції
    }

    function proposalSnapshot(uint256 proposalId) public view override returns (uint256) {
        return isArbitrum() ? proposalSnapshotL2(proposalId) : super.proposalSnapshot(proposalId);
    }

    function proposalSnapshotL2(uint256 proposalId) internal view returns (uint256) {
        return arbsys.arbBlockNumber() + votingDelay();
    }

    function proposalDeadline(uint256 proposalId) public view override returns (uint256) {
        return isArbitrum() ? arbsys.arbBlockNumber() + votingPeriod() : super.proposalDeadline(proposalId);
    }

    function state(uint256 proposalId)
    public view override(GovernorUpgradeable, GovernorTimelockControlUpgradeable)
    returns (ProposalState)
    {
        return super.state(proposalId);
    }

    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) public override(GovernorUpgradeable) returns (uint256) {
        return super.propose(targets, values, calldatas, description);
    }

    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(GovernorUpgradeable, GovernorTimelockControlUpgradeable) returns (uint256) {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function proposalNeedsQueuing(uint256 proposalId)
    public view override(GovernorUpgradeable, GovernorTimelockControlUpgradeable)
    returns (bool)
    {
        return super.proposalNeedsQueuing(proposalId);
    }

    function _executor()
    internal view override(GovernorTimelockControlUpgradeable, GovernorUpgradeable)
    returns (address)
    {
        return super._executor();
    }

    function supportsInterface(bytes4 interfaceId)
    public view override(GovernorUpgradeable)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function COUNTING_MODE() public pure override(GovernorCountingSimpleUpgradeable, IGovernor) returns (string memory) {
        return "support=bravo";
    }

    function _executeOperations(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(GovernorUpgradeable, GovernorTimelockControlUpgradeable) {
        super._executeOperations(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _queueOperations(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(GovernorUpgradeable, GovernorTimelockControlUpgradeable) returns (uint48) {
        return super._queueOperations(proposalId, targets, values, calldatas, descriptionHash);
    }

}
