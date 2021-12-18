async function main() {
  const SyncXColors = await ethers.getContractFactory("SyncXColors")

  // Start deployment, returning a promise that resolves to a contract object
  const mySyncXColors = await SyncXColors.deploy()
  console.log("Contract deployed to address:", mySyncXColors.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
