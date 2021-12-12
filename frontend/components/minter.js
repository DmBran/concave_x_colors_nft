import SyncXColors from '../../artifacts/contracts/SyncXColors.sol/Sync.json';
import TheColors from '../../artifacts/contracts/legacy_colors/TheColors.sol/TheColors.json';
import React, {useState, useEffect} from 'react';
import { Loader } from './loader';
import toast from 'react-hot-toast';
import Router from 'next/router'
import { useWeb3Context } from 'web3-react';
import styles from '../styles/meme.module.css'

export const Minter = (props) => {
  const context = useWeb3Context()

  // Mainnet
  //const network = 1;
  // Ropstens
  const network = 3
  const MAX_MINT_COUNT = 5
  const MAX_SUPPLY = 2122
  const MAX_COLORS = 3
  const COLORS_CONTRACT = '0x3C4CfA9540c7aeacBbB81532Eb99D5E870105CA9'
  //const SPIRALS_CONTRACT = '0x2c18BCab190A39b82126CB421593706067A57395'
  const SYNC_CONTRACT = '0x2ED6550746891875A7e39d3747d1a4FFe5433289'
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

    setMintColors(0)
    setSvgs([]);

    if (context.active) {

      const syncContract = new context.library.eth.Contract(SyncXColors.abi, SYNC_CONTRACT);
      const minted = 0;
      //const minted = await contract.methods.currentSupply(context.library.eth.abi.encodeParameter('uint256', tokenID)).call()
      setAmountMinted(minted)

      if (props.tokenID) {
        setTokenID(props.tokenID)
        const svg = await fetchSync(syncContract, props.tokenID)
        setSync(svg)
      }

      setAddress(context.account)

      const contract = new context.library.eth.Contract(TheColors.abi, COLORS_CONTRACT);
      await updateColorList(contract, context.account)
    }

  }, [context]);

  async function updateColorList(contract, account){
    const svgs = [];

    const colorsCount = await contract.methods.balanceOf(account).call()
    setColorsOwned(colorsCount)

    for (const i = 0; i < colorsCount; ++i) {
      const tokenId = await contract.methods.tokenOfOwnerByIndex(account, context.library.eth.abi.encodeParameter('uint256',i)).call()
      const color = await contract.methods.getHexColor(context.library.eth.abi.encodeParameter('uint256',tokenId)).call()
      svgs.push({
        tokenId,
        color
      })
    }

    setSvgs(svgs)
  }

  async function mintSync(){
    setSubmitting("syncs")
    let txToast;
    try {
      const nonce = await context.library.eth.getTransactionCount(address, 'latest');
      const contract = new context.library.eth.Contract(SyncXColors.abi, SYNC_CONTRACT);

      const tokens = svgs.filter(svg => svg.selected).map(svg =>  parseInt(svg.tokenId))
      const txCall =  contract.methods.mintSync(tokens)

      const [ from, to, data ] = [ address, SYNC_CONTRACT, txCall.encodeABI() ]

      const gas = await context.library.eth.estimateGas({
        from,
        data,
        to
      })

      const tx = {
        nonce,
        from,
        data,
        gas,
        to
      };

      txToast = toast.loading("Transaction processing")
      const tx2 = await context.library.eth.sendTransaction(tx, address).catch(error => {
        toast.error("Transaction failed!", {
          id: txToast
        })
        setSubmitting(undefined)
      })
      console.log(tx2)
      if (!tx2?.transactionHash) {
        toast.error("Transaction failed!", {
          id: txToast
        })
        setSubmitting(undefined)
      } else {
        toast.success("Transaction successful!", {
          id: txToast
        })
        return Router.push('/nfts');
      }

    } catch (ex) {
      console.log(ex)
      setSubmitting(undefined)
      if (txToast){
        toast.error("Transaction failed!", {
          id: txToast
        })
      }
    }
  }


  async function fetchSync(contract, tokenID) {
    const svgElement = await contract.methods.getTokenSVG(context.library.eth.abi.encodeParameter('uint256', tokenID)).call()
    return svgElement;
  }

  async function remintSync(){
    setSubmitting("sync")
    let txToast;
    try {
      const nonce = await context.library.eth.getTransactionCount(address, 'latest');
      const contract = new context.library.eth.Contract(SyncXColors.abi, SYNC_CONTRACT);
      
      const tokens = svgs.filter(svg => svg.selected).map(svg =>  parseInt(svg.tokenId))
      const txCall =  contract.methods.updateColors(props.tokenID, tokens)

      const [ from, to, data ] = [ address, SYNC_CONTRACT, txCall.encodeABI() ]

      const gas = await context.library.eth.estimateGas({
        from,
        data,
        to
      })

      const tx = {
        nonce,
        from,
        data,
        gas,
        to
      };

      txToast = toast.loading("Transaction processing")
      const tx2 = await context.library.eth.sendTransaction(tx, address).catch(error => {
        toast.error("Transaction failed!", {
          id: txToast
        })
        setSubmitting(undefined)
      })
      console.log(tx2)
      if (!tx2?.transactionHash) {
        toast.error("Transaction failed!", {
          id: txToast
        })
        setSubmitting(undefined)
      } else {
        toast.success("Transaction successful!", {
          id: txToast
        })
        return Router.push(`/reveal?tokenID=${props.tokenID}`);
      }

    } catch (ex) {
      console.log(ex)
      setSubmitting(undefined)
      if (txToast){
        toast.error("Transaction failed!", {
          id: txToast
        })
      }
    }
  }

  function selectColor(svg){
    if (svg.selected) {
      delete svg.selected;
      setMintColors('unselect-' + svg.tokenId)
      return;
    }

    if (svgs.filter(x => x.selected).length === MAX_COLORS){
      toast.error("Max number of colors selected!")
      return;
    }

    svg.selected = 1;

    setMintColors(svg.tokenId)
  }

  async function mintColor(){
    const nonce = await context.library.eth.getTransactionCount(address, 'latest');
    const contract = new context.library.eth.Contract(TheColors.abi, COLORS_CONTRACT);

    const txCall = contract.methods.mintNextColors(context.library.eth.abi.encodeParameter('uint256',1))
    const [ from, to, data ] = [ address, SYNC_CONTRACT, txCall.encodeABI() ]

    const gas = await context.library.eth.estimateGas({
      from,
      data,
      to
    })

    const tx = {
      nonce,
      from,
      data,
      gas,
      to
    };

    const txToast = toast.loading("Transaction processing")
    const tx2 = await context.library.eth.sendTransaction(tx, address).catch(error => {
      console.log(error)
      toast.error("Transaction failed!", {
        id: txToast
      })
      setSubmitting(undefined)
    })

    console.log(tx2)

    if (tx2?.transactionHash) {
      toast.success("Transaction successful!", {
        id: txToast
      })
      setSubmitting(undefined)
      await updateColorList(contract, address)
    }
  }

  async function beginMint() {
    if (tokenID) {
      return await remintSync()
    } else {
      return await mintSync()
    }
  }

  function preventChange(event) {
    return event.preventDefault();
  }

  function mintCountSet(event) {
    const value =- event.target.value;

    if (!value) return
    if (value === MAX_MINT_COUNT) return
    if (value < 1) return

    setMintCount(value)
  }

  function mintCountIncrement(dir) {
    let count = mintCount
    if (!count || isNaN(count)) count = 1;

    if (dir === "decrement") {
      count -= 1
    } else {
      count += 1;
    }

    if (count < 1) return
    if (count === MAX_MINT_COUNT) return

    setMintCount(count)
  }

  function getMintText(loading) {
    if (loading)  return "Processing"
  
    if (tokenID) {
      return "Color ∞ Sync!"
    } else {
      return "MINT!"
    }
  }

  if (context.active){
    if (context.networkId !== network) {
      return (
        <div className={"flex-1 font-bold text-red flex text-center center-content justify-center"}>
          <p className={'mb-0 align-center'}>Please switch network to Ethereum mainnet</p>
        </div>
      )
    }
    if (context.account) {
      return (
        <div className={styles.modal}>
          <div className={"mb-10 hidden"}>
            <p className={"text-center mb-3 font-bold"}>Need a Color Primitive?</p>
            <div className={"flex colors justify-center content-center"}>
            {submitting != 'colors' && <button onClick={mintColor} className={"bg-blue-500 mx-5 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"}>
                Mint a Colors NFT!
              </button>}
              {submitting == "colors" && <button className={"bg-green-500 mx-5 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"}>
              Minting...
            </button> }
            </div>
          </div>
          { colorsOwned > 0 && <div className={"mb-10"}>
            <p className={"text-center mb-1 text-xl font-bold"}>Select Your Color Primitives</p>
            <p className={'text-center mb-3 font-late-500 text-xs'}>(up to three)</p>
            <div className={"flex flex-wrap colors justify-center content-center"}>
            {svgs && svgs.map(svg => (
                <div onClick={() => selectColor(svg)} key={svg.color} className={"border-solid  border-4 color shadow-lg " + (svg.selected ? styles.colorActive : " border-white")} style={{
                  width: 75,
                  height: 75,
                  background: svg.color,
                  margin: 5
                }}></div>
            ))}
            {!svgs.length && <Loader />}
            </div>
          </div> }

          { tokenID && <div className={"mt-10 mb-10"}>
            <p className={"text-center mt-3 mb-3 text-xl font-bold"}>Sync X Color</p>
            <div className={"flex colors justify-center content-center"}>
              {!sync && <Loader />}
              {sync && <div className={styles.sync} dangerouslySetInnerHTML={{ __html: sync }}></div> }
            </div>
          </div>
          }
          {!tokenID && <div className={"flex mb-10 content-center justify-center"}>
            <div className={"flex content-center justify-center custom-number-input ring-1 ring-slate-500 rounded-lg h-10 w-32"}>
              <div className={"flex flex-row h-10 w-full rounded-lg relative bg-transparent"}>
                <button onClick={() => mintCountIncrement('decrement')} data-action="decrement" className={" border-r border-slate-500 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none"}>
                  <span className={"m-auto text-2xl font-thin"}>−</span>
                </button>
                <input min="1" readonly="true" max={MAX_MINT_COUNT} type="text" className={"outline-none focus:outline-none text-center w-full  font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700  outline-none"} name="custom-input-number" value={mintCount} />
              <button onClick={() => mintCountIncrement('increment')} data-action="increment" className={"border-l border-l-slate-500 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer"}>
                <span className={"m-auto text-2xl font-thin"}>+</span>
              </button>
              </div>
            </div>
          </div>
          }
          <div className={"content-center justify-center flex mb-10"}>

            {submitting != 'syncs' && <button onClick={beginMint}  className={"bg-blue-700 mx-5 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"}>
              {getMintText()}
            </button> }
            {submitting == "syncs" && <button  className={"bg-blue-700 mx-5 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"}>
              {getMintText('loading')}
            </button> }
          </div>

          { !tokenID && <div className={"text-center justify-center"}>
            <p className={'font-bold'}>{ amountMinted } / { MAX_SUPPLY }</p>
          </div> }
        </div>
      );
    }
  }

  return (
    <div className={"flex-1 flex center-content justify-center"}>
      <p className={'font-bold'}>Please Connect via MetaMask</p>
    </div>
  )
}
