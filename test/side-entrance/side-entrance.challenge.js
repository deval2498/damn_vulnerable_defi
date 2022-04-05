const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] Side entrance', function () {

    let deployer, attacker;

    const ETHER_IN_POOL = ethers.utils.parseEther('1000');

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, attacker] = await ethers.getSigners();

        const SideEntranceLenderPoolFactory = await ethers.getContractFactory('SideEntranceLenderPool', deployer);
        const FlashLoanReceiver = await ethers.getContractFactory('AttackerSide',deployer)
        this.pool = await SideEntranceLenderPoolFactory.deploy();
        this.attackerContract = await FlashLoanReceiver.deploy(this.pool.address);
        
        await this.pool.deposit({ value: ETHER_IN_POOL });
        const tx = deployer.sendTransaction({
            to: this.attackerContract.address,
            value: ethers.utils.parseEther("1.0")
        });

        this.attackerInitialEthBalance = await ethers.provider.getBalance(this.attackerContract.address);
        
        expect(
            await ethers.provider.getBalance(this.pool.address)
        ).to.equal(ETHER_IN_POOL);
    });

    it('Exploit', async function () {
        /** CODE YOUR EXPLOIT HERE */
        await this.attackerContract.connect(attacker).attack()
        
    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        expect(
            await ethers.provider.getBalance(this.pool.address)
        ).to.be.equal('0');
        
        // Not checking exactly how much is the final balance of the attacker,
        // because it'll depend on how much gas the attacker spends in the attack
        // If there were no gas costs, it would be balance before attack + ETHER_IN_POOL
        console.log(this.attackerInitialEthBalance.toString(),)
        expect(
            await ethers.provider.getBalance(this.attackerContract.address)
        ).to.be.gt(this.attackerInitialEthBalance);
    });
});
