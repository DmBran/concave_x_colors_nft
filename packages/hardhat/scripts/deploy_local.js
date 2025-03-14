// scripts/deploy.js
async function main() {
  // We get the contract to deploy
  const Box = await ethers.getContractFactory('SyncXColors')
  console.log('Deploying Sync...')
  const box = await Box.deploy()
  await box.deployed()
  console.log('Sync contract deployed to:', box.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
