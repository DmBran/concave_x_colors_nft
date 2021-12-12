const { expect } = require("chai");
const { ethers } = require("hardhat");


// SAMPLE TEST of default hardhat project with "Greeter" contract, change to relevant use when needed. 
describe("SyncColorTest", function () {
  it("Should check mint function", async function () {
    const color_contract = await ethers.getContractFactory("TheColors");
    const color = await color_contract.deploy();
    const color_nft_tx = await color.mintNextColors(1);
    let receipt = await color_nft_tx.wait(1);
    let colorId = receipt.events[1].topics[0];
    console.info(colorId);
    const sync_contract = await ethers.getContractFactory("Sync");
    const sync = await sync_contract.deploy();
    console.log('delpoyed?');
    const depl = await sync.deployed();
    console.log('delpoyed');
    const mintTx = await sync.mintSync([colorId]);
    await mintTx.wait();
    //console.log(mintTx);
  }); /*
  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
 */
});
