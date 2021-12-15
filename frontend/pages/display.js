import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useWeb3Context } from 'web3-react'
import SyncXColors from '../../artifacts/contracts/SyncXColors.sol/Sync.json'
import { Footer } from '../components/footer'
import { MetaHead } from '../components/head'
import { Loader } from '../components/loader'
import { Navbar } from '../components/navbar'
import styles from '../styles/meme.module.css'

export default function Display() {
  const { query } = useRouter()
  const context = useWeb3Context()

  const SYNC_CONTRACT = '0x2ED6550746891875A7e39d3747d1a4FFe5433289'
  const [svgs, setSvgs] = useState(null)
  const [reveal, setReveal] = useState(null)
  const [multi, setMulti] = useState(null)
  const [loaded, setLoaded] = useState(null)

  useEffect(async () => {

    const filter = []
    if (query.tokenID || query.mintCount) setReveal(true)

    if (context.active) {
      const contract = new context.library.eth.Contract(
        SyncXColors.abi,
        SYNC_CONTRACT
      )

      if (query.tokenID) filter.push(query.tokenID)
      if (query.mintCount > 1) setMulti(true)

      await updateSyncs(
        contract,
        context.account,
        query.tokenID,
        query.mintCount
      )

      setLoaded(true)
    }
  }, [context])

  async function updateSyncs(contract, account, tokenID, mintCount) {
    const svgs = []

    if (tokenID) {
      const svgElement = await contract.methods
        .getTokenSVG(
          context.library.eth.abi.encodeParameter('uint256', tokenID)
        )
        .call()
      svgs.push({ svg: svgElement, tokenId: tokenID })
      setSvgs(svgs)
      return
    }

    const colorsCount = await contract.methods.balanceOf(account).call()
    const start = query.mintCount ? colorsCount - mintCount : 0
    for (const i = start; i < colorsCount; ++i) {
      const tokenId = await contract.methods
        .tokenOfOwnerByIndex(
          account,
          context.library.eth.abi.encodeParameter('uint256', i)
        )
        .call()
      const svg2 = await contract.methods
        .getTokenSVG(
          context.library.eth.abi.encodeParameter('uint256', tokenId)
        )
        .call()
      const svg = svg2.replace('<svg', '<svg viewbox="0 0 500 500"')
      svgs.push({
        tokenId,
        svg,
      })
    }

    setSvgs(svgs)
  }



  return (
    <div className={styles.mainContainer}>
      <MetaHead />
      <Navbar />
      <div className={styles.container}>
        <div className={styles.main}>
          <div
            className={
              'text-center justify-center container mx-auto flex px-5 py-24 md:flex-row flex-col bg-gray-300 bg-opacity-50 items-center border-gray-800 border-8'
            }
          >
            {!context.active && (
              <div className={'flex-1 flex center-content justify-center'}>
                <p className={'font-bold title-font uppercase text-4xl'}>
                  Please Connect via MetaMask
                </p>
              </div>
            )}
            {context.active && (
              <div className={'mb-10'}>
                {reveal && (
                  <p
                    className={
                      'text-center mb-1 text-xl font-bold title-font sm:text-4xl text-3xl mb-2 font-black text-gray-900 pt-0 mt-0 uppercase'
                    }
                  >
                    Your Sync X Color{multi ? 's' : ''}
                  </p>
                )}
                {!reveal && (
                  <div>
                    <p
                      className={
                        'text-center mb-1 text-xl font-bold title-font sm:text-4xl text-3xl mb-2 font-black text-gray-900 pt-0 mt-0 uppercase'
                      }
                    >
                      Your Owned Syncs
                    </p>
                    <p className={'text-center mb-4 font-late-500 text-sm'}>
                      Select an NFT to re-SYNC your colors!
                    </p>
                  </div>
                )}
                <div
                  className={
                    'flex flex-wrap colors justify-center content-center'
                  }
                >
                  {svgs &&
                    svgs.map((svg) => (
                      <div
                        className={'border-gray-800 border-4 m-4'}
                        key={svg.tokenId}
                      >
                        <Link href={`/mint?tokenID=${svg.tokenId}`}>
                          <div
                            className={styles.sync}
                            style={{
                              width: 200,
                              height: 200,
                              cursor: 'pointer',
                            }}
                            dangerouslySetInnerHTML={{ __html: svg.svg }}
                          ></div>
                        </Link>
                      </div>
                    ))}
                  {!loaded && <Loader />}
                  {loaded && !svgs?.length && <div className={'font-bold title-font uppercase text-2xl'}>
                    No owned Color X Sync NFTs
                  </div>
                  }
                </div>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  )
}
