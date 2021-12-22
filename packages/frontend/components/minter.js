import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useWeb3Context } from 'web3-react'
import TheColors from '../artifacts/contracts/legacy_colors/TheColors.sol/TheColors.json'
import SyncXColors from '../artifacts/contracts/SyncXColors.sol/SyncXColors.json'
import styles from '../styles/meme.module.css'
import { Loader } from './loader'
import process from 'process'
import { decodeToken } from '../helpers/decode-token'
import { sendTx } from '../helpers/send-tx'

export const Minter = (props) => {
  const context = useWeb3Context()

  const NETWORK = Number(process.env.NEXT_PUBLIC_NETWORK)
  const MAX_MINT_COUNT = Number(process.env.NEXT_PUBLIC_MAX_MINT_COUNT)
  const MAX_SUPPLY = Number(process.env.NEXT_PUBLIC_MAX_SUPPLY)
  const MAX_COLORS = Number(process.env.NEXT_PUBLIC_MAX_COLORS)
  const COLORS_CONTRACT = process.env.NEXT_PUBLIC_COLORS_CONTRACT
  const SYNC_CONTRACT = process.env.NEXT_PUBLIC_SYNC_CONTRACT
  const MINT_COST = process.env.NEXT_PUBLIC_MINT_COST
  const COLOR_COST = process.env.NEXT_PUBLIC_COLOR_COST

  const [svgs, setSvgs] = useState([])
  const [sync, setSync] = useState(null)
  const [amountMinted, setAmountMinted] = useState(null)
  const [mintColors, setMintColors] = useState(0)
  const [selectedColors, setSelectedColors] = useState({})
  const [mintCount, setMintCount] = useState(1)
  const [tokenID, setTokenID] = useState(null)
  const [address, setAddress] = useState(null)
  const [submitting, setSubmitting] = useState(null)
  const [colorsOwned, setColorsOwned] = useState(null)

  useEffect(async () => {
    if (context.active && context.networkId === NETWORK) {
      const syncContract = new context.library.eth.Contract(
        SyncXColors.abi,
        SYNC_CONTRACT
      )

      const minted = await syncContract.methods.totalSupply().call()
      setAmountMinted(minted)

      if (props.tokenID) {
        setTokenID(props.tokenID)
        const svg = await fetchSync(syncContract, props.tokenID)
        setSync(svg)
      } else {
        setTokenID(undefined)
        setSync(undefined)
      }

      setAddress(context.account)

      const contract = new context.library.eth.Contract(
        TheColors.abi,
        COLORS_CONTRACT
      )
      await updateColorList(contract, context.account)
    }
  }, [context])

  async function updateColorList(contract, account) {
    const svgs = []

    const colorsCount = await contract.methods.balanceOf(account).call()
    if (!colorsCount) return

    setColorsOwned(parseInt(colorsCount))

    for (let i = 0; i < colorsCount; ++i) {
      const tokenId = await contract.methods
        .tokenOfOwnerByIndex(
          account,
          context.library.eth.abi.encodeParameter('uint256', i)
        )
        .call()
      const color = await contract.methods
        .getHexColor(
          context.library.eth.abi.encodeParameter('uint256', tokenId)
        )
        .call()
      svgs.push({
        tokenId,
        color,
      })
    }

    setSvgs(svgs)
  }

  async function mintSync() {
    setSubmitting('syncs')

    const contract = new context.library.eth.Contract(
      SyncXColors.abi,
      SYNC_CONTRACT
    )

    const tokens = Object.keys(selectedColors).map((colorID) =>
      parseInt(colorID)
    )

    const txCall = contract.methods.mint(mintCount, tokens)

    const tx = await sendTx(context.library, {
      data: txCall.encodeABI(),
      to: SYNC_CONTRACT,
      cost: MINT_COST,
      count: mintCount,
      from: address,
    })

    setSubmitting(undefined)
    if (tx?.transactionHash)
      return Router.push(`/display?mintCount=${mintCount}`)
    return
  }

  async function fetchSync(contract, tokenID) {
    const tokenURI = await contract.methods
      .tokenURI(context.library.eth.abi.encodeParameter('uint256', tokenID))
      .call()
    const token = decodeToken(tokenURI)
    return token
  }

  async function remintSync() {
    setSubmitting('sync')

    const contract = new context.library.eth.Contract(
      SyncXColors.abi,
      SYNC_CONTRACT
    )

    const tokens = Object.keys(selectedColors).map((colorID) =>
      parseInt(colorID)
    )

    const txCall = contract.methods.updateColors(props.tokenID, tokens)

    const tx = await sendTx(context.library, {
      data: txCall.encodeABI(),
      to: SYNC_CONTRACT,
      cost: COLOR_COST,
      from: address,
      count: 1,
    })

    setSubmitting(undefined)
    if (tx?.transactionHash)
      return Router.push(`/display?tokenID=${props.tokenID}`)

    return
  }

  function selectColor(svg) {
    if (svg.selected) {
      delete svg.selected
      delete selectedColors[svg.tokenId]
      setMintColors('unselect-' + svg.tokenId)
      setSelectedColors(selectedColors)
      return
    }

    if (Object.keys(selectedColors).length === MAX_COLORS) {
      toast.error('Max number of colors selected!')
      return
    }

    selectedColors[svg.tokenId] = 1
    svg.selected = 1

    setMintColors(svg.tokenId)
    setSelectedColors(selectedColors)
  }

  async function beginMint() {
    if (tokenID) {
      return await remintSync()
    } else {
      return await mintSync()
    }
  }

  function mintCountIncrement(dir) {
    let count = mintCount
    if (!count || isNaN(count)) count = 1

    if (dir === 'decrement') {
      count -= 1
    } else {
      count += 1
    }

    if (count < 1) return
    if (count > MAX_MINT_COUNT) return

    setMintCount(count)
  }

  function getMintText(loading) {
    if (loading) return 'MINTING...'

    if (tokenID) {
      return 'Color ∞ Sync!'
    } else {
      return 'MINT!'
    }
  }

  function colorsSelected() {
    return Object.keys(selectedColors).length
  }

  if (context.active) {
    if (context.networkId !== NETWORK) {
      return (
        <div
          className={
            'flex-1 font-bold text-red flex text-center center-content justify-center'
          }
        >
          <p className={'font-bold title-font uppercase text-4xl'}>
            Please switch network to Ethereum mainnet
          </p>
        </div>
      )
    }
    if (context.account) {
      return (
        <div className={'w-full mx-auto lg:w-2/3 rounded py-10 px-6 lg:px-0'}>
          {tokenID && (
            <div className={'mt-0 mb-10'}>
              <p
                className={
                  'text-center mb-1 text-xl font-bold title-font sm:text-4xl text-3xl mb-4 font-black text-gray-900 pt-0 mt-0 uppercase'
                }
              >
                Current Sync X Color
              </p>
              <div className={'flex colors justify-center content-center'}>
                {!sync && <Loader />}
                {sync?.svg64 && (
                  <div className={'border-gray-800 border-4 m-4'}>
                    <div
                      className={styles.sync}
                      style={{
                        width: 200,
                        height: 200,
                      }}
                    >
                      <img src={`${sync.svg64}`} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {colorsOwned > 0 && (
            <div className={'mb-10 '}>
              <p
                className={
                  'text-center mb-1 text-xl font-bold title-font sm:text-4xl text-3xl mb-4 font-black text-gray-900 pt-0 mt-0 uppercase'
                }
              >
                Select {tokenID ? 'New' : 'Your'} Color Primitives
              </p>
              <p
                className={'text-black text-center mb-3 font-late-500 text-xs'}
              >
                (up to three)
              </p>
              <div
                className={
                  'flex flex-wrap colors justify-center content-center'
                }
              >
                {svgs &&
                  svgs.map((svg) => (
                    <div
                      onClick={() => selectColor(svg)}
                      key={svg.color}
                      className={
                        'border-solid border-4 border-gray-800 opacity-85  color shadow-lg ' +
                        (selectedColors[svg.tokenId] == 1
                          ? `${styles.colorActive} ring-4 ring-offset-0 ring-blue-700`
                          : 'border-white')
                      }
                      style={{
                        width: 75,
                        height: 75,
                        background: svg.color,
                        cursor: 'pointer',
                        margin: 10,
                      }}
                    ></div>
                  ))}
                {!svgs.length && <Loader />}
              </div>
            </div>
          )}
          {colorsOwned === 0 && !tokenID && (
            <div className={'mb-10'}>
              <p
                className={
                  'text-center mb-1 text-xl font-bold title-font sm:text-4xl text-3xl mb-4 font-black text-gray-900 pt-0 mt-0 uppercase'
                }
              >
                Mint Your Color X Sync NFT
              </p>
              <p className={'text-center mb-3 font-late-500 text-xs'}>
                grayscale default. chances for colored rares
                <br style={{ display: 'block' }}></br>
              </p>
            </div>
          )}

          {!tokenID && (
            <>
              <p className={'text-center font-bold mb-2 uppercase'}>
                Mint Count
              </p>
              <div className={'flex mb-10 content-center justify-center'}>
                <div
                  className={
                    'flex content-center justify-center custom-number-input rounded-lg h-10 w-32'
                  }
                >
                  <div
                    className={
                      'border-1 border-black flex flex-row h-10 w-full rounded-lg relative bg-transparent'
                    }
                  >
                    <button
                      onClick={() => mintCountIncrement('decrement')}
                      data-action="decrement"
                      className={
                        'bg-white border-2 border-slate-700 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none'
                      }
                    >
                      <span className={'m-auto text-2xl font-thin'}>−</span>
                    </button>
                    <input
                      min="1"
                      max={MAX_MINT_COUNT}
                      type="text"
                      className={
                        'border-2 border-r-0 border-l-0 border-slate-700 bg-white outline-none focus:outline-none text-center w-full  font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700  outline-none'
                      }
                      name="custom-input-number"
                      onChange={(e) => {
                        setMintCount(
                          Math.min(e.target.value ?? 1, MAX_MINT_COUNT)
                        )
                      }}
                      value={mintCount ?? 1}
                    />
                    <button
                      onClick={() => mintCountIncrement('increment')}
                      data-action="increment"
                      className={
                        'bg-white border-2 border-slate-700 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer'
                      }
                    >
                      <span className={'m-auto text-2xl font-thin'}>+</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
          <div className={'content-center justify-center flex mb-10'}>
            {submitting != 'syncs' && (
              <button
                onClick={beginMint}
                className={
                  'bg-blue-700 mx-5 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
                }
              >
                {getMintText()}
              </button>
            )}
            {submitting == 'syncs' && (
              <button
                className={
                  'bg-blue-700 mx-5 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
                }
              >
                {getMintText('loading')}
              </button>
            )}
          </div>
          {!tokenID && colorsOwned > 0 && colorsSelected() === 0 && (
            <div className={'-mt-5 content-center justify-center flex mb-10'}>
              <p
                className={
                  'px-10 py-8 bg-red-400 ring-4 ring-offset-10 ring-black text-black font-bold underline text-center mb-3 font-late-500 text-sm uppercase'
                }
              >
                We recommend you select a color to apply to your mint!
              </p>
            </div>
          )}
          {tokenID && (colorsOwned === 0 || colorsSelected() === 0) && (
            <div className={'-mt-5 content-center justify-center flex mb-10'}>
              <p
                className={
                  'px-10 py-8 bg-red-400 ring-4 ring-offset-10 ring-black text-black font-bold underline text-center mb-3 font-late-500 text-sm uppercase'
                }
              >
                resyncing without a colors nft has no effect
              </p>
            </div>
          )}

          {!tokenID && colorsSelected() > 0 && mintCount > 1 && (
            <div className={'-mt-5 content-center justify-center flex mb-10'}>
              <p
                className={
                  'text-black font-bold text-center mb-3 font-late-500 text-xs'
                }
              >
                same color palette will be used for all mints
                <a
                  className={'block text-blue-500 underlined'}
                  target="_blank"
                  href="https://syncxcolors.xyz/faq#multimint"
                >
                  read more
                </a>
              </p>
            </div>
          )}

          {!tokenID && (
            <div className={'text-center justify-center mb-10'}>
              <p className={'uppercase text-2xl font-bold'}>
                {amountMinted?.toLocaleString()} / {MAX_SUPPLY.toLocaleString()}
              </p>
            </div>
          )}

          <p className={'text-center font-bold uppercase'}>
            {tokenID ? 'PRICE: ' : '1 SYNC = '}
            {tokenID ? COLOR_COST.toString() : MINT_COST.toString()}{' '}
            <span
              style={{ top: '2px' }}
              className={'inline-block align-top relative'}
            >
              <svg
                width="10"
                version="1.1"
                shapeRendering="geometricPrecision"
                textRendering="geometricPrecision"
                imageRendering="optimizeQuality"
                fillRule="evenodd"
                clipRule="evenodd"
                viewBox="0 0 784.37 1277.39"
              >
                <g id="Layer_x0020_1">
                  <metadata id="CorelCorpID_0Corel-Layer" />
                  <g id="_1421394342400">
                    <g>
                      <polygon
                        fill="#343434"
                        fillRule="nonzero"
                        points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54 "
                      />
                      <polygon
                        fill="#8C8C8C"
                        fillRule="nonzero"
                        points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33 "
                      />
                      <polygon
                        fill="#3C3C3B"
                        fillRule="nonzero"
                        points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89 "
                      />
                      <polygon
                        fill="#8C8C8C"
                        fillRule="nonzero"
                        points="392.07,1277.38 392.07,956.52 -0,724.89 "
                      />
                      <polygon
                        fill="#141414"
                        fillRule="nonzero"
                        points="392.07,882.29 784.13,650.54 392.07,472.33 "
                      />
                      <polygon
                        fill="#393939"
                        fillRule="nonzero"
                        points="0,650.54 392.07,882.29 392.07,472.33 "
                      />
                    </g>
                  </g>
                </g>
              </svg>
            </span>
          </p>
        </div>
      )
    }
  }

  return (
    <div className={'flex-1 flex center-content justify-center'}>
      <p className={'font-bold title-font uppercase text-4xl'}>
        Please Connect via MetaMask
      </p>
    </div>
  )
}
