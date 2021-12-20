const { expect } = require('chai')
const { ethers, waffle } = require('hardhat')
const fs = require('fs')
const prettier = require("prettier");

/**
 Contract Constants & Variables
 */
const THE_COLORS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
const TREASURY = '0x48aE900E9Df45441B2001dB4dA92CE0E7C08c6d2'
const MAX_SUPPLY = 3333

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
let syncXColors
let deployer
let thirdParty

/**
 Helper Functions
 */
const deploy = async () => {
  ;[deployer, thirdParty] = await ethers.getSigners()
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
    if (toMint > 1) {
      await syncXColors.connect(thirdParty).mintMany(toMint, {
        value: ethers.utils.parseEther((price_in_ether * toMint).toString()),
      })
    } else {
      await syncXColors.connect(thirdParty).mint({
        value: ethers.utils.parseEther((price_in_ether * toMint).toString()),
      })
    }
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

  /*
    describe("withdraw()", () => {
        it(`after succesfull sellout - contract balance should equal ${ethers.utils.formatEther(ethers.utils.parseEther((price_in_ether*(MAX_SUPPLY-TOTAL_COLORS_QUOTA)).toString()))}`, async () => {
            expect(await syncXColors.totalSupply()).to.equal(200);
            await mintThirdParty(MAX_SUPPLY - 200)
            expect(await syncXColors.totalSupply()).to.equal(MAX_SUPPLY);
            expect(
                await waffle.provider.getBalance(syncXColors.address)
            ).to.equal(ethers.utils.parseEther((price_in_ether*(MAX_SUPPLY-TOTAL_COLORS_QUOTA)).toString()))
        }).timeout(0);
        it(`if sold 1 NFT - after withdraw contract balance is 0 and allocations would be the above`, async () => {
            
            await mintAllColorsHolders()
            expect(await syncXColors.totalSupply()).to.equal(200);
            // await mintThirdParty(MAX_SUPPLY - 200)
            await mintThirdParty(1)
            // expect(await syncXColors.totalSupply()).to.equal(MAX_SUPPLY);
            // expect(
            //     await waffle.provider.getBalance(syncXColors.address)
            // ).to.equal(ethers.utils.parseEther((price_in_ether*(MAX_SUPPLY-TOTAL_COLORS_QUOTA)).toString()))
            const totalRaised = await waffle.provider.getBalance(syncXColors.address);

            const names = [
                'NFT                                       ',
                'Treasury                                  '
            ]
            const previous = []
            const addresses = [
                syncXColors.address,
                '0x48aE900E9Df45441B2001dB4dA92CE0E7C08c6d2'
            ]
            for (var i = 0; i < addresses.length; i++) {
                const p = await waffle.provider.getBalance(addresses[i])
                previous.push(p)
            }
            console.log(`Total Raised: ${totalRaised/(10**18)}`)
            console.log('---------')
            await syncXColors.withdraw();

            for (var i = 0; i < addresses.length; i++) {
                const p = await waffle.provider.getBalance(addresses[i])
                let ch = p - previous[i]
                let bal = ((p - previous[i])/(10**18))
                console.log(
                    names[i] || addresses[i],
                    bal > 0 ? `+ ${bal}` : `- ${Math.abs(bal)}`,
                    `(${(ch/totalRaised)*100} %)`
                )
            }


            expect(
                await waffle.provider.getBalance(syncXColors.address)
            ).to.equal(ethers.utils.parseEther((0).toString()))
        }).timeout(0);
        it(`if full sellout - after withdraw contract balance is 0 and allocations would be the above`, async () => {
            expect(await syncXColors.totalSupply()).to.equal(200);
            await mintThirdParty(MAX_SUPPLY - 200)
            expect(await syncXColors.totalSupply()).to.equal(MAX_SUPPLY);
            expect(
                await waffle.provider.getBalance(syncXColors.address)
            ).to.equal(ethers.utils.parseEther((price_in_ether*(MAX_SUPPLY-TOTAL_COLORS_QUOTA)).toString()))
            const totalRaised = await waffle.provider.getBalance(syncXColors.address);

            const names = [
                'NFT                                       ',
                'Treasury                                  '
            ]
            const previous = []
            const addresses = [
                syncXColors.address,
                '0x48aE900E9Df45441B2001dB4dA92CE0E7C08c6d2'
            ]
            for (var i = 0; i < addresses.length; i++) {
                const p = await waffle.provider.getBalance(addresses[i])
                previous.push(p)
            }
            console.log(`Total Raised: ${totalRaised/(10**18)}`)
            console.log('---------')
            await syncXColors.withdraw();

            for (var i = 0; i < addresses.length; i++) {
                const p = await waffle.provider.getBalance(addresses[i])
                let ch = p - previous[i]
                let bal = ((p - previous[i])/(10**18))
                console.log(
                    names[i] || addresses[i],
                    bal > 0 ? `+ ${bal}` : `- ${Math.abs(bal)}`,
                    `(${(ch/totalRaised)*100} %)`
                )
            }

            expect(
                await waffle.provider.getBalance(syncXColors.address)
            ).to.equal(ethers.utils.parseEther((0).toString()))
        }).timeout(0);
    })
    */

  // it(``, async () => {})
})

