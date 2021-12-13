import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useWeb3Context } from 'web3-react'
import SyncXColors from '../../artifacts/contracts/SyncXColors.sol/Sync.json'
import { Footer } from '../components/footer'
import { MetaHead } from '../components/head'
import { Loader } from '../components/loader'
import { Navbar } from '../components/navbar'
import styles from '../styles/meme.module.css'

export default function Reveal() {
  const { query } = useRouter()
  const context = useWeb3Context()

  const SYNC_CONTRACT = '0x2ED6550746891875A7e39d3747d1a4FFe5433289'
  const [minted, setMinted] = useState(null)

  useEffect(async () => {
    if (context.active) {
      const contract = new context.library.eth.Contract(
        SyncXColors.abi,
        SYNC_CONTRACT
      )
      await fetchSync(query.tokenID, contract)
    }
  }, [])

  async function fetchSync(tokenId, contract) {
    const svgElement = await contract.methods
      .getTokenSVG(context.library.eth.abi.encodeParameter('uint256', tokenId))
      .call()
    setMinted(svgElement)
    return svgElement
  }

  return (
    <div className={styles.mainContainer}>
      <MetaHead />
      <Navbar />
      <div className={styles.container}>
        <div className={styles.main}>
          <main className={styles.modal}>
            {context.active && (
              <div>
                <p className={'text-center text-xl font-bold'}>
                  Your Sync X Color
                </p>
                {minted && (
                  <main
                    className={
                      'pb-4 mx-auto flex justify-center mt-10 center-items'
                    }
                  >
                    <div dangerouslySetInnerHTML={{ __html: minted }}></div>
                  </main>
                )}
                {!minted && <Loader />}
              </div>
            )}
            {!context.active && (
              <div className={'flex-1 flex center-content justify-center'}>
                <p className={'font-bold'}>Please Connect via MetaMask</p>
              </div>
            )}
          </main>
        </div>
        <Footer />
      </div>
    </div>
  )
}
