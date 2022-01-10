async function main() {
  const Minter = await ethers.getContractFactory('Minter')

  // Start deployment, returning a promise that resolves to a contract object
  const myMinter = await Minter.deploy()
  console.log('Contract deployed to address:', myMinter.address)

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