describe("Public Functions", () => {
    beforeEach(deploy)
    describe('mint()', () => {

      it('Should mint grayscale', async () => {
        await syncXColors.mint(1, [], {value:price});
        expect(await syncXColors.balanceOf(deployer.address)).to.be.eq(
          '1'
        )
        expect(await syncXColors.totalSupply()).to.equal(1);
        let svg = await syncXColors.getTokenSVG(0);
        let prettySvg = prettier.format(svg, { semi: false, parser: "html" });
        await fs.writeFile('test/output/test1.svg', prettySvg, (err) => { if (err) console.log(err) });
      })

    /*
        describe("public sale active check",() => {
            it(`mint should fail with "public sale not active" if public sale not active yet`, async () => {
                await expect(
                    syncXColors.connect(thirdParty).mint()
                ).to.be.revertedWith('public sale not active')
            })
            it(`mint should not fail with "public sale not active" if public sale is active `, async () => {
                await syncXColors.setPublicMintActive(true)
                // expect(await syncXColors.totalSupply()).to.equal(200);
                await expect(
                    syncXColors.connect(thirdParty).mint()
                ).to.not.be.revertedWith('public sale not active')
            })
        })
        describe("insufficent funds check",() => {
            it(`mint should fail with "insufficient funds" if msg.value < price`, async () => {
                await mintAllColorsHolders()
                expect(await syncXColors.totalSupply()).to.equal(200);
                // await mintThirdParty(MAX_SUPPLY - 200)
                // expect(await syncXColors.totalSupply()).to.equal(MAX_SUPPLY);
                // expect(await syncXColors.isSoldOut()).to.equal(true);
                await expect(
                    syncXColors.connect(thirdParty).mint()
                ).to.be.revertedWith('insufficient funds')
            }).timeout(0)
            it(`mint should pass if msg.value >= price`, async () => {
                await syncXColors.setPublicMintActive(true)
                // expect(await syncXColors.totalSupply()).to.equal(200);
                // await mintThirdParty(MAX_SUPPLY - 200)
                // expect(await syncXColors.totalSupply()).to.equal(MAX_SUPPLY);
                // expect(await syncXColors.isSoldOut()).to.equal(true);
                await expect(
                    syncXColors.connect(thirdParty).mint({value:ethers.utils.parseEther((price_in_ether).toString())})
                ).to.not.be.reverted
            }).timeout(0)
        })
        describe("counting",() => {
            it(`totalSupply should increase by 1 after mint()`, async () => {
                await syncXColors.setPublicMintActive(true)
                expect(await syncXColors.totalSupply()).to.equal(0);
                await syncXColors.connect(thirdParty).mint({value:ethers.utils.parseEther((price_in_ether).toString())})
                expect(await syncXColors.totalSupply()).to.equal(1);
            }).timeout(0)
        })
       */
  })

  describe('mint()', () => {
    /*
        describe("presale check",() => {
            it(`mintColorsOnce should fail with "presale over" if public sale not active yet`, async () => {
                await syncXColors.setPublicMintActive(true);
                await getColorsMinter()
                await expect(
                    syncXColors.connect(colorsOwnerSigner).mintColorsOnce(0)
                ).to.be.revertedWith('presale over')
            })
            it(`mintColorsBatch should not fail with "presale over" if public sale is active `, async () => {
                await getColorsMinter()
                await expect(
                    syncXColors.connect(colorsOwnerSigner).mintColorsOnce(0)
                ).to.not.be.revertedWith('presale over')
            })
        })
        
        describe('owner of token check',() => {
            it('shoud fail not fail with "Only owner can claim." if owner is sender',async () => {
                await getColorsMinter()
                await expect(
                    syncXColors.connect(colorsOwnerSigner).mintColorsOnce(0)
                ).to.not.be.reverted
            })
            it('shoud fail with "Only owner can claim." if owner is not sender',async () => {
                await getColorsMinter()
                await expect(
                    syncXColors.connect(colorsOwnerSigner).mintColorsOnce(20)
                ).to.be.revertedWith('Only owner can claim.')
            })
        })
       */
  })

  describe('mintMany()', () => {
    /*
        describe("whenNotPaused",() => {
            it(`mintMany should fail with "Pausable: paused" if minting when paused`, async () => {
                await expect(
                    syncXColors.connect(thirdParty).mintMany(2)
                ).to.be.revertedWith('Pausable: paused')
            })
            it(`mintMany should not fail with "Pausable: paused" if minting when not paused`, async () => {
                
                await expect(
                    syncXColors.connect(thirdParty).mintMany(2)
                ).to.not.be.revertedWith('Pausable: paused')
            })
        })
        describe("public sale active check",() => {
            it(`mintMany should fail with "public sale not active" if public sale not active yet`, async () => {
                
                await expect(
                    syncXColors.connect(thirdParty).mintMany(2)
                ).to.be.revertedWith('public sale not active')
            })
            it(`mintMany should not fail with "public sale not active" if public sale is active `, async () => {
                
                await syncXColors.setPublicMintActive(true)
                // expect(await syncXColors.totalSupply()).to.equal(200);
                await expect(
                    syncXColors.connect(thirdParty).mintMany(2)
                ).to.not.be.revertedWith('public sale not active')
            })
        })
        
        describe(`max mint ${maxMintAmount} check, min mint 0 check`,() => {
            it(`mintMany should fail with "exceeds max mint per tx" if mintMany(>${maxMintAmount+1})`, async () => {
                
                await syncXColors.setPublicMintActive(true)
                // expect(await syncXColors.totalSupply()).to.equal(200);
                // await mintThirdParty(MAX_SUPPLY - 200)
                // expect(await syncXColors.totalSupply()).to.equal(MAX_SUPPLY);
                expect(await syncXColors.isSoldOut()).to.equal(false);
                await expect(
                    syncXColors.connect(thirdParty).mintMany(maxMintAmount+1)
                ).to.be.revertedWith('exceeds max mint per tx')
            }).timeout(0)
            it(`mintMany should not fail with "exceeds max mint per tx" if mintMany(<${maxMintAmount})`, async () => {
                
                await syncXColors.setPublicMintActive(true)
                // expect(await syncXColors.totalSupply()).to.equal(200);
                // await mintThirdParty(MAX_SUPPLY - 200)
                // expect(await syncXColors.totalSupply()).to.equal(MAX_SUPPLY);
                expect(await syncXColors.isSoldOut()).to.equal(false);
                await expect(
                    syncXColors.connect(thirdParty).mintMany(9)
                ).to.not.be.revertedWith('exceeds max mint per tx')
            }).timeout(0)
            // it(`mintMany should fail with "Mint should be > 0" if mintMany(0)`, async () => {
            //     
            //     await syncXColors.setPublicMintActive(true)
            //     // expect(await syncXColors.totalSupply()).to.equal(200);
            //     // await mintThirdParty(MAX_SUPPLY - 200)
            //     // expect(await syncXColors.totalSupply()).to.equal(MAX_SUPPLY);
            //     expect(await syncXColors.isSoldOut()).to.equal(false);
            //     await expect(
            //         syncXColors.connect(thirdParty).mintMany(0)
            //     ).to.be.revertedWith('Mint should be > 0')
            // }).timeout(0)
            it(`mintMany should not fail with "" if mintMany(>0)`, async () => {
                
                await syncXColors.setPublicMintActive(true)
                // expect(await syncXColors.totalSupply()).to.equal(200);
                // await mintThirdParty(MAX_SUPPLY - 200)
                // expect(await syncXColors.totalSupply()).to.equal(MAX_SUPPLY);
                expect(await syncXColors.isSoldOut()).to.equal(false);
                await expect(
                    syncXColors.connect(thirdParty).mintMany(9)
                ).to.not.be.revertedWith('Mint should be > 0')
            }).timeout(0)
        })
        describe("exceeds supply",() => {
            it(`mintMany should fail with "exceeds supply" if totalSupply+_mintAmount>MAX_SUPPLY`, async () => {
                
                await mintAllColorsHolders()
                expect(await syncXColors.totalSupply()).to.equal(200);
                await mintThirdParty(MAX_SUPPLY - 205)
                expect(await syncXColors.totalSupply()).to.equal(MAX_SUPPLY-5);
                expect(await syncXColors.isSoldOut()).to.equal(false);
                await expect(
                    syncXColors.connect(thirdParty).mintMany(9)
                ).to.be.revertedWith('exceeds supply')
            }).timeout(0)
            it(`mintMany should not fail with "exceeds supply" if totalSupply+_mintAmount<=MAX_SUPPLY`, async () => {
                
                await syncXColors.setPublicMintActive(true)
                // expect(await syncXColors.totalSupply()).to.equal(200);
                // await mintThirdParty(MAX_SUPPLY - 200)
                // expect(await syncXColors.totalSupply()).to.equal(MAX_SUPPLY);
                expect(await syncXColors.isSoldOut()).to.equal(false);
                await expect(
                    syncXColors.connect(thirdParty).mintMany(9)
                ).to.not.be.revertedWith('exceeds supply')
            }).timeout(0)
        })
        describe("insufficent funds check",() => {
            it(`mintMany should fail with "insufficient funds" if msg.value < price`, async () => {
                
                await syncXColors.setPublicMintActive(true)
                // expect(await syncXColors.totalSupply()).to.equal(200);
                // await mintThirdParty(MAX_SUPPLY - 200)
                // expect(await syncXColors.totalSupply()).to.equal(MAX_SUPPLY);
                // expect(await syncXColors.isSoldOut()).to.equal(true);
                await expect(
                    syncXColors.connect(thirdParty).mintMany(5)
                ).to.be.revertedWith('insufficient funds')
            }).timeout(0)
            it(`mintMany should pass if msg.value >= price`, async () => {
                
                await syncXColors.setPublicMintActive(true)
                // expect(await syncXColors.totalSupply()).to.equal(200);
                // await mintThirdParty(MAX_SUPPLY - 200)
                // expect(await syncXColors.totalSupply()).to.equal(MAX_SUPPLY);
                // expect(await syncXColors.isSoldOut()).to.equal(true);
                await expect(
                    syncXColors.connect(thirdParty).mintMany(5,{value:ethers.utils.parseEther((price_in_ether*5).toString())})
                ).to.not.be.reverted
            }).timeout(0)
        })
        describe("counting",() => {
            it(`totalSupply should increase by 5 after mintMany(5)`, async () => {
                
                await syncXColors.setPublicMintActive(true)
                expect(await syncXColors.totalSupply()).to.equal(0);
                await syncXColors.connect(thirdParty).mintMany(5,{value:ethers.utils.parseEther((price_in_ether*5).toString())})
                expect(await syncXColors.totalSupply()).to.equal(5);
            }).timeout(0)
        })
       */
  })
})

describe('Public View Functions', () => {
  beforeEach(deploy)
  describe('isPublicMintActive', () => {
    /*
        it("shoud return false when supply < 200 or _isPublicMintActive=false",async () => {
            expect(await syncXColors.isPublicMintActive()).to.equal(false);
        }).timeout(0)
        it("shoud return true when supply >= 200",async () => {
            
            await mintAllColorsHolders()
            expect(await syncXColors.isPublicMintActive()).to.equal(true);
        }).timeout(0)
        it("shoud return true when setPublicMintActive set to true even if supply < 200",async () => {
            await syncXColors.setPublicMintActive(true)
            expect(await syncXColors.isPublicMintActive()).to.equal(true);
        }).timeout(0)
       */
  })
})
