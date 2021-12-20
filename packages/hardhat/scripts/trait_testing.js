// scripts/index.js
async function main() {
  // Set up an ethers contract, representing our deployed Box instance

  await network.provider.send('hardhat_setBalance', [
    '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
    '0xFFFF0000000000000000',
  ])

  //Usage: npx hardhat run scripts/interact.js --network localhost

  //Defines
  //SyncXColors contract
  const colorsContract = await ethers.getContractFactory('TheColors')
  const colorsAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
  const thisColorsContract = await colorsContract.attach(colorsAddress)

  //SyncXColors contract
  const syncContract = await ethers.getContractFactory('SyncXColors')
  const syncAddress = '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512'
  const thisSyncContract = await syncContract.attach(syncAddress)

  // Mint 10x colors for use by SyncXColors
  const transaction1 = await thisColorsContract.mintNextColors(10)

  // Mint 100 SyncXColors, outputs to SVG/Test/<tokenId>.SVG
  for (let i = 0; i < 100; i++) {
    const transaction3 = await thisSyncContract.mint(1, [0, 1, 2], {
      value: ethers.utils.parseEther('0.04'),
    })
    const svg = await thisSyncContract.getTokenSVG(i)
    output_svg(i, svg.toString())
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

function output_svg(name, contents) {
  const fs = require('fs')
  fs.writeFile(
    '../../svg/test/rarity_testing_' + name + '.svg',
    contents,
    (err) => {
      // In case of a error throw err.
      if (err) console.log(err)
    }
  )
}
