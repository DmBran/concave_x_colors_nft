// scripts/index.js
async function main() {
  // Set up an ethers contract, representing our deployed Box instance
  //const address = '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512';
  await network.provider.send('hardhat_setBalance', [
    '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
    '0xFFFF0000000000000000',
  ])

  //Usage: npx hardhat run scripts/interact.js --network localhost

  //Defines

  const colorsContract = await ethers.getContractFactory('TheColors')
  const syncContract = await ethers.getContractFactory('Sync')
  const colorsAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
  const thisColorsContract = await colorsContract.attach(colorsAddress)
  const syncAddress = '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512'
  const thisSyncContract = await syncContract.attach(syncAddress)

  // Mint colors
  const transaction1 = await thisColorsContract.mintNextColors(10)

  const value = await thisColorsContract.getHexColor(1)
  console.log(value.toString())

  /*
  // Mint 1 Sync (gray)
  const transaction2 = await thisSyncContract.mint([], {
    value: ethers.utils.parseEther('0.04'),
  })

  //Mint 1 Sync (3 colors)
  

  //Mint 1 syncs (2 colors)
  const transaction4 = await thisSyncContract.mint([3, 4], {
    value: ethers.utils.parseEther('0.04'),
  })

  //Mint 1 syncs (1 color)
  const transaction5 = await thisSyncContract.mint([4], {
    value: ethers.utils.parseEther('0.04'),
  })
  //sends 0.1 eth

  //Retrieve image

	*/
  //const svg1 = await thisSyncContract.getTokenSVG(0)
  //console.log(svg1.toString())
  // const value2 = await thisSyncContract.tokenURI(0)
  //console.log(value2.toString())
  for (let i = 0; i < 100; i++) {
    const transaction3 = await thisSyncContract.mint([0, 1, 2], {
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
  fs.writeFile('svg/test/' + name + '.svg', contents, (err) => {
    // In case of a error throw err.
    if (err) console.log(err)
  })
}
