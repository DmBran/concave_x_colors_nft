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
    const uri = await decodeToken(thisSyncContract.tokenURI(i))
    console.log(uri)
    output_svg(i, uri);

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

function output_svg(tokenId, uri) {
  const fs = require('fs')
  console.log(`../../svg/test/${uri.theme}_${tokenId}_Colors(${uri.colors}).svg`)
  console.log(uri['svg'].toString())
  fs.writeFile(
    `../../svg/test/${uri['theme']}_${tokenId}_Colors(${uri['colors']}.svg`,
    uri.svg.toString(),
    (err) => {
      // In case of a error throw err.
      if (err) console.log(err)
    }
  )
}
//import atob from 'atob'

function decodeToken(tokenURI){
  try {
    let buff = new Buffer(tokenURI.split(',')[1], 'base64')
    let buffAscii = buff.toString('utf8').replace(/.\}\]\}/, '0}]}')
    let buffImgData = buffAscii.split(',')[1]
    let buffImg64 = buffImgData.substring(0, buffImgData.length - 1)
    let buffImg = new Buffer(buffImg64, 'base64')
    let svg = buffImg.toString('utf8')
	
    const meta = JSON.parse(buffAscii)

    let rarity,
      theme,
      colors,
      syncCount = 0
    for (let i = 0; i < meta.attributes.length; ++i) {
      if (meta.attributes[i].trait_type === 'Colors') {
        colors = meta.attributes[i].value.split(',').filter((v) => v.length)
      }
      if (meta.attributes[i].trait_type === 'Rarity') {
        rarity = meta.attributes[i].value
      }
      if (meta.attributes[i].trait_type === 'Theme') {
        theme = meta.attributes[i].value
      }
      if (meta.attributes[i].trait_type === 'Resync_Count') {
        syncCount = meta.attributes[i].value
      }
    }

    return {
      syncCount,
      rarity,
      colors,
      theme,
      meta,
      svg,
    }
  } catch (e) {
    console.log(e)
    return {}
  }
}
