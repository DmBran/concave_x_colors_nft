import process from 'process'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useWeb3Context } from 'web3-react'
import AirNFT from '../artifacts/AirNFT.json'
import { getHexColor } from '../helpers/colors'
import { sendTx } from '../helpers/send-tx'
import { EthIcon } from './eth-icon'
import { Loader } from './loader'

export const Balances = (props) => {
  const context = useWeb3Context()

  const NETWORK = Number(process.env.NEXT_PUBLIC_NETWORK)
  const COLORS_CONTRACT = process.env.NEXT_PUBLIC_COLORS_CONTRACT
  const AIR_CONTRACT = process.env.NEXT_PUBLIC_AIR_CONTRACT
  const MAX_RENTAL = '10'
  const DEFAULT_RENTAL = '0.005'

  const [svgs, setSvgs] = useState([])
  const [claimable, setClaimable] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [minRental, setMinRental] = useState('0.003')

  useEffect(async () => {
    if (context.active && context.networkId === NETWORK) {
      await updateMinRental()
      await fetchedStakedTokens()

      await fetchBalance(context.account)
    }
  }, [context])

  function colorsSelected() {
    return svgs.filter((svg) => svg.selected).length
  }

  function feesChanged() {
    return svgs.filter((svg) => {
      return svg.updatedRentalCost && svg.rentalCost !== svg.updatedRentalCost
        ? true
        : false
    })
  }
  function feesUpdated() {
    const delta = feesChanged()
    console.log(delta.length)
    return delta.length
  }

  function isClaiming() {
    return svgs.filter((svg) => svg.claiming).length > 0
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

  async function claim(svg) {
    const tokenID = svg.tokenId
    svg.claiming = 1
    setSubmitting(tokenID)

    const airContract = new context.library.eth.Contract(
      AirNFT.abi,
      AIR_CONTRACT
    )

    const txCall = await airContract.methods.claim(COLORS_CONTRACT, [tokenID])

    const tx = await sendTx(context.library, {
      data: txCall.encodeABI(),
      to: AIR_CONTRACT,
      cost: '0',
      count: 1,
      from: context.account,
    })

    setSubmitting(false)
    delete svg.claiming
    if (!tx?.transactionHash) {
      setSvgs([...svgs])
      return
    }

    setClaimable(undefined)

    svgs.map((svg) => {
      if (svg.tokenId === tokenID) {
        svg.accruals = 0
        if (svg.selected) selectColor(svg)
      }
      return svg
    })
    setSvgs([...svgs])
    await fetchBalance(context.account)
  }

  async function updateRentalFees() {
    const airContract = new context.library.eth.Contract(
      AirNFT.abi,
      AIR_CONTRACT
    )
    setSubmitting('fees')
    const delta = feesChanged()
    if (!delta.length) {
      setSubmitting(false)
      toast.error('No rental fees changed')
      return
    }
    console.log([
      delta.map((svg) => {
        return parseInt(svg.tokenId)
      }),
      delta.map((svg) => {
        return context.library.utils.toWei(svg.updatedRentalCost, 'ether')
      }),
    ])
    const txCall = await airContract.methods.updateRentalFees(
      COLORS_CONTRACT,
      delta.map((svg) => {
        return parseInt(svg.tokenId)
      }),
      delta.map((svg) => {
        return context.library.utils.toWei(svg.updatedRentalCost, 'ether')
      })
    )

    const tx = await sendTx(context.library, {
      data: txCall.encodeABI(),
      to: AIR_CONTRACT,
      cost: '0',
      count: 1,
      from: context.account,
    })

    setSubmitting(false)

    if (!tx?.transactionHash) return

    delta.map((svg) => {
      svg.rentalCost = svg.updatedRentalCost
    })

    setSvgs([...svgs])
  }

  function checkRentalCost(svg) {
    const value = svg.updatedRentalCost
    if (!value) return
    if (isNaN(Number(value))) {
      svg.updatedRentalCost = DEFAULT_RENTAL
      setSvgs([...svgs])
      return toast.error('Valid rental fee required')
    }
    if (/\.\d\d\d\d\d/.test(value)) {
      svg.updatedRentalCost = DEFAULT_RENTAL
      setSvgs([...svgs])
      return toast.error('Max precision reached')
    }
    const wei = context.library.utils.toBN(
      context.library.utils.toWei(value.toString(), 'ether')
    )
    const minWei = context.library.utils.toBN(
      context.library.utils.toWei(minRental, 'ether')
    )
    const maxWei = context.library.utils.toBN(
      context.library.utils.toWei(MAX_RENTAL, 'ether')
    )
    if (wei.lt(minWei)) {
      svg.updatedRentalCost = DEFAULT_RENTAL
      setSvgs([...svgs])
      return toast.error('Minimum rental fee is 0.003 ETH')
    }
    if (wei.gt(maxWei)) {
      svg.updatedRentalCost = DEFAULT_RENTAL
      setSvgs([...svgs])
      return toast.error('Maximum rental fee is 10 ETH')
    }
    return
  }

  async function claimAll() {
    if (claimable == 0) {
      return toast.error('Nothing to claim!')
    }

    setSubmitting('all')

    const airContract = new context.library.eth.Contract(
      AirNFT.abi,
      AIR_CONTRACT
    )

    const txCall = await airContract.methods.claimAllContract(COLORS_CONTRACT)

    const tx = await sendTx(context.library, {
      data: txCall.encodeABI(),
      to: AIR_CONTRACT,
      cost: '0',
      from: context.account,
      count: 1,
    })

    setSubmitting(false)

    if (!tx?.transactionHash) return

    setClaimable(0)
    svgs.map((x) => {
      x.accruals = 0
      return x
    })
    setSvgs([...svgs])
  }

  async function updateMinRental() {
    const contract = new context.library.eth.Contract(AirNFT.abi, AIR_CONTRACT)
    const min = await contract.methods.minimumFlashFee(COLORS_CONTRACT).call()

    const toEth = context.library.utils.fromWei(min, 'ether')
    console.log(toEth)
    setMinRental(toEth)
  }

  async function fetchBalance(address) {
    const airContract = new context.library.eth.Contract(
      AirNFT.abi,
      AIR_CONTRACT
    )

    const claimable = await airContract.methods.getAccruals(address).call()
    const formattedClaimable = context.library.utils.fromWei(
      claimable.toString(),
      'ether'
    )
    setClaimable(formattedClaimable)
    return claimable
  }

  async function fetchedStakedTokens() {
    const svgs = []

    const airContract = new context.library.eth.Contract(
      AirNFT.abi,
      AIR_CONTRACT
    )

    const stakedTokens = await airContract.methods
      .getStakedByAddress(COLORS_CONTRACT, context.account)
      .call()

    console.log(stakedTokens)

    if (!stakedTokens.length) {
      setLoaded(true)
      return
    }

    for (let i = 0; i < stakedTokens.length; ++i) {
      const tokenId = stakedTokens[i]
      const color = await getHexColor(tokenId, context)
      svgs.push({
        tokenId,
        color,
      })
    }

    setSvgs(svgs)
    setLoaded(true)

    await fetchStatistics(svgs)
  }

  function getSelectedColors() {
    return svgs
      .filter((svg) => svg.selected)
      .map((svg) => parseInt(svg.tokenId))
  }

  async function unstake(claimRoyalties) {
    if (colorsSelected() === 0) {
      toast.error('No colors selected')
      return
    }

    setSubmitting('unstake')

    const tokens = getSelectedColors()
    console.log(tokens)
    const rentalContract = new context.library.eth.Contract(
      AirNFT.abi,
      AIR_CONTRACT
    )

    const txCall = rentalContract.methods.removeStaked(
      COLORS_CONTRACT,
      tokens,
      claimRoyalties ? true : false
    )

    const tx = await sendTx(context.library, {
      data: txCall.encodeABI(),
      to: AIR_CONTRACT,
      cost: '0',
      from: context.account,
      count: 1,
    })

    setSubmitting(undefined)

    if (!tx?.transactionHash) return

    if (!tx?.transactionHash) return

    setClaimable(undefined)

    const newSvgs = svgs
      .map((svg) => {
        if (tokens.includes(parseInt(svg.tokenId))) {
          svg.accruals = 0
          selectColor(svg)
        }
        return svg
      })
      .filter((svg) => {
        return !tokens.includes(parseInt(svg.tokenId))
      })

    setSvgs(newSvgs)
    await fetchBalance(context.account)

    return
  }

  // function feesChanged() {
  //   const delta = svgs.filter(svg => {
  //     return svg.updateRentalFees ? true : false
  //   })
  //   console.log(delta.length > 0)
  //   return delta.length > 0;
  // }

  async function fetchStatistics(svgs) {
    const airContract = new context.library.eth.Contract(
      AirNFT.abi,
      AIR_CONTRACT
    )

    const nftStats = await airContract.methods
      .stakedNFTData(
        COLORS_CONTRACT,
        svgs.map((svg) => {
          return Number(svg.tokenId)
        })
      )
      .call()

    for (let i = 0; i < svgs.length; ++i) {
      const svg = svgs[i]
      const stats = nftStats[i]

      svg.accruals = context.library.utils.fromWei(
        stats.accruals.toString(),
        'ether'
      )

      svg.rentalCost = context.library.utils.fromWei(
        stats.rentalFee.toString(),
        'ether'
      )

      svg.royalties = context.library.utils.fromWei(
        (stats.allTimeAccruals ?? 0).toString(),
        'ether'
      )

      svg.rentals = stats.allTimeLends
    }

    setSvgs([...svgs])
  }

  function sorter(a, b) {
    return Number(a.tokenId) - Number(b.tokenId)
    //return Number(b.accruals) - Number(a.accruals)
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
        <div className={'w-full mx-auto lg:w-5/6 rounded pb-10 px-2 lg:px-0'}>
          <div className={'mb-10 '}>
            <p
              className={
                'text-center mb-10 text-xl font-bold title-font sm:text-4xl text-3xl mb-4 font-black text-gray-900 pt-0 mt-0 uppercase'
              }
            >
              CURRENT ROYALTIES
            </p>

            <p
              className={`text-center mb-10 font-bold text-4xl title-font mb-4 font-black text-gray-900 pt-0 mt-0 uppercase`}
            >
              {typeof claimable !== 'undefined' ? claimable : '--'}{' '}
              <span
                style={{ top: '2px' }}
                className={'inline-block align-top relative'}
              >
                <EthIcon width={20} />
              </span>
              <button
                onClick={
                  submitting || isClaiming() ? () => {} : () => claimAll()
                }
                className={`align-top text-sm mx-5  text-white font-bold py-2 px-4 rounded ${
                  claimable &&
                  claimable > 0 &&
                  (!submitting || submitting === 'all') &&
                  !isClaiming()
                    ? 'bg-blue-700 hover:bg-green-700'
                    : 'bg-gray-500 bg-opacity-50'
                }`}
              >
                {submitting === 'all' ? 'Claiming...' : 'Claim All Royalties'}
              </button>
            </p>
            <div
              className={
                'flex w-full content-center justify-center mt-20 mb-10'
              }
            >
              {loaded && (
                <div className={' w-full text-center'}>
                  <button
                    onClick={
                      submitting || isClaiming()
                        ? () => {}
                        : () => unstake(true)
                    }
                    className={`w-2/3 mx-5 text-white font-bold py-2 px-4 rounded ${
                      colorsSelected() === 0 ||
                      (submitting && submitting !== 'unstake') ||
                      isClaiming()
                        ? 'opacity-60 bg-gray-500'
                        : 'bg-green-700 hover:bg-blue-700'
                    }`}
                  >
                    {submitting === 'unstake'
                      ? 'Submitting...'
                      : claimable > 0
                      ? 'Unstake and Claim Selected Royalties'
                      : 'Unstake Tokens'}
                  </button>
                </div>
              )}
              {loaded && (
                <div className={' w-full text-center '}>
                  <button
                    onClick={
                      submitting || isClaiming()
                        ? () => {}
                        : () => updateRentalFees()
                    }
                    className={`w-2/3 mx-5 text-white font-bold py-2 px-4 rounded ${
                      feesUpdated() === 0 ||
                      (submitting && submitting !== 'fees') ||
                      isClaiming()
                        ? 'opacity-60 bg-gray-500'
                        : 'bg-blue-700 hover:bg-green-700'
                    }`}
                  >
                    {submitting === 'fees'
                      ? 'Submitting...'
                      : 'Update Rental Fees'}
                  </button>
                </div>
              )}
            </div>
            <div
              className={'colors justify-center flex flex-wrap content-center'}
            >
              {loaded &&
                svgs &&
                svgs.sort(sorter).map((svg) => (
                  <div
                    onClick={() => selectColor(svg)}
                    className={
                      ' mx-5 px-4 py-4  mb-7 border-solid border-2 ' +
                      (svg.selected == 1
                        ? `border-blue-700 border-4`
                        : 'border-slate-600')
                    }
                    key={svg.color}
                  >
                    <div
                      className={
                        'border-solid mb-2 border-4 border-gray-800 opacity-85  color shadow-lg'
                      }
                      style={{
                        width: 150,
                        height: 150,
                        background: svg.color,
                        cursor: 'pointer',
                      }}
                    ></div>
                    {
                      <div
                        className={
                          'items-center justify-center justify-content'
                        }
                      >
                        <div className={'stat flex flex-row'}>
                          <p className={'w-1/2 font-bold justify-self-start'}>
                            Token ID:
                          </p>
                          <p
                            className={
                              'w-1/2 align-right text-right font-bold justify-self-end'
                            }
                          >
                            {svg.tokenId}
                          </p>
                        </div>
                        <div className={'stat flex flex-row'}>
                          <p className={'w-1/2 font-bold justify-self-start'}>
                            Color:
                          </p>
                          <p
                            className={
                              'w-1/2 align-right text-right font-bold justify-self-end'
                            }
                          >
                            {svg.color.toUpperCase()}
                          </p>
                        </div>

                        <div className={'stat flex flex-row pb-2'}>
                          <p className={'w-1/2 font-bold justify-self-start'}>
                            Fee:
                          </p>
                          <p
                            className={
                              'ml-auto align-right text-right font-bold justify-self-end'
                            }
                          >
                            <label
                              className={
                                ' ml-auto w-full justify-self-end rounded flex text-center center-text '
                              }
                            >
                              <input
                                onClick={(e) => {
                                  e.stopPropagation()
                                }}
                                onChange={(e) => {
                                  console.log(e.target.value)
                                  svg.updatedRentalCost = e.target.value
                                  setSvgs([...svgs])
                                }}
                                onBlur={(e) => {
                                  checkRentalCost(svg)
                                }}
                                type="text"
                                style={{
                                  width: '75px',
                                }}
                                className={
                                  'text-right inline-block py-1 pl-2 underline appearance-none text-black'
                                }
                                value={svg.updatedRentalCost ?? svg.rentalCost}
                              />
                              <span
                                style={{ top: '10px' }}
                                className={'ml-1 relative inline-block'}
                              >
                                <EthIcon width={8} />
                              </span>
                            </label>
                          </p>
                        </div>

                        {/* {!svg.showRentalFee && <div className={'stat flex flex-row'}>
                          <p
                            onClick={() => {
                              svg.showRentalFee = !svg.showRentalFee
                              setSvgs([...svgs])
                            }}
                            className={
                              'w-full text-xs align-right -mt-1  text-right text-blue-500 justify-self-end'
                            }
                          >
                            update fee
                          </p>
                        </div> }

                        <div className={'stat flex flex-row'}>
                        { svg.showRentalFee && 
                    <>  <label
                        className={
                          'w-5/6 justify-self-start rounded flex text-center center-text border-2 border-slate-200 '
                        }
                      >
                        {svg.fee}{' '}
                        <input
                          onChange={(e) => {
                            console.log(e.target.value)
                            svg.updatedRentalCost = e.target.value
                            setSvgs([...svgs])
                          }}
                          onBlur={(e) => {
                            checkRentalCost(svg)
                          }}
                          style={{
                            width: '100px'
                          }}
                          type="text"
                          className={
                            'inline-block py-1 pl-2 appearance-none text-black  '
                          }
                          value={svg.updatedRentalCost ?? svg.rentalCost}
                        />
                        <span
                          style={{ top: '7px' }}
                          className={'relative inline-block'}
                        >
                          <EthIcon width={10} />
                        </span>

                      </label>
                      <button
                          onClick={submitting ? () => {} : async () => {
                            const error = checkRentalCost(svg)
                            if (!error) await updateFee(svg)
                          }}
                          className={`w-1/6 text-center hover:bg-green-700 text-white font-bold px-4 rounded bg-blue-700`}
                        >
                          &raquo;
                        </button></>
                    }
                        </div>

                        { svg.showRentalFee &&  <p
                            onClick={() => {
                              svg.showRentalFee = !svg.showRentalFee
                              setSvgs([...svgs])
                            }}
                            className={
                              'w-full text-xs align-right mt-2 text-right text-blue-500 justify-self-end'
                            }
                          >
                            hide form
                          </p> } */}

                        <div
                          className={
                            'stat flex flex-row  border-t border-slate-200 pt-3'
                          }
                        >
                          <p className={'w-1/2 font-bold justify-self-start'}>
                            Rentals:
                          </p>
                          <p
                            className={
                              'w-1/2 align-right text-right font-bold justify-self-end'
                            }
                          >
                            {svg.rentals ?? 0}
                          </p>
                        </div>

                        <div className={' stat flex flex-row'}>
                          <p className={'w-1/2 font-bold justify-self-start'}>
                            Claimable:
                          </p>
                          <p
                            className={
                              'w-1/2 align-right text-right font-bold justify-self-end'
                            }
                          >
                            <span
                              style={{ top: '4px', right: '3px' }}
                              className={'ml-2 inline-block align-top relative'}
                            >
                              <EthIcon width={9} />
                            </span>
                            {svg.accruals}
                          </p>
                        </div>

                        <div className={'stat flex flex-row'}>
                          <p className={'w-1/2 font-bold justify-self-start'}>
                            Total:
                          </p>
                          <p
                            className={
                              'w-1/2 align-right text-right font-bold justify-self-end'
                            }
                          >
                            <span
                              style={{ top: '4px', right: '3px' }}
                              className={'ml-2 inline-block align-top relative'}
                            >
                              <EthIcon width={9} />
                            </span>
                            {svg.royalties}
                          </p>
                        </div>
                        <div className={'stat'}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              claim(svg)
                            }}
                            className={` text-sm w-full mt-2 text-white font-bold py-2 px-4 rounded ${
                              svg.accruals > 0
                                ? 'bg-blue-700 hover:bg-green-700'
                                : 'bg-gray-500 bg-opacity-50'
                            }`}
                          >
                            {svg.claiming ? 'Claiming...' : 'Claim Royalty'}
                          </button>
                        </div>
                      </div>
                    }
                  </div>
                ))}

              {!loaded && (
                <div className={'mt-5'}>
                  <Loader />
                </div>
              )}
              {loaded && !svgs.length && (
                <div>
                  <p
                    className={'text-red-500 font-bold mb-10 uppercase text-lg'}
                  >
                    No staked colors
                  </p>
                </div>
              )}
            </div>
          </div>
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
