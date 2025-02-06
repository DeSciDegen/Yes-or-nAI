// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";

contract AiDaoGovernor is Governor, GovernorVotes, GovernorVotesQuorumFraction, GovernorTimelockControl, GovernorCountingSimple  {
    constructor(
        IVotes _token,
        TimelockController _timelock
    ) Governor("AiDaoGovernor")
    GovernorVotes(_token)
    GovernorVotesQuorumFraction(4)
    GovernorTimelockControl(_timelock) {}

    function votingDelay() public pure override returns (uint256) {
        return 1 days;
    }

    function votingPeriod() public pure override returns (uint256) {
        return 1 weeks;
    }

    function proposalThreshold() public pure override returns (uint256) {
        return 100 * 10**18; // Мінімум 100 токенів для створення пропозиції
    }

    function state(uint256 proposalId)
    public view override(Governor, GovernorTimelockControl)
    returns (ProposalState)
    {
        return super.state(proposalId);
    }

    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) public override(Governor) returns (uint256) {
        return super.propose(targets, values, calldatas, description);
    }

    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) returns (uint256) {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function proposalNeedsQueuing(uint256 proposalId)
    public view override(Governor, GovernorTimelockControl)
    returns (bool)
    {
        return super.proposalNeedsQueuing(proposalId);
    }

    function _executor()
    internal view override(GovernorTimelockControl, Governor)
    returns (address)
    {
        return super._executor();
    }

    function supportsInterface(bytes4 interfaceId)
    public view override(Governor)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function COUNTING_MODE() public pure override(GovernorCountingSimple, IGovernor) returns (string memory) {
        return "support=bravo";
    }

    function _executeOperations(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) {
        super._executeOperations(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _queueOperations(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) returns (uint48) {
        return super._queueOperations(proposalId, targets, values, calldatas, descriptionHash);
    }

}
