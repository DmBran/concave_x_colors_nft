import SyncXColors from '../../artifacts/contracts/SyncXColors.sol/Sync.json';
import styles from '../styles/meme.module.css'
import { Navbar } from '../components/navbar'
import { Footer } from '../components/footer'
import { MetaHead } from '../components/head'
import { Loader } from '../components/loader'
import React, {useState, useEffect} from 'react';
import { useWeb3Context } from 'web3-react';
import Link from 'next/link';

export default function NFTs() {
  const context = useWeb3Context()

  const SYNC_CONTRACT = '0x2ED6550746891875A7e39d3747d1a4FFe5433289'
  const [svgs, setSvgs] = useState(null)
  const [colorsOwned, setColorsOwned] = useState(null)

  useEffect(async () => {
    setSvgs([]);

    if (context.active) {
      const contract = new context.library.eth.Contract(SyncXColors.abi, SYNC_CONTRACT);
      await updateNFTs(contract, context.account)
    }

  }, [])

  async function updateNFTs(contract, account){
    const svgs = [];

    const colorsCount = await contract.methods.balanceOf(account).call()
    setColorsOwned(colorsCount)
  
    for (const i = 0; i < colorsCount; ++i) {
      const tokenId = await contract.methods.tokenOfOwnerByIndex(account, context.library.eth.abi.encodeParameter('uint256',i)).call()
      const svg = await contract.methods.getTokenSVG(context.library.eth.abi.encodeParameter('uint256',tokenId)).call()
      svgs.push({
        tokenId,
        svg
      })
      console.log(svg)
    }

    setSvgs(svgs)
  }

    return (
      <div className={styles.mainContainer}>
        <MetaHead />
        <Navbar />
        <div className={styles.container}>
        <div className={styles.main}><div className={styles.modal}>
          { !context.active && 
              <div className={"flex-1 flex center-content justify-center"}>
                <p className={'font-bold'}>Please Connect via MetaMask</p>
              </div>
            }
            { context.active && <div className={"mb-10"}>
              <p className={'font-bold text-center text-xl mb-10'}>Your Owned Syncs</p>
              <div className={"colors justify-center content-center"}>
              {svgs && svgs.map(svg => (
                  <Link key={svg.tokenId} href={`/mint?tokenID=${svg.tokenId}`}>
                    <div className={styles.sync} dangerouslySetInnerHTML={{ __html: svg.svg }}></div>
                  </Link>
              ))}
              {!svgs.length && <Loader />}
              </div>
            </div> }
          </div></div>
          <Footer />
        </div>
      </div>
    )
  
}