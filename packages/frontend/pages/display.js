import { useRouter } from 'next/router'
import process from 'process'
import React, { useEffect, useState } from 'react'
import { useWeb3Context } from 'web3-react'
import SyncXColors from '../artifacts/SyncXColors.json'
import SyncModal from '../components/dialog.js'
import { Footer } from '../components/footer'
import { MetaHead } from '../components/head'
import { Loader } from '../components/loader'
import { Navbar } from '../components/navbar'
import { decodeToken } from '../helpers/decode-token'
import styles from '../styles/meme.module.css'

export default function Display() {
  const router = useRouter()
  const query = router.query
  const context = useWeb3Context()
  const NETWORK = Number(process.env.NEXT_PUBLIC_NETWORK)
  const SYNC_CONTRACT = process.env.NEXT_PUBLIC_SYNC_CONTRACT
  const [isOpen, setIsOpen] = useState(false)
  const [modalSvg, setModalSvg] = useState(null)
  const [svgs, setSvgs] = useState(null)
  const [reveal, setReveal] = useState(null)
  const [display, setDisplay] = useState(null)
  const [multi, setMulti] = useState(null)
  const [loaded, setLoaded] = useState(null)

  useEffect(async () => {
    const filter = []

    if (router.pathname === '/display' && !query.resync) setDisplay(true)

    console.log([router.pathname, display])
    if (query.tokenID || query.mintCount) setReveal(true)

    if (context.active && context.networkId === NETWORK) {
      const contract = new context.library.eth.Contract(
        SyncXColors.abi,
        SYNC_CONTRACT
      )

      if (query.tokenID) filter.push(query.tokenID)
      else if (query.mintCount != 1) setMulti(true)

      await updateSyncs(
        contract,
        context.account,
        query.tokenID,
        query.mintCount
      ).catch()

      setLoaded(true)
    }
  }, [context])

  async function updateSyncs(contract, account, tokenID, mintCount) {
    const svgs = []
    setLoaded(false)

    if (tokenID) {
      const tokenMeta = await contract.methods.tokenURI(tokenID).call()
      const traits = decodeToken(tokenMeta)
      svgs.push({
        tokenId: tokenID,
        ...traits,
      })
      setSvgs(svgs)
      setLoaded(true)
      return
    }

    const colorsCount = await contract.methods.balanceOf(account).call()
    const start = query.mintCount ? colorsCount - mintCount : 0
    for (let i = start; i < colorsCount; ++i) {
      const tokenId = await contract.methods
        .tokenOfOwnerByIndex(
          account,
          context.library.eth.abi.encodeParameter('uint256', i)
        )
        .call()

      const tokenMeta = await contract.methods.tokenURI(tokenId).call()

      const traits = decodeToken(tokenMeta)
      svgs.push({
        tokenId,
        ...traits,
      })
    }

    setSvgs(svgs)
    setLoaded(true)
  }

  return (
    <div className={styles.mainContainer}>
      <MetaHead />
      <Navbar />
      <div className={styles.container}>
        <div className={styles.main}>
          <main className={'relative container mx-auto  '}>
            <div>
              <div
                className={
                  'bg-white  border-gray-800 border-8 relative container mx-auto flex px-5 py-6 lg:py-24 md:flex-row flex-col items-center'
                }
              >
                <div
                  className={
                    'text-center justify-center container mx-auto flex px-5  md:flex-row flex-col items-center bg-white'
                  }
                >
                  {!context.active && (
                    <div
                      className={'flex-1 flex center-content justify-center'}
                    >
                      <p className={'font-bold title-font uppercase text-4xl'}>
                        Please Connect via MetaMask
                      </p>
                    </div>
                  )}
                  {context.active && (
                    <div className={'mb-10'}>
                      {
                        <p
                          className={
                            'text-center mb-1 text-xl font-bold title-font sm:text-4xl text-3xl mb-2 font-black text-gray-900 pt-0 mt-0 uppercase'
                          }
                        >
                          Your Sync X Color{multi ? 's' : ''}
                        </p>
                      }
                      <div
                        className={
                          'flex flex-wrap colors justify-center content-center'
                        }
                      >
                        {loaded &&
                          svgs &&
                          svgs.map((svg) => (
                            <div
                              className={'border-gray-800 border-4 m-4'}
                              key={svg.tokenId}
                            >
                              <div
                                className={styles.sync}
                                onClick={() => {
                                  setIsOpen(true)
                                  setModalSvg(svg)
                                }}
                                style={{
                                  width: 200,
                                  height: 200,
                                  cursor: 'pointer',
                                }}
                              >
                                <img src={`${svg.svg64}`} />
                              </div>
                            </div>
                          ))}
                        {!loaded && (
                          <div className="mt-10">
                            <Loader />
                          </div>
                        )}
                        {loaded && !svgs?.length && (
                          <div
                            className={
                              'font-bold title-font uppercase text-2xl'
                            }
                          >
                            No owned Color X Sync NFTs
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </div>
      <SyncModal
        svg={modalSvg}
        isOpen={isOpen ?? false}
        setIsOpen={setIsOpen}
      />
    </div>
  )
}
