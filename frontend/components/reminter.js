import SyncXColors from '../../artifacts/contracts/SyncXColors.sol/Sync.json';
import TheColors from '../../artifacts/contracts/legacy_colors/TheColors.sol/TheColors.json';
import React, {useState, useEffect} from 'react';
import { Loader } from './loader';
import toast from 'react-hot-toast';
import Router, {useRouter} from 'next/router'
import { useWeb3Context } from 'web3-react';
import styles from '../styles/meme.module.css'

export const Reminter = (props) => {
  const context = useWeb3Context()

  // Mainnet
  //const network = 1;
  // Ropstens
  const network = 3

  const MAX_COLORS = 2
  const COLORS_CONTRACT = '0x3C4CfA9540c7aeacBbB81532Eb99D5E870105CA9'
  const SYNC_CONTRACT = '0x2ED6550746891875A7e39d3747d1a4FFe5433289'
  const [svgs, setSvgs] = useState(null)
  const [sync, setSync] = useState(null)
  const [mintColors, setMintColors] = useState(null)
  const [address, setAddress] = useState(null)
  const [submitting, setSubmitting] = useState(null)
  const [colorsOwned, setColorsOwned] = useState(null)

  useEffect(async () => {
    setMintColors(0);
    setSvgs([]);

    if (context.active) {
      setAddress(context.account)
      const syncContract = new context.library.eth.Contract(SyncXColors.abi, SYNC_CONTRACT);

      await fetchSync(syncContract, props.tokenID)

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
      //const svg = await contract.methods.getTokenSVG(context.library.eth.abi.encodeParameter('uint256',tokenId)).call()
      const color = await contract.methods.getHexColor(context.library.eth.abi.encodeParameter('uint256',tokenId)).call()
      svgs.push({
        tokenId,
        color
      })
    }

    setSvgs(svgs)
  }

  async function fetchSync(contract, tokenID) {
    const svgElement = await contract.methods.getTokenSVG(context.library.eth.abi.encodeParameter('uint256', tokenID)).call()
    setSync(svgElement)
  }

  async function remintSync(){
    setSubmitting("sync")
    let txToast;
    try {
      const nonce = await context.library.eth.getTransactionCount(address, 'latest');
      const contract = new context.library.eth.Contract(SyncXColors.abi, SPIRALS_CONTRACT);
      
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
      setMintColors('unselected' + svg.tokenId)
      return;
    }

    if (svgs.filter(x => x.selected).length === MAX_COLORS){
      toast.error("Max number of colors selected!")
      return;
    }

    svg.selected = 1;

    setMintColors(svg.tokenId)
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
          <div className={"mb-10"}>
            <p className={"text-center mb-3 text-xl font-bold"}>Select Your Color Primitives</p>
            <div className={"flex flex-wrap colors justify-center content-center"}>
            {svgs && svgs.map(svg => (
                <div onClick={() => selectColor(svg)} key={svg.color} className={"border-solid  border-4 color shadow-lg " + (svg.selected ? styles.colorActive : " border-white")} style={{
                  width: 75,
                  height: 75,
                  background: svg.color,
                  margin: 5
                }}></div>
            ))}
            {(!svgs || !svgs.length) && <Loader />}
            </div>
            <div className={"mt-10 mb-10"}>
              <p className={"text-center mt-3 mb-3 text-xl font-bold"}>Sync X Color</p>
              <div className={"flex colors justify-center content-center"}>
                {!sync && <Loader />}
                {sync && <div className={styles.sync} dangerouslySetInnerHTML={{ __html: sync }}></div> }
              </div>
            </div>
          </div>

          <div className={"content-center justify-center flex mb-10"}>
            {submitting != 'sync' && <button onClick={remintSync}  className={"bg-blue-700 mx-5 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"}>
              Color ∞ Sync!
            </button> }
            {submitting == "sync" && <button  className={"bg-blue-700 mx-5 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"}>
              Syncing...
            </button> }
          </div>
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
