// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AiDaoToken is ERC20, ERC20Permit, ERC20Votes, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000 * 10**18; // 1 млн токенів

    constructor() ERC20("AiDaoToken", "ADT") ERC20Permit("AiDaoToken") Ownable(msg.sender) {
        _mint(msg.sender, MAX_SUPPLY);
    }


    function _update(address from, address to, uint256 value)
    internal override(ERC20, ERC20Votes)
    {
        super._update(from, to, value);
    }

    function nonces(address owner)
    public view override(ERC20Permit, Nonces)
    returns (uint256)
    {
        return super.nonces(owner);
    }

    function mint(address account, uint256 value) public {
        super._mint(account, value);
    }
}
