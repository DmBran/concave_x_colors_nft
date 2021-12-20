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
  const GAS_PER_MINT = '0.05'
  // Mint 100 SyncXColors, outputs to SVG/Test/<tokenId>.SVG
  for (let i = 0; i < 1; i++) {
    const transaction1 = await thisSyncContract.mint(1, [], {
      value: ethers.utils.parseEther(GAS_PER_MINT),
    })
    const uri = await thisSyncContract.tokenURI(i)
    console.log(uri)
    console.log(base64DecodeUnicode(uri))
    
    //const svg = await thisSyncContract.getTokenSVG(i)
    //output_svg(i, svg.toString())
  }
  
  /*
  for (let i = 25; i < 50; i++) {
    const transaction2 = await thisSyncContract.mint(1, [0], {
      value: ethers.utils.parseEther(GAS_PER_MINT),
    })
    const svg = await thisSyncContract.getTokenSVG(i)
    output_svg(i, svg.toString())
  }
  for (let i = 50; i < 75; i++) {
    const transaction3 = await thisSyncContract.mint(1, [0, 1], {
      value: ethers.utils.parseEther(GAS_PER_MINT),
    })
    const svg = await thisSyncContract.getTokenSVG(i)
    output_svg(i, svg.toString())
  }
  for (let i = 75; i < 100; i++) {
    const transaction4 = await thisSyncContract.mint(1, [0, 1, 2], {
      value: ethers.utils.parseEther(GAS_PER_MINT),
    })
    const svg = await thisSyncContract.getTokenSVG(i)
    output_svg(i, svg.toString())
  }
  * */
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
function base64DecodeUnicode(str) {
    let base64ToString = Buffer.from(str, "base64"); //.toString();
    //console.log(base64ToString);
    let base64ToStringNew = base64ToString.toString('utf-8');
	//base64ToString = JSON.parse(base64ToString);
	return base64ToStringNew;
}
