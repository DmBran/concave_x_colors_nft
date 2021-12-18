import { expect } from 'chai'
import { deployments, ethers, getNamedAccounts } from 'hardhat'

const memory: any = {}

describe('SyncXColors', function () {
  before(async () => {
    memory.signers = await ethers.getSigners()
    memory.deployer = memory.signers[0]
    memory.other1 = memory.signers[1]
    memory.other2 = memory.signers[2]
    memory.namedAccounts = await getNamedAccounts()
  })

  beforeEach(async () => {
    const { SyncXColors } = await deployments.fixture(['Sync'])
    memory.SyncXColors = await ethers.getContractAt(
      SyncXColors.abi,
      SyncXColors.address,
      memory.other1
    )
  })

  it('Should get max token id', async () => {
    const maxTokenId = await memory.SyncXColors.maxTokenId()
    expect(maxTokenId).to.be.eq('3333')
  })

  it('Should mint grayscale', async () => {
    await memory.SyncXColors.mint([])
    expect(await memory.SyncXColors.balanceOf(memory.other1.address)).to.be.eq(
      '1'
    )
  })

  it('Should mint many from same address', async () => {
    await memory.SyncXColors.mint([])
    await memory.SyncXColors.mint([])
    expect(await memory.SyncXColors.balanceOf(memory.other1.address)).to.be.eq(
      '2'
    )
  })

  it('Should mint many from different address', async () => {
    await memory.SyncXColors.mint([])
    await memory.SyncXColors.connect(memory.other2).mint([])
    expect(await memory.SyncXColors.balanceOf(memory.other1.address)).to.be.eq(
      '1'
    )
    expect(await memory.SyncXColors.balanceOf(memory.other2.address)).to.be.eq(
      '1'
    )
  })

  it('Should throw when mintMany higher than max allowed', async () => {
    await expect(memory.SyncXColors.mintMany('11', [])).to.be.revertedWith(
      'Max mint 10 per tx'
    )
  })
  it('Should throw when mintMany is zero', async () => {
    await expect(memory.SyncXColors.mintMany('0', [])).to.be.revertedWith(
      'Mint should be > 0'
    )
  })
  it('Should throw when mintMany exceeds total supply', async () => {
    await expect(memory.SyncXColors.mintMany('9', [])).to.be.revertedWith(
      'Exceeds supply'
    )
  })

  //TODO: Mintcolors - 1, 2, 3
})
