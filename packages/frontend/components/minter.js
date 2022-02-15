import { Switch } from '@headlessui/react'
import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useWeb3Context } from 'web3-react'
import AirNFT from '../artifacts/AirNFT.json'
import SyncXColors from '../artifacts/SyncXColors.json'
import { getHexColor, hexToRgb, rgbToHsl } from '../helpers/colors'
import { decodeToken } from '../helpers/decode-token'
import { sendTx } from '../helpers/send-tx'
import styles from '../styles/meme.module.css'
import { EthIcon } from './eth-icon'
import { Loader } from './loader'

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
  const AIR_CONTRACT = process.env.NEXT_PUBLIC_AIR_CONTRACT
  const SLIDER_MAX = 1000000000000000000

  const [svgs, setSvgs] = useState([])
  const [sync, setSync] = useState(null)
  const [amountMinted, setAmountMinted] = useState(null)
  const [mintCount, setMintCount] = useState(1)
  const [tokenID, setTokenID] = useState(null)
  const [address, setAddress] = useState(null)
  const [submitting, setSubmitting] = useState(null)
  const [colorsOwned, setColorsOwned] = useState(null)
  const [renting, setRenting] = useState(true)
  const [svgsLoaded, setSvgsLoaded] = useState(false)
  const [rentableColors, setRentableColors] = useState(null)
  const [rentalFee, setRentalFee] = useState(0)
  const [searchColor, setSearchColor] = useState(null)
  const [rentalRange, setRentalRange] = useState(SLIDER_MAX)
  const [hue, setHue] = useState(false)
  const [minRental, setMinRetal] = useState('0.003')
  const [approved, setApproved] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [ownedColors, setOwnedColors] = useState(false)
  useEffect(async () => {
    console.log('RENTING UPDATE')
    setSvgsLoaded(false)

    if (context.active && context.networkId === NETWORK) {
      const airContract = new context.library.eth.Contract(
        AirNFT.abi,
        AIR_CONTRACT
      )

      if (renting) {
        const stakedTokens = await airContract.methods
          .getStakedByAddress(COLORS_CONTRACT, context.account)
          .call()
        console.log(stakedTokens)
        setOwnedColors(stakedTokens)
      }

      const syncContract = new context.library.eth.Contract(
        SyncXColors.abi,
        SYNC_CONTRACT
      )

      const minted = await syncContract.methods.totalSupply().call()
      setAmountMinted(minted)

      if (props.tokenID) {
        const id = parseInt(props.tokenID)
        const owner = await syncContract.methods
          .ownerOf(props.tokenID)
          .call()
          .catch((x) => {
            console.log('Token does not exist')
          })

        if (owner === context.account) {
          setTokenID(id.toString())
          const svg = await fetchSync(syncContract, id)
          setSync(svg)
        } else {
          toast.error('Invalid Token Owner!')
          return Router.push(`/`)
        }

        if (renting) {
          await checkTokenApproval(props.tokenID, syncContract)
        }
      } else {
        setTokenID(undefined)
        setSync(undefined)
      }

      setAddress(context.account)

      if (renting) {
        await fetchRentableTokens()
      } else {
        console.log('update')
        await updateColorList()
      }
    }
  }, [context, renting])

  async function checkTokenApproval(id, contract) {
    const allApproved = await contract.methods
      .isApprovedForAll(context.account, AIR_CONTRACT)
      .call()
    if (allApproved) return setApproved(allApproved)

    const isApproved = await contract.methods.getApproved(id).call()
    setApproved(isApproved === AIR_CONTRACT)
  }

  async function calculateRentalFee() {
    const airContract = new context.library.eth.Contract(
      AirNFT.abi,
      AIR_CONTRACT
    )

    const rentalFee = await airContract.methods
      .getRentalCost(COLORS_CONTRACT, getSelectedColors())
      .call()

    const eth = context.library.utils.fromWei(rentalFee, 'ether')
    setRentalFee(eth)
    return eth
  }

  async function fetchSync(contract, tokenID) {
    const tokenURI = await contract.methods
      .tokenURI(context.library.eth.abi.encodeParameter('uint256', tokenID))
      .call()
    const token = decodeToken(tokenURI)
    return token
  }

  async function fetchRentableTokens() {
    const svgs = []

    setSvgsLoaded(false)

    const airContract = new context.library.eth.Contract(
      AirNFT.abi,
      AIR_CONTRACT
    )

    const stakedTokens = await airContract.methods
      .getStaked(COLORS_CONTRACT)
      .call()

    setRentableColors(stakedTokens.length)
    if (!stakedTokens.length) {
      setSvgsLoaded(true)
      return
    }

    const rentalFees = await airContract.methods
      .stakedNFTData(COLORS_CONTRACT, stakedTokens)
      .call()

    for (let i = 0; i < stakedTokens.length; ++i) {
      const tokenId = stakedTokens[i]
      const wei = rentalFees[i].rentalFee
      const color = await getHexColor(tokenId, context)
      const fee = context.library.utils.fromWei(wei + '', 'ether')
      const rgb = hexToRgb(color)
      const hsl = rgbToHsl(rgb)
      svgs.push({
        tokenId,
        color,
        ...rgb,
        ...hsl,
        fee,
        wei,
      })
    }

    setSvgs(svgs)
    setSvgsLoaded(true)
  }

  async function approveAll() {
    setSubmitting('approvingAll')

    const syncContract = new context.library.eth.Contract(
      SyncXColors.abi,
      SYNC_CONTRACT
    )

    const txCall = syncContract.methods.setApprovalForAll(AIR_CONTRACT, true)

    const tx = await sendTx(context.library, {
      data: txCall.encodeABI(),
      to: SYNC_CONTRACT,
      cost: '0',
      from: address,
      count: 1,
    })

    if (tx?.transactionHash) setApproved(true)

    setSubmitting(undefined)

    return
  }

  async function approve(tokenID) {
    setSubmitting('approving')

    const syncContract = new context.library.eth.Contract(
      SyncXColors.abi,
      SYNC_CONTRACT
    )

    const txCall = syncContract.methods.approve(AIR_CONTRACT, tokenID)

    const tx = await sendTx(context.library, {
      data: txCall.encodeABI(),
      to: SYNC_CONTRACT,
      cost: '0',
      from: address,
      count: 1,
    })

    if (tx?.transactionHash) setApproved(true)

    setSubmitting(undefined)

    return
  }

  async function updateColorList() {
    const svgs = []

    setSvgsLoaded(false)

    const contract = new context.library.eth.Contract(AirNFT.abi, AIR_CONTRACT)
    const colors = await contract.methods
      .getOwnedERC721ByAddress(COLORS_CONTRACT, context.account)
      .call()
    setColorsOwned(colors?.length ?? 0)

    if (!colors?.length) {
      setSvgsLoaded(true)
      setSvgs([])
      return
    }

    for (let i = 0; i < colors.length; ++i) {
      const tokenId = colors[i]
      const color = await getHexColor(colors[i], context)
      svgs.push({
        tokenId,
        color,
      })
    }

    setSvgs(svgs)
    setSvgsLoaded(true)
  }

  async function mintSync() {
    setSubmitting('syncs')

    const contract = new context.library.eth.Contract(
      SyncXColors.abi,
      SYNC_CONTRACT
    )

    const tokens = svgs
      .filter((svg) => svg.selected)
      .map((svg) => parseInt(svg.tokenId))

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

  async function remintSync() {
    console.log('remint')
    setSubmitting('sync')

    const contract = new context.library.eth.Contract(
      SyncXColors.abi,
      SYNC_CONTRACT
    )

    const tokens = getSelectedColors()
    console.log([props.tokenID, tokens])
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

  function getSelectedColors() {
    return svgs
      .filter((svg) => svg.selected)
      .map((svg) => parseInt(svg.tokenId))
  }

  async function selectColor(svg) {
    if (svg.selected) {
      delete svg.selected
      if (renting) await calculateRentalFee()
      setSvgs([...svgs])
      return
    }

    if (svgs.filter((svg) => svg.selected).length === MAX_COLORS) {
      toast.error('Max number of colors selected!')
      return
    }

    svg.selected = 1

    setSvgs([...svgs])

    if (renting) await calculateRentalFee()
  }

  async function rentAndMint() {
    setSubmitting('syncs')

    const contract = new context.library.eth.Contract(AirNFT.abi, AIR_CONTRACT)
    const txCall = contract.methods.mintSyncsWithRentedTokens(
      mintCount,
      getSelectedColors()
    )
    const cost = MINT_COST
    const fee = await calculateRentalFee()
    console.log(fee)
    if (!fee) {
      toast.error('Unable to determine rental fees')
      setSubmitting(undefined)
      return
    }

    const tx = await sendTx(context.library, {
      data: txCall.encodeABI(),
      to: AIR_CONTRACT,
      count: mintCount,
      from: address,
      cost,
      fee,
    })

    setSubmitting(undefined)
    if (tx?.transactionHash)
      return Router.push(`/display?mintCount=${mintCount}`)
    return
  }

  async function rentAndColor() {
    setSubmitting('sync')

    const contract = new context.library.eth.Contract(AirNFT.abi, AIR_CONTRACT)
    console.log([[parseInt(props.tokenID)], getSelectedColors()])
    const txCall = contract.methods.updateSyncColors(
      [parseInt(props.tokenID)],
      getSelectedColors()
    )

    const cost = COLOR_COST
    const fee = rentalFee
    if (!fee) {
      toast.error('Unable to determine rental fees')
      setSubmitting(undefined)
      return
    }

    const tx = await sendTx(context.library, {
      data: txCall.encodeABI(),
      to: AIR_CONTRACT,
      from: address,
      count: 1,
      cost,
      fee,
    })

    setSubmitting(undefined)
    if (tx?.transactionHash)
      return Router.push(`/display?tokenID=${props.tokenID}`)

    return
  }

  async function beginMint() {
    console.log([tokenID, renting])
    if (tokenID) {
      if (renting) return await rentAndColor()
      else return await remintSync()
    } else {
      if (renting) return await rentAndMint()
      else return await mintSync()
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
      return 'Recolor ∞ Sync!'
    } else {
      return 'MINT!'
    }
  }
  function HexToHSB(hex) {
    hex = hex.replace(/^#/, '')
    hex = hex.length === 3 ? hex.replace(/(.)/g, '$1$1') : hex

    var red = parseInt(hex.substr(0, 2), 16) / 255,
      green = parseInt(hex.substr(2, 2), 16) / 255,
      blue = parseInt(hex.substr(4, 2), 16) / 255

    var cMax = Math.max(red, green, blue),
      cMin = Math.min(red, green, blue),
      delta = cMax - cMin,
      saturation = cMax ? delta / cMax : 0

    switch (cMax) {
      case 0:
        return [0, 0, 0]
      case cMin:
        return [0, 0, cMax]
      case red:
        return [60 * (((green - blue) / delta) % 6) || 0, saturation, cMax]
      case green:
        return [60 * ((blue - red) / delta + 2) || 0, saturation, cMax]
      case blue:
        return [60 * ((red - green) / delta + 4) || 0, saturation, cMax]
    }
  }

  function sorter(a, b) {
    if (searchColor) {
      return a.delta - b.delta || a.hue - b.hue
    } else {
      return (
        Math.min(
          Math.abs(a.h - hue),
          Math.abs(a.h + 360 - hue),
          Math.abs(a.h - 360 - hue)
        ) -
          Math.min(
            Math.abs(b.h - hue),
            Math.abs(Math.abs(b.h + 360) - hue),
            Math.abs(b.h - 360 - hue)
          ) ||
        Math.abs(b.s) - Math.abs(a.s) ||
        Math.abs(b.l) - Math.abs(a.l)
      )
    }
  }

  function calculateTotal() {
    const price = tokenID ? COLOR_COST : MINT_COST
    const txCost = context.library.utils.toBN(
      context.library.utils.toWei(price, 'ether')
    )

    if (rentalFee) {
      txCost.iadd(
        context.library.utils.toBN(
          context.library.utils.toWei(rentalFee, 'ether')
        )
      )
    }

    txCost.imul(context.library.utils.toBN(mintCount))

    return context.library.utils.fromWei(txCost.toString(), 'ether')
  }

  function colorsSelected() {
    return getSelectedColors().length
  }

  function setColor(e) {
    setSearchColor(e.target.value)
  }

  function updateRentalRange(e) {
    setRentalRange(e.target.value)
  }
  function rangeFilter(color) {
    if (!renting) return true
    if (rentalRange === SLIDER_MAX) return 1
    return Number(color.wei) <= Number(rentalRange)
  }

  function changeHue(e) {
    setSearchColor(undefined)
    setHue(parseInt(e.target.value))
  }

  function colorDelta(color) {
    if (!searchColor) return color

    const { r, g, b } = hexToRgb(searchColor)
    const { r2, g2, b2 } = hexToRgb(color.color)

    let delta = Math.abs(r2 - r)
    delta += Math.abs(g2 - g)
    delta += Math.abs(b2 - b)
    color.delta = delta

    return color
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
        <div className={'w-full  mx-auto lg:w-2/3 rounded pb-10 px-6 lg:px-0'}>
          {tokenID && (
            <div className={'text-center mt-0 mb-10'}>
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
              {tokenID && !approved && (
                <div
                  className={
                    'content-center justify-center text-center center-text mt-4 mb-10'
                  }
                >
                  <div className={'content-center justify-center mb-10 mx-8'}>
                    <button
                      onClick={submitting ? () => {} : () => approve(tokenID)}
                      className={
                        'bg-blue-700 mx-5 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
                      }
                    >
                      {submitting === 'approving'
                        ? 'Approving...'
                        : 'Approve Sync For Recolor'}
                    </button>
                  </div>
                  <div
                    className={
                      'content-center justify-center hidden mb-10 mx-8'
                    }
                  >
                    <button
                      onClick={
                        submitting ? () => {} : () => approveAll(tokenID)
                      }
                      className={
                        'bg-blue-700 mx-5 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
                      }
                    >
                      {submitting === 'approvingAll'
                        ? 'Approving...'
                        : 'Approve All Tokens'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {
            <div className={'mb-10 '}>
              {(renting || colorsOwned > 0) && (
                <>
                  <p
                    className={
                      'text-center mb-1 text-xl font-bold title-font sm:text-4xl text-3xl mb-4 font-black text-gray-900 pt-0 mt-0 uppercase'
                    }
                  >
                    {renting && 'Select Tokens to Rent'}
                    {!renting &&
                      `Select ${tokenID ? 'New' : 'Your'} Color Primitives`}
                  </p>

                  <p
                    className={
                      'text-black text-center mb-3 font-late-500 text-md'
                    }
                  >
                    (up to three)
                  </p>
                </>
              )}
              {!renting && colorsOwned === 0 && !tokenID && (
                <div className={''}>
                  <p
                    className={
                      'text-center mb-1 text-xl font-bold title-font sm:text-4xl text-3xl mb-4 font-black text-gray-900 pt-0 mt-0 uppercase'
                    }
                  >
                    Mint Your Color X Sync NFT
                  </p>
                  <p className={'text-center mb-3 font-late-500 text-sm'}>
                    grayscale default. chances for colored rares
                    <span
                      className={
                        'mt-2 text-blue-400 block display-block cursor-pointer'
                      }
                      onClick={() => setRenting(true)}
                      style={{ display: 'block' }}
                    >
                      how about renting colors instead?
                    </span>
                  </p>
                </div>
              )}
              <div className={'flex w-full flex-row my-10 '}>
                {renting && rentableColors > 0 && (
                  <Switch.Group>
                    <div className="w-full justify-self-start block items-center">
                      <Switch
                        checked={showFilters}
                        onChange={() => {
                          setShowFilters(showFilters ? false : true)
                        }}
                        className={`${
                          showFilters ? 'bg-blue-600' : 'bg-gray-200'
                        } relative inline-flex items-center h-6 rounded-full w-11`}
                      >
                        <span
                          className={`${
                            showFilters ? 'translate-x-6' : 'translate-x-1'
                          } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                        />
                      </Switch>
                      <Switch.Label className="ml-4  align-top font-bold title-font uppercase">
                        Show Filters
                      </Switch.Label>
                    </div>
                  </Switch.Group>
                )}
                <Switch.Group>
                  <div
                    className={`w-full  ${
                      !svgsLoaded ? "opacity-60" : ""
                    } ${
                      renting && rentableColors > 0
                        ? 'align-self-end justify-self-end text-right'
                        : ' text-center '
                    } block items-center`}
                  >
                    <Switch.Label className="align-top ml-4 font-bold title-font uppercase">
                      Enable Rentals
                    </Switch.Label>
                    <Switch
                      checked={renting}
                      onChange={() => {
                        if (!svgsLoaded) return;
                        setRenting(renting ? false : true)
                        if (!renting) setRentalFee(0)
                      }}
                      className={`${
                        renting ? 'bg-blue-600' : 'bg-gray-200'
                      } ml-4 relative inline-flex items-center h-6 rounded-full w-11`}
                    >
                      <span
                        className={`${
                          renting ? 'translate-x-6' : 'translate-x-1'
                        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                      />
                    </Switch>
                  </div>
                </Switch.Group>
              </div>

              {renting && rentableColors == 0 && (
                <p
                  className={
                    'text-center ml-1 mt-3 relative text-lg uppercase top-2 font-bold text-red-700'
                  }
                >
                  No Colors to Rent
                </p>
              )}
              {renting && rentableColors > 1 && showFilters && (
                <>
                  {/* <div className={'mb-10 justify-center'}>
                    <p className={'font-bold uppercase text-lg'}>
                      Color Picker:
                    </p>
                    <input
                      onChange={setColor}
                      type="color"
                      className={'block w-full'}
                    />
                  </div> */}
                  <div className={'mb-10 justify-center'}>
                    {/* <p className={'font-bold uppercase text-lg'}>Rental Fee:</p> */}
                    <input
                      className={'block w-full'}
                      onChange={updateRentalRange}
                      type="range"
                      min="3000000000000000"
                      max={SLIDER_MAX}
                      value={rentalRange}
                      step="1000"
                    />
                    <div className={'stat flex flex-row'}>
                      <p className={'w-1/2 font-bold justify-self-start'}>
                        .003
                        <span
                          style={{ top: '2px' }}
                          className={'ml-1 inline-block relative'}
                        >
                          <EthIcon />
                        </span>
                      </p>
                      <p
                        className={
                          'w-1/2 align-right text-right font-bold justify-self-end'
                        }
                      >
                        1+{' '}
                        <span
                          style={{ top: '2px' }}
                          className={'inline-block relative'}
                        >
                          <EthIcon />
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className={'mb-10'}>
                    {/* <p className={'font-bold uppercase text-lg'}>Hue Slider:</p> */}
                    <input
                      style={{
                        background:
                          'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
                        height: '15px',
                      }}
                      className={`${styles.range} w-full appearance-none`}
                      onChange={changeHue}
                      min="0"
                      max="360"
                      type="range"
                    />
                  </div>
                </>
              )}
              <div className={'max-h-120 overflow-y-auto overscroll-contain'}>
                {' '}
                <div
                  className={
                    'flex flex-wrap colors justify-center content-center '
                  }
                >
                  {svgsLoaded &&
                    svgs &&
                    svgs
                      .map(colorDelta)
                      .filter(rangeFilter)
                      .sort(sorter)
                      .map((svg) => (
                        <div key={svg.color} className={'color text-center '}>
                          <div
                            onClick={() => selectColor(svg)}
                            className={`border-solid relative border-4 relative border-gray-800 opacity-85  color shadow-lg
                            ${
                              svg.selected == 1
                                ? `${styles.colorActive} ring-4 ring-offset-0 ring-blue-700`
                                : 'border-white'
                            }
                            `}
                            style={{
                              width: 75,
                              height: 75,
                              background: svg.color,
                              cursor: 'pointer',
                              margin: 10,
                            }}
                          >
                            {renting && ownedColors.includes(svg.tokenId) && (
                              <div
                                title="Your Staked Color"
                                className={'absolute top-2 right-2'}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  bgfill="white"
                                  background="white"
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 2c3.032 0 5.5 2.467 5.5 5.5 0 1.458-.483 3.196-3.248 5.59 4.111 1.961 6.602 5.253 7.482 8.909h-19.486c.955-4.188 4.005-7.399 7.519-8.889-1.601-1.287-3.267-3.323-3.267-5.61 0-3.033 2.468-5.5 5.5-5.5zm0-2c-4.142 0-7.5 3.357-7.5 7.5 0 2.012.797 3.834 2.086 5.182-5.03 3.009-6.586 8.501-6.586 11.318h24c0-2.791-1.657-8.28-6.59-11.314 1.292-1.348 2.09-3.172 2.09-5.186 0-4.143-3.358-7.5-7.5-7.5z" />
                                </svg>
                              </div>
                            )}
                          </div>

                          {renting && (
                            <p>
                              {svg.fee}{' '}
                              <span
                                style={{ top: '2px' }}
                                className={'relative inline-block'}
                              >
                                <EthIcon
                                  fill={
                                    renting && ownedColors.includes(svg.tokenId)
                                      ? 'green'
                                      : ''
                                  }
                                />
                              </span>
                              {/* {renting && ownedColors.includes(svg.tokenId) && (
                                <span
                                  style={{ top: '3px' }}
                                  className={
                                    'ml-1 relative text-xl top-2 font-bold align-middle align-center text-red-700 rounded-lg'
                                  }
                                >
                                  *
                                </span>
                              )} */}
                            </p>
                          )}
                        </div>
                      ))}
                  {!svgsLoaded && <Loader />}
                </div>
              </div>
              {/* {renting && svgsLoaded && ownedColors.length > 0 && (
                <p
                  style={{ top: '3px' }}
                  className={
                    'text-center ml-1 mt-3 relative text-sm top-2 font-bold text-red-700'
                  }
                >
                  <span className={'align-bottom text-xl font-bold '}>*</span>{' '}
                  your staked colors
                </p>
              )} */}
            </div>
          }

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
                        const value = e.target.value
                        if (isNaN(parseInt(value))) {
                          return setMintCount(1)
                        }
                        setMintCount(Math.min(parseInt(value), MAX_MINT_COUNT))
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

          <div className={'mb-10'}>
            <p className={'text-center font-bold uppercase'}>
              {tokenID ? 'PRICE = ' : '1 SYNC = '}
              {tokenID ? COLOR_COST.toString() : MINT_COST.toString()}{' '}
              <span
                style={{ top: '2px' }}
                className={'inline-block align-top relative'}
              >
                <EthIcon />
              </span>
            </p>
            {renting && (
              <p className={'text-center font-bold uppercase'}>
                Rental Fees = {typeof rentalFee === 'undefined' && ' ...'}
                {typeof rentalFee !== 'undefined' && (
                  <>
                    {rentalFee}{' '}
                    <span
                      style={{ top: '2px' }}
                      className={'inline-block align-top relative'}
                    >
                      <EthIcon />
                    </span>
                  </>
                )}
              </p>
            )}
            {renting && mintCount > 1 && 
              <p className={'text-center font-bold uppercase'}>
                Mint Count = <span className={"text-xs"}>x</span>{mintCount}
              </p>
            }
            {renting && (
              <p className={'mt-2 text-center font-bold uppercase'}>
                Total = {typeof rentalFee === 'undefined' && ' ...'}
                {typeof rentalFee !== 'undefined' && (
                  <>
                    {calculateTotal()}{' '}
                    <span
                      style={{ top: '2px' }}
                      className={'inline-block align-top relative'}
                    >
                      <EthIcon />
                    </span>
                  </>
                )}
              </p>
            )}
          </div>

          {(tokenID || renting ? colorsSelected() > 0 : 1) && (
            <div className={'content-center justify-center flex mt-10 mb-10'}>
              {submitting != 'syncs' && (
                <button
                  onClick={
                    renting && tokenID && !approved
                      ? () => {
                          toast.error('Sync must be approved first!')
                        }
                      : beginMint
                  }
                  className={`mx-5 text-white font-bold py-2 px-4 rounded ${
                    renting && tokenID && !approved
                      ? 'bg-gray-500'
                      : 'bg-blue-700  hover:bg-green-700'
                  }`}
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
          )}
          {/* {renting && tokenID && !approved && colorsSelected() > 0 && (
            <div className={'content-center justify-center text-center center-text mb-10'}>
            <div className={'content-center justify-center mb-10 mx-8'}>
              <button
                onClick={submitting ? () => {} : () => approve(tokenID)}
                className={
                  'bg-blue-700 mx-5 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
                }
              >
                {submitting === 'approving' ? 'Approving...' : 'Approve Sync For Recolor'}
              </button>
            </div>
            <div className={'content-center justify-center hidden mb-10 mx-8'}>
              <button
                onClick={submitting ? () => {} : () => approveAll(tokenID)}
                className={
                  'bg-blue-700 mx-5 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
                }
              >
                {submitting === 'approvingAll'
                  ? 'Approving...'
                  : 'Approve All Tokens'}
              </button>
            </div></div>
          )} */}
          {!tokenID && colorsOwned > 0 && colorsSelected() === 0 && (
            <div className={'-mt-5 content-center justify-center flex mb-10'}>
              <p
                className={
                  'px-10 py-8 bg-red-400 ring-4 ring-offset-10 ring-black text-black font-bold text-center mb-3 font-late-500 text-sm uppercase'
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
                  'px-10 py-8 bg-red-400 ring-4 ring-offset-10 ring-black text-black font-bold text-center mb-3 font-late-500 text-sm uppercase'
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
