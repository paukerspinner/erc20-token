// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is
    ERC20("Token", "TKN"),
    ERC20Burnable,
    Ownable(msg.sender)
{
    uint256 maxSupply = 1000 * 10 ** 18;
    constructor() {
        _mint(msg.sender, 100 * 10 ** 18);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        require(
            ERC20.totalSupply() + amount <= maxSupply,
            "Max supply exceeded"
        );
        _mint(to, amount);
    }
}
