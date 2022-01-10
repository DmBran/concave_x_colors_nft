async function main() {
  const Colors = await ethers.getContractFactory('TheColors')
  const SyncXColors = await ethers.getContractFactory('SyncXColors')
  const Minter = await ethers.getContractFactory('Minter')

  // Start deployment, returning a promise that resolves to a contract object
  const myColors = await Colors.deploy()
  console.log('Contract deployed to address:', myColors.address)
  const mySyncXColors = await SyncXColors.deploy()
  console.log('Contract deployed to address:', mySyncXColors.address)
  const myMinter = await Minter.deploy()
  console.log('Contract deployed to address:', myMinter.address)
  await mySyncXColors.setColorAddress(myColors.address);
  await myMinter.setContractAddress(mySyncXColors.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
