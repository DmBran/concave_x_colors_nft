import process from 'process'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useWeb3Context } from 'web3-react'
import AirNFT from '../artifacts/AirNFT.json'
import TheColors from '../artifacts/TheColors.json'
import { getHexColor } from '../helpers/colors'
import { sendTx } from '../helpers/send-tx'
import styles from '../styles/meme.module.css'
import { EthIcon } from './eth-icon'
import { Loader } from './loader'

export const Staker = (props) => {
  const context = useWeb3Context()

  const NETWORK = Number(process.env.NEXT_PUBLIC_NETWORK)
  const COLORS_CONTRACT = process.env.NEXT_PUBLIC_COLORS_CONTRACT
  const AIR_CONTRACT = process.env.NEXT_PUBLIC_AIR_CONTRACT

  const DEFAULT_RENTAL = '0.005'
  const MAX_RENTAL = '10'

  const [svgs, setSvgs] = useState([])
  const [colorsLoaded, setColorsLoaded] = useState(false)
  const [approved, setApproved] = useState(false)
  const [address, setAddress] = useState(null)
  const [minRental, setMinRental] = useState('0.003')
  const [submitting, setSubmitting] = useState(false)

  useEffect(async () => {
    if (context.active && context.networkId === NETWORK) {
      setAddress(context.account)

      await updateMinRental()
      await updateColorList()

      const contract = new context.library.eth.Contract(
        TheColors.abi,
        COLORS_CONTRACT
      )

      const isApproved = await contract.methods
        .isApprovedForAll(context.account, AIR_CONTRACT)
        .call()
      console.log(`is approved ${isApproved}`)
      setApproved(isApproved)
    }
  }, [context])

  async function updateMinRental() {
    const contract = new context.library.eth.Contract(AirNFT.abi, AIR_CONTRACT)
    const min = await contract.methods.minimumFlashFee(COLORS_CONTRACT).call()

    const toEth = context.library.utils.fromWei(min, 'ether')
    console.log(toEth)
    setMinRental(toEth)
  }

  async function updateColorList() {
    const svgs = []

    const contract = new context.library.eth.Contract(AirNFT.abi, AIR_CONTRACT)
    const colors = await contract.methods
      .getOwnedERC721ByAddress(COLORS_CONTRACT, context.account)
      .call()
    const colorsCount = colors.length
    if (!colorsCount) {
      setColorsLoaded(true)
      return
    }

    for (let i = 0; i < colorsCount; ++i) {
      const tokenId = colors[i]
      const color = await getHexColor(colors[i], context)
      const rentalCost = DEFAULT_RENTAL
      svgs.push({
        rentalCost,
        tokenId,
        color,
      })
    }

    setSvgs(svgs)
    setColorsLoaded(true)
  }

  function updateRentalCost(svg, value) {
    svg.rentalCost = value
    setSvgs([...svgs])
  }

  async function approve() {
    setSubmitting('approving')

    const contract = new context.library.eth.Contract(
      TheColors.abi,
      COLORS_CONTRACT
    )

    const txCall = contract.methods.setApprovalForAll(AIR_CONTRACT, true)

    const tx = await sendTx(context.library, {
      data: txCall.encodeABI(),
      to: COLORS_CONTRACT,
      cost: '0',
      from: address,
      count: 1,
    })
    console.log(tx)
    if (tx?.transactionHash) setApproved(true)

    setSubmitting(undefined)

    return
  }

  function canStake() {
    return colorsSelected() > 0 && approved
  }

  async function stake() {
    if (!canStake()) return

    const tokens = svgs
      .filter((svg) => svg.selected)
      .map((svg) => parseInt(svg.tokenId))

    if (!tokens.length) return toast.error('No colors selected')

    setSubmitting(true)

    const contract = new context.library.eth.Contract(AirNFT.abi, AIR_CONTRACT)

    const costs = svgs
      .filter((svg) => tokens.includes(parseInt(svg.tokenId)))
      .map((svg) => context.library.utils.toWei(svg.rentalCost, 'ether'))
    console.log([tokens, costs])
    const txCall = contract.methods.addStaked(COLORS_CONTRACT, tokens, costs)

    const tx = await sendTx(context.library, {
      data: txCall.encodeABI(),
      to: AIR_CONTRACT,
      cost: '0',
      from: address,
      count: 1,
    })

    setSubmitting(false)

    if (!tx?.transactionHash) return
    const newSvgs = svgs
      .filter((svg) => {
        return !tokens.includes(parseInt(svg.tokenId))
      })
      .map((svg) => {
        if (tokens.includes(parseInt(svg.tokenId))) {
          selectColor(svg)
        }
        return svg
      })

    setSvgs(newSvgs)

    return
  }

  function selectColor(svg) {
    if (svg.selected) {
      delete svg.selected
      setSvgs([...svgs])
      return
    }

    svg.selected = 1

    setSvgs([...svgs])
  }

  function colorsSelected() {
    return svgs.filter((svg) => svg.selected).length
  }

  function checkRentalCost(svg, value) {
    if (isNaN(Number(value))) {
      svg.rentalCost = DEFAULT_RENTAL
      setSvgs([...svgs])
      return toast.error('Valid rental fee required')
    }
    if (/\.\d\d\d\d\d/.test(value)) {
      svg.rentalCost = DEFAULT_RENTAL
      setSvgs([...svgs])
      return toast.error('Max precision reached')
    }
    const wei = context.library.utils.toBN(
      context.library.utils.toWei(value, 'ether')
    )
    const minWei = context.library.utils.toBN(
      context.library.utils.toWei(minRental, 'ether')
    )
    const maxWei = context.library.utils.toBN(
      context.library.utils.toWei(MAX_RENTAL, 'ether')
    )
    if (wei.lt(minWei)) {
      svg.rentalCost = DEFAULT_RENTAL
      setSvgs([...svgs])
      return toast.error('Minimum rental fee is 0.003 ETH')
    }
    if (wei.gt(maxWei)) {
      svg.rentalCost = DEFAULT_RENTAL
      setSvgs([...svgs])
      return toast.error('Maximum rental fee is 10 ETH')
    }
    return
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
          <div className={'mb-10 '}>
            <p
              className={
                'text-center mb-1 text-xl font-bold title-font sm:text-4xl text-3xl mb-2 font-black text-gray-900 pt-0 mt-0 uppercase'
              }
            >
              Select Colors to Stake
            </p>
            <p className={'text-black text-center mb-10 font-late-500 text-md'}>
              enter desired rental fee per lend under token
            </p>
            <div
              className={'flex flex-wrap colors justify-center content-center'}
            >
              {colorsLoaded &&
                svgs &&
                svgs.map((svg) => (
                  <div className="mx-4" key={svg.color}>
                    <div
                      onClick={() => selectColor(svg)}
                      className={
                        'border-solid border-4 border-gray-800 opacity-85  color shadow-lg ' +
                        (svg.selected == 1
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
                    {
                      <label
                        className={
                          'justify-center rounded flex text-center center-text border-2 border-slate-200 '
                        }
                      >
                        {svg.fee}{' '}
                        <input
                          onChange={(e) => {
                            updateRentalCost(svg, e.target.value)
                          }}
                          onBlur={(e) => {
                            checkRentalCost(svg, e.target.value)
                          }}
                          type="text"
                          style={{ width: '65px' }}
                          className={
                            'inline-block py-1 pl-2 appearance-none text-black  '
                          }
                          value={svg.rentalCost}
                        />
                        <span
                          style={{ top: '7px' }}
                          className={'relative inline-block'}
                        >
                          <EthIcon width={10} />
                        </span>
                      </label>
                    }
                  </div>
                ))}
              {!colorsLoaded && <Loader />}
              {colorsLoaded && !svgs.length && (
                <div>
                  <p className={'text-red-500 uppercase font-bold'}>
                    No colors available to stake
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* <div className={'mb-10'}>
            <p
              className={
                'text-center mb-1 text-xl font-bold title-font sm:text-4xl text-3xl mb-4 font-black text-gray-900 pt-0 mt-0 uppercase'
              }
            >
              {' '}
              <label>Enter Royalty Fee Per Mint</label>
            </p>
            <div className={'flex justify-center'}>
              <input
                type="text"
                name="rental-cost"
                className={'ring-1 ring-offset-20 ring-black p-2 text-center'}
                onChange={(e) => {
                  setRentalCost(e.target.value)
                }}
                value={rentalCost ?? 1}
              />
              <span className={'ml-5 text-xl block'}>
                <EthIcon width={25} />
              </span>
            </div>
          </div> */}
          {approved && svgs && svgs.length > 0 && (
            <div className={'content-center justify-center flex mb-10'}>
              <button
                onClick={submitting ? () => {} : stake}
                className={`mx-5 hover:bg-green-700 text-white font-bold py-2 px-4 rounded bg-blue-700 ${
                  canStake() || submitting ? '' : 'opacity-50'
                }`}
              >
                {submitting ? 'Staking...' : 'Stake Colors'}
              </button>
            </div>
          )}

          {!approved && svgs && svgs.length > 0 && (
            <div className={'content-center justify-center flex mb-10'}>
              <button
                onClick={submitting ? () => {} : approve}
                className={`bg-blue-700 mx-5 hover:bg-green-700 text-white font-bold py-2 px-4 rounded`}
              >
                {submitting ? 'Approving...' : 'Approve All Colors'}
              </button>
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
