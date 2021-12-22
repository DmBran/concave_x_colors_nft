// scripts/index.js
async function main() {
  // Set up an ethers contract, representing our deployed Box instance

  await network.provider.send('hardhat_setBalance', [
    '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
    '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
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
  rarity_counters = {Common:0, 'Tokyo Drift':0, Mosaic:0, Silver:0, Gold:0, Olympus:0, Concave:0};
  
  TO_MINT = 1000; //# Mints for each color
  
  for (let i = 0; i < TO_MINT; i++) {
	colorTokenIds = [];
	/*
	if (i<250){
		colorTokenIds = [];
	
	}else if (i < 500){
		colorTokenIds = getRandomInts(0,9,1);
	}else if (i < 750){
		colorTokenIds = getRandomInts(0,9,2);
	}else{
		colorTokenIds = getRandomInts(0,9,3);;
	}
	* */
    const transaction1 = await thisSyncContract.mint(1, colorTokenIds, {
      value: ethers.utils.parseEther(GAS_PER_MINT),
    })
    const uri = await thisSyncContract.tokenURI(i);
    uri_decoded = decodeToken(uri);
    rarity_counters[uri_decoded.theme] += 1
	output_svg(i, uri_decoded, colorTokenIds.length);

  }
  
  console.log(rarity_counters);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

function getRandomInts(min, max, quantity) {
    const array = [];
    min = Math.ceil(min);
    max = Math.floor(max);
    while (true){
		num = Math.floor(Math.random() * (max - min + 1)) + min;
		if (array.includes(num) == false){
			array.push( num );
		
			if (array.length == quantity){
				return array;
			}
		}
	}
    
    return array
}

function output_svg(tokenId, uri, numColors=0) {
  const fs = require('fs')
  //console.log(`../../svg/test/${uri.theme}_${tokenId}.svg`)
  //console.log(uri['svg'].toString())
  fs.writeFile(
    `../../svg/test/${uri['theme']}/${uri['theme']}_${numColors}_${tokenId}.svg`,
    uri['svg'].toString(),
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
      if (meta.attributes[i].trait_type === 'Sigil') {
        rarity = meta.attributes[i].value
      }
      if (meta.attributes[i].trait_type === 'Rarity') {
        theme = meta.attributes[i].value
      }
      if (meta.attributes[i].trait_type === 'Resync_Count') {
        syncCount = meta.attributes[i].value
      }
    }

    return {
      'colors':colors,
      'theme':theme,
      'svg':svg,
    }
  } catch (e) {
    console.log(e)
    return {}
  }
}
