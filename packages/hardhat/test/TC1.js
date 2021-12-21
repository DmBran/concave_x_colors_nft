const { expect } = require('chai')
const { ethers, waffle } = require('hardhat')
const fs = require('fs')
const prettier = require('prettier')

/**
 Contract Constants & Variables
 */
const THE_COLORS = '0x3C4CfA9540c7aeacBbB81532Eb99D5E870105CA9'
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
let deployer;
let thirdParty;
// 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
let constantAddress;
const TEAM = '0x263853ef2C3Dd98a986799aB72E3b78334EB88cb';
//const TEAM = '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC';

/**
 Helper Functions
 */
const deploy = async () => {
  [deployer, thirdParty, constantAddress] = await ethers.getSigners();
  SyncXColors = await ethers.getContractFactory('SyncXColors')
  syncXColors = await SyncXColors.deploy()
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

/**
 TESTS
 */

describe('syncXColors: Reads public constants', () => {
  before(deploy)
  it(`THE_COLORS is "${THE_COLORS}"`, async () => {
    expect(await syncXColors.THE_COLORS()).to.equal(THE_COLORS)
  })
  it(`MAX_SUPPLY is "${MAX_SUPPLY}"`, async () => {
    expect(await syncXColors.MAX_SUPPLY()).to.equal(MAX_SUPPLY)
  })
})

describe('syncXColors: Reads public variables', () => {
  before(deploy)
  it(`name is "${_name}"`, async () => {
    console.info(await syncXColors.name())
    expect(await syncXColors.name()).to.equal(_name)
  })
  it(`symbol is "${_symbol}"`, async () => {
    expect(await syncXColors.symbol()).to.equal(_symbol)
  })
  it(`maxMintAmount is "${maxMintAmount}"`, async () => {
    expect(await syncXColors.maxMintAmount()).to.equal(maxMintAmount)
  })
  it(`price is "${ethers.utils.formatEther(price)}"`, async () => {
    expect(await syncXColors.mintPrice()).to.equal(price)
  })
})

describe('syncXColors: Owner functions', () => {
  beforeEach(deploy)
  describe('tokenURI()', () => {
    it(`Calling tokenURI() on nonexistent tokenId should revert with "ERC721Metadata: URI query for nonexistent token"`, async () => {
      await expect(syncXColors.tokenURI(0)).to.be.revertedWith(
        'ERC721: operator query for nonexistent token'
      )
    })
  })

    describe("withdraw()", () => {
        it(`after 100 mints contract balance should equal ${ethers.utils.formatEther(ethers.utils.parseEther((price_in_ether*100).toString()))}`, async () => {
            expect(await syncXColors.totalSupply()).to.equal(0);
            await mintThirdParty(100);
            expect(await syncXColors.totalSupply()).to.equal(100);
            expect(
                await waffle.provider.getBalance(syncXColors.address)
            ).to.equal(ethers.utils.parseEther((price_in_ether*100).toString()))
        });

        it(`after 100 mints test withdrawal 50/50`, async () => {
            await mintThirdParty(100);
            expect(await syncXColors.totalSupply()).to.equal(100);
            expect(
                await waffle.provider.getBalance(TREASURY)
            ).to.equal(ethers.utils.parseEther('0'));
            expect(
                await waffle.provider.getBalance(TEAM)
            ).to.equal(ethers.utils.parseEther('0'));
            await syncXColors.withdrawOwner();
            let balance = ethers.utils.formatEther(ethers.utils.parseEther((price_in_ether*100).toString()));
            let treasuryBalance = ethers.utils.formatEther((await waffle.provider.getBalance(TREASURY)).toString());
            let teamBalance = ethers.utils.formatEther((await waffle.provider.getBalance(TEAM)).toString());
            expect(+treasuryBalance).to.equal(+balance / 2);
            expect(+teamBalance).to.equal(+balance / 2);
            expect(
                await waffle.provider.getBalance(syncXColors.address)
            ).to.equal(ethers.utils.parseEther('0'));
        });

        it(`restrict withdrawal from third party`, async () => {
            await mintThirdParty(100);
            expect(await syncXColors.totalSupply()).to.equal(100);
            await expect(syncXColors.connect(thirdParty).withdrawOwner()).to.be.revertedWith(
              "Ownable: caller is not the owner"
            );
        });

        /*
         * replace TEAM in contract for the test to work
        it(`team withdrawal`, async () => {
            await mintThirdParty(100);
            expect(await syncXColors.totalSupply()).to.equal(100);
            let teamBalanceOrg = await waffle.provider.getBalance(TEAM);
            expect(
                await waffle.provider.getBalance(TREASURY)
            ).to.equal(ethers.utils.parseEther('0'));
            expect(
                await waffle.provider.getBalance(TEAM)
            ).to.equal(ethers.utils.parseEther('10000'));
            await syncXColors.connect(constantAddress).withdrawTeam();
            let balance = ethers.utils.formatEther(ethers.utils.parseEther((price_in_ether*100).toString()));
            let treasuryBalance = ethers.utils.formatEther((await waffle.provider.getBalance(TREASURY)).toString());
            let teamBalance = ethers.utils.formatEther((await waffle.provider.getBalance(TEAM)).toString());
            expect(+treasuryBalance).to.equal(+balance / 2);
            expect(teamBalance).to.equal("10002.5");
            expect(
                await waffle.provider.getBalance(syncXColors.address)
            ).to.equal(ethers.utils.parseEther('0'));
        });
         */

    });

})

describe('Public Functions', () => {
  // TODO: color test
  beforeEach(deploy)
  describe('mint()', () => {
    it('Should mint grayscale', async () => {
      await syncXColors.mint(1, [], { value: price })
      expect(await syncXColors.balanceOf(deployer.address)).to.be.eq('1')
      expect(await syncXColors.totalSupply()).to.equal(1)
      let base64svg = await syncXColors.tokenURI(0)
      let buff = new Buffer(base64svg.split(',')[1], 'base64')
      let buffAscii = buff.toString('utf8')
      let buffImgData = buffAscii.split(',')[1]
      let buffImg64 = buffImgData.substring(0, buffImgData.length - 1)
      let buffImg = new Buffer(buffImg64, 'base64')
      let buffImgAscii = buffImg.toString('utf8')
      let prettySvg = prettier.format(buffImgAscii, {
        semi: false,
        parser: 'html',
      })
      await fs.writeFile('test/output/test1.svg', prettySvg, (err) => {
        if (err) console.log(err)
      })
    })

    it('Should mint more than 1 limit', async () => {
      //console.log(ethers.utils.formatEther(await ethers.provider.getBalance(deployer.address)));
      await syncXColors.mint(10, [], {
        value: ethers.utils.parseEther((price_in_ether * 10).toString()),
      })
      expect(await syncXColors.balanceOf(deployer.address)).to.be.eq('10')
    })


    it('Should not mint more than 10 limit', async () => {
      await expect(syncXColors.mint(11, [], {value:price})).to.be.revertedWith(
        "Max mint 10 per tx"
      );
    });

    it('Should check third part mint', async () => {
      await syncXColors.connect(thirdParty).mint(1, [], {value:price});
      expect(await syncXColors.balanceOf(thirdParty.address)).to.be.eq(
        '1'
      );
      expect(await syncXColors.totalSupply()).to.equal(1);
    });

    /* Works, but takes 2m
    it('Should check sold out limit', async () => {
      await mintThirdParty(MAX_SUPPLY);
      expect(await syncXColors.totalSupply()).to.equal(MAX_SUPPLY);
      await expect(mintThirdParty(1)).to.be.revertedWith(
        "Exceeds supply"
      );
      // for this to work change TEAM address in contract
      await syncXColors.connect(constantAddress).mint(10, []);
      expect(await syncXColors.totalSupply()).to.equal(MAX_SUPPLY+10);
      await syncXColors.connect(constantAddress).mint(7, []);
      expect(await syncXColors.totalSupply()).to.equal(MAX_SUPPLY+17);
      await expect(syncXColors.connect(constantAddress).mint(1, [])).to.be.revertedWith(
        "Not enough reserve tokens"
      );
    });
     */

    it('Should not mint if not enough funds', async () => {
      await expect(syncXColors.mint(1, [], {value:ethers.utils.parseEther("0.01")})).to.be.revertedWith(
        "Insufficient funds"
      );
    });
  })
})
