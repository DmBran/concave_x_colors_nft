import SyncXColors from '../../artifacts/contracts/SyncXColors.sol/Sync.json';
//import TheSpirals from '../../artifacts/contracts/legacy_spirals/TheSpirals.sol/TheSpirals.json';
//import TheColors from '../../artifacts/contracts/legacy_colors/TheColors.sol/TheColors.json';
import styles from '../styles/meme.module.css'
import { Navbar } from '../components/navbar'
import { Footer } from '../components/footer'
import { MetaHead } from '../components/head'
import { Loader } from '../components/loader'
import React, {useState, useEffect} from 'react';
import { useWeb3Context } from 'web3-react';

export default function NFTs() {
  const context = useWeb3Context()

  const MAX_COLORS = 4317
  const COLORS_CONTRACT = '0x3C4CfA9540c7aeacBbB81532Eb99D5E870105CA9'
  const SPIRALS_CONTRACT = '0x2ED6550746891875A7e39d3747d1a4FFe5433289'
  const [svgs, setSvgs] = useState(null)
  const [web3, setWeb3] = useState(null)
  const [minted, setMint] = useState(null)
  const [address, setAddress] = useState(null)
  const [network, setNetwork] = useState(null)
  const [colorsOwned, setColorsOwned] = useState(null)

  useEffect(async () => {
    setSvgs([]);
    await context.setFirstValidConnector(['MetaMask'])

    if (context.active) {
      setAddress(context.account)

      const contract = new context.library.eth.Contract(SyncXColors.abi, SPIRALS_CONTRACT);
      await updateNFTs(contract, context.account)
    }

  }, [])

  async function updateNFTs(contract, account){
    const svgs = [];

    const colorsCount = await contract.methods.balanceOf(account).call()
    console.log(colorsCount)
    setColorsOwned(colorsCount)
  
    for (const i = 0; i < colorsCount; ++i) {
      const tokenId = await contract.methods.tokenOfOwnerByIndex(account, context.library.eth.abi.encodeParameter('uint256',i)).call()
      const svg = await contract.methods.getTokenSVG(context.library.eth.abi.encodeParameter('uint256',tokenId)).call()
      svgs.push({
        tokenId,
        svg
      })
    }
    console.log(svgs)
    setSvgs(svgs)
  }

  return (
    <div className={styles.mainContainer}>
      <MetaHead />
      <Navbar />
      <div className={styles.container}>
        <div className={styles.modal}>
          {/* {minted && <main className={'pb-4 pt-10 mx-auto mt-10 center-items'}>
              <p class="text-center font-bold mb-10 color-green">AHHHH I SYNCED!</p>
              <div dangerouslySetInnerHTML={{ __html: minted }}></div>
          </main>}
          {!minted && <Loader/>} */}
          { colorsOwned > 0 && <div className={"mb-10"}>
            <p className={'font-bold text-center text-xl mb-10'}>Your Owned Syncs</p>
            <div className={"colors justify-center content-center"}>
            {svgs && svgs.map(svg => (
                <div className={styles.sync} dangerouslySetInnerHTML={{ __html: svg.svg }}></div>
            ))}
            {!svgs.length && <Loader />}
            </div>
          </div> }
        </div>
        <Footer />
      </div>
    </div>
  )
}