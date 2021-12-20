import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useWeb3Context } from 'web3-react'
import TheColors from '../../../artifacts/contracts/legacy_colors/TheColors.sol/TheColors.json'
import SyncXColors from '../../../artifacts/contracts/SyncXColors.sol/Sync.json'
import styles from '../styles/meme.module.css'
import { Loader } from './loader'
import process from 'process'

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

  const [svgs, setSvgs] = useState(null)
  const [sync, setSync] = useState(null)
  const [amountMinted, setAmountMinted] = useState(null)
  const [mintColors, setMintColors] = useState(null)
  const [mintCount, setMintCount] = useState(null)
  const [tokenID, setTokenID] = useState(null)
  const [address, setAddress] = useState(null)
  const [submitting, setSubmitting] = useState(null)
  const [colorsOwned, setColorsOwned] = useState(null)

  useEffect(async () => {
    if (!mintCount) setMintCount(1)

    if (!mintColors) setMintColors(0)
    setSvgs([])

    if (context.active && context.networkId === NETWORK) {
      const syncContract = new context.library.eth.Contract(
        SyncXColors.abi,
        SYNC_CONTRACT
      )
      //const minted = 0
      const minted = await syncContract.methods.totalSupply().call()
      setAmountMinted(minted)

      if (props.tokenID) {
        setTokenID(props.tokenID)
        const svg = await fetchSync(syncContract, props.tokenID)
        setSync(svg)
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
    let txToast
    try {
      const contract = new context.library.eth.Contract(
        SyncXColors.abi,
        SYNC_CONTRACT
      )

      console.log(contract.methods)

      const tokens = svgs
        .filter((svg) => svg.selected)
        .map((svg) => parseInt(svg.tokenId))
      console.log([mintCount, tokens])
      const txCall = contract.methods.mint(tokens)
      const ethAmount = context.library.utils.toWei(MINT_COST, 'ether')
      const value = mintCount * ethAmount

      const [from, to, data] = [address, SYNC_CONTRACT, txCall.encodeABI()]
      console.log('why')
      // const gasEstimate = await context.library.eth.estimateGas({
      //   value,
      //   from,
      //   data,
      //   to,
      // })
      // console.log('wh2y')
      // The BUFFOOOOOR
      //const gas = gasEstimate * 1.1
      const gas = 500000

      const tx = {
        value,
        from,
        data,
        gas,
        to,
      }
      txToast = toast.loading('Transaction processing')
      const tx2 = await context.library.eth
        .sendTransaction(tx, address)
        .catch(() => {
          toast.error('Transaction failed!', {
            id: txToast,
          })
          setSubmitting(undefined)
        })
      console.log(tx2)
      if (!tx2?.transactionHash) {
        toast.error('Transaction failed!', {
          id: txToast,
        })
        setSubmitting(undefined)
      } else {
        toast.success('Transaction successful!', {
          id: txToast,
        })
        return Router.push(`/display?mintCount=${mintCount}`)
      }
    } catch (ex) {
      console.log(ex)
      setSubmitting(undefined)
      if (txToast) {
        toast.error('Transaction failed!', {
          id: txToast,
        })
      }
    }
  }

  async function fetchSync(contract, tokenID) {
    const svgElement = await contract.methods
      .getTokenSVG(context.library.eth.abi.encodeParameter('uint256', tokenID))
      .call()
    return svgElement
  }

  async function remintSync() {
    setSubmitting('sync')
    let txToast
    try {
      const contract = new context.library.eth.Contract(
        SyncXColors.abi,
        SYNC_CONTRACT
      )

      const tokens = svgs
        .filter((svg) => svg.selected)
        .map((svg) => parseInt(svg.tokenId))
      const txCall = contract.methods.updateColors(props.tokenID, tokens)

      const [from, to, data] = [address, SYNC_CONTRACT, txCall.encodeABI()]

      const gasEstimate = await context.library.eth.estimateGas({
        from,
        data,
        to,
      })

      // The BUFFOOOOOR
      const gas = gasEstimate * 1.1
      const ethAmount = context.library.toWei(COLOR_COST, 'ether')
      const value = mintCount * ethAmount

      const tx = {
        value,
        from,
        data,
        gas,
        to,
      }

      txToast = toast.loading('Transaction processing')
      const tx2 = await context.library.eth
        .sendTransaction(tx, address)
        .catch(() => {
          toast.error('Transaction failed!', {
            id: txToast,
          })
          setSubmitting(undefined)
        })
      console.log(tx2)
      if (!tx2?.transactionHash) {
        toast.error('Transaction failed!', {
          id: txToast,
        })
        setSubmitting(undefined)
      } else {
        toast.success('Transaction successful!', {
          id: txToast,
        })
        return Router.push(`/display?tokenID=${props.tokenID}`)
      }
    } catch (ex) {
      console.log(ex)
      setSubmitting(undefined)
      if (txToast) {
        toast.error('Transaction failed!', {
          id: txToast,
        })
      }
    }
  }

  function selectColor(svg) {
    if (svg.selected) {
      delete svg.selected
      setMintColors('unselect-' + svg.tokenId)
      return
    }

    if (svgs.filter((x) => x.selected).length === MAX_COLORS) {
      toast.error('Max number of colors selected!')
      return
    }

    svg.selected = 1

    setMintColors(svg.tokenId)
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
    if (count === MAX_MINT_COUNT) return

    setMintCount(count)
  }

  function getMintText(loading) {
    if (loading) return 'Processing'

    if (tokenID) {
      return 'Color ∞ Sync!'
    } else {
      return 'MINT!'
    }
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
        <div className={styles.modal}>
          {colorsOwned > 0 && (
            <div className={'mb-10'}>
              <p
                className={
                  'text-center mb-1 text-xl font-bold title-font sm:text-4xl text-3xl mb-4 font-black text-gray-900 pt-0 mt-0 uppercase'
                }
              >
                Select Your Color Primitives
              </p>
              <p className={'text-center mb-3 font-late-500 text-xs'}>
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
                        'border-solid border-gray-800  border-4 color shadow-lg ' +
                        (svg.selected ? styles.colorActive : ' border-white')
                      }
                      style={{
                        width: 75,
                        height: 75,
                        background: svg.color,
                        cursor: 'pointer',
                        margin: 5,
                      }}
                    ></div>
                  ))}
                {!svgs.length && <Loader />}
              </div>
            </div>
          )}
          {colorsOwned === 0 && (
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
          {tokenID && (
            <div className={'mt-10 mb-10'}>
              <p
                className={
                  'text-center mb-1 text-xl font-bold title-font sm:text-4xl text-3xl mb-4 font-black text-gray-900 pt-0 mt-0 uppercase'
                }
              >
                Sync X Color
              </p>
              <div className={'flex colors justify-center content-center'}>
                {!sync && <Loader />}
                {sync && (
                  <div
                    className={styles.sync}
                    dangerouslySetInnerHTML={{ __html: sync }}
                  ></div>
                )}
              </div>
            </div>
          )}
          {!tokenID && (
            <div className={'flex mb-10 content-center justify-center'}>
              <div
                className={
                  'flex content-center justify-center custom-number-input rounded-lg h-10 w-32'
                }
              >
                <div
                  className={
                    'flex flex-row h-10 w-full rounded-lg relative bg-transparent'
                  }
                >
                  <button
                    onClick={() => mintCountIncrement('decrement')}
                    data-action="decrement"
                    className={
                      'bg-white border-r border-slate-500 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none'
                    }
                  >
                    <span className={'m-auto text-2xl font-thin'}>−</span>
                  </button>
                  <input
                    min="1"
                    max={MAX_MINT_COUNT}
                    type="text"
                    className={
                      'outline-none focus:outline-none text-center w-full  font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700  outline-none'
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
                      'bg-white border-l border-l-slate-500 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer'
                    }
                  >
                    <span className={'m-auto text-2xl font-thin'}>+</span>
                  </button>
                </div>
              </div>
            </div>
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

          {!tokenID && (
            <div className={'text-center justify-center'}>
              <p className={'uppercase text-2xl font-bold'}>
                {amountMinted?.toLocaleString()} / {MAX_SUPPLY.toLocaleString()}
              </p>
            </div>
          )}
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
