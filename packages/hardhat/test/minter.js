const { expect } = require('chai')
const { ethers, waffle } = require('hardhat')
const fs = require('fs')
const prettier = require('prettier')

/**
 Contract Constants & Variables
 */
let THE_COLORS = '0x9fdb31F8CE3cB8400C7cCb2299492F2A498330a4'
const TREASURY = '0x48aE900E9Df45441B2001dB4dA92CE0E7C08c6d2'
const MAX_SUPPLY = 4300

const _name = 'Sync x Colors'
const _symbol = 'SyncXColors'
const maxMintAmount = 10
const price_in_ether = 0.05
const resyncPrice = 0.005
const price = ethers.utils.parseEther(price_in_ether.toString())
const revealed = false

const colorsOwner = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'
let colorsOwnerSigner

/**
 Helper Variables
 */
let syncXColors;
let colorsNFT;
let deployer;
let thirdParty;
// 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
let constantAddress;
const TEAM = '0x263853ef2C3Dd98a986799aB72E3b78334EB88cb';
//const TEAM = '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC';
let colorTokenIds;
let minter;

/**
 Helper Functions
 */
const deploy = async () => {
  [deployer, thirdParty, constantAddress] = await ethers.getSigners();
  let SyncXColors = await ethers.getContractFactory('SyncXColors');
  syncXColors = await SyncXColors.deploy();
  let ColorsNFT =  await ethers.getContractFactory('TheColors');
  colorsNFT = await ColorsNFT.deploy();
  let Minter =  await ethers.getContractFactory('Minter');
  minter = await Minter.deploy();
  let limit = minter.deployTransaction.gasLimit.toString();
  let depPrice = getPriceFrom(limit);
  console.info(`deployment = ${depPrice} ETH with ${gasPrice} gwei gas price` );
  minter.setContractAddress(syncXColors.address);
  // COLOR tests
  THE_COLORS = colorsNFT.address;
  syncXColors.setColorAddress(THE_COLORS);
  let tokenCount = randomIntFromInterval(3, 3);
  await colorsNFT.mintNextColors(tokenCount);
  let numOfTokens = (await colorsNFT.balanceOf(deployer.address)).toNumber();
  expect(tokenCount).to.equal(numOfTokens);
  colorTokenIds = []; 
  for (var i = 0; i < tokenCount; i++) {
    colorTokenIds.push((await colorsNFT.tokenByIndex(i)).toNumber());
  }
  console.log('>_')
}

const getColorsMinter = async () => {
  await hre.network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [colorsOwner],
  })
  await network.provider.send('hardhat_setBalance', [
    colorsOwner,
    ethers.utils.parseEther('10.0').toHexString().replace('0x0', '0x'),
  ])
  colorsOwnerSigner = await ethers.provider.getSigner(colorsOwner)
}

const mintThirdParty = async (_mintAmount) => {
  let quota = _mintAmount
  while (quota > 0) {
    let toMint = quota > 10 ? 10 : quota
    await syncXColors.connect(thirdParty).mint(toMint, [], {
      value: ethers.utils.parseEther((price_in_ether * toMint).toString()),
    })
    quota -= toMint
  }
}
const getNewColorsMinter = async (address) => {
  await hre.network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [address],
  })
  await network.provider.send('hardhat_setBalance', [
    address,
    ethers.utils.parseEther('10.0').toHexString().replace('0x0', '0x'),
  ])
  let signer = await ethers.provider.getSigner(address)
  return signer
}
function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}
function getSvgFromTokenUri(base64svg) {
  let buff = new Buffer(base64svg.split(',')[1], 'base64');
  let buffAscii = buff.toString('utf8');
  let buffImgData = buffAscii.split(',')[1];
  let buffImg64 = buffImgData.substring(0, buffImgData.length - 1);
  let buffImg = new Buffer(buffImg64, 'base64');
  let buffImgAscii = buffImg.toString('utf8');
  let prettySvg = prettier.format(buffImgAscii, {
    semi: false,
    parser: 'html',
  });
  return prettySvg;
}
function getMeta(base64svg) {
  let buff = new Buffer(base64svg.split(',')[1], 'base64');
  let buffAscii = buff.toString('utf8');
  let buffJSON = JSON.parse(buffAscii);
  return buffJSON;
}
const gasPrice = 80;
function getPriceFrom(limit) {
  return ethers.utils.formatEther(
    ethers.BigNumber.from(limit).mul(
      ethers.utils.parseUnits(gasPrice.toString(), "gwei")
    )
  );
}


/**
 TESTS
 */

describe('Minter', () => {
  before(deploy);
  it(`should test mint`, async () => {
    let receipt = await minter.mint(1, [], {value: price});
    let txPrice = getPriceFrom(receipt.gasLimit.toString());
    console.info(`test mint = ${txPrice} ETH with ${gasPrice} gwei gas price` );
    expect(await syncXColors.ownerOf(0)).to.equal(minter.address);
  })
  it(`should test mint rare`, async () => {
    let receipt = await minter.mintRare(1, [], {value: price});
    let txPrice = getPriceFrom(receipt.gasLimit.toString());
    console.info(`test mint rare = ${txPrice} ETH with ${gasPrice} gwei gas price` );
    expect(await syncXColors.ownerOf(0)).to.equal(minter.address);
  })
})

