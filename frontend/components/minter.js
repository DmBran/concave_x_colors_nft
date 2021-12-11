import SyncXColors from '../../artifacts/contracts/SyncXColors.sol/Sync.json';
import TheSpirals from '../../artifacts/contracts/legacy_spirals/TheSpirals.sol/TheSpirals.json';
import TheColors from '../../artifacts/contracts/legacy_colors/TheColors.sol/TheColors.json';
import React, {useState, useEffect} from 'react';
import { Loader } from './loader';
import toast from 'react-hot-toast';
import Router from 'next/router'
import { useWeb3React } from '@web3-react/core'
import styles from '../styles/meme.module.css'
import Web3 from 'web3';
import { Contract } from '@ethersproject/contracts';
export const Minter = (props) => {
  const context = useWeb3React()
  const web3 = new Web3(context.library)

  // Mainnet
  //const network = 1;
  // Ropsten
  const network = 3

  const MAX_COLORS = 2
  const COLORS_CONTRACT = '0x3C4CfA9540c7aeacBbB81532Eb99D5E870105CA9'
  //const SPIRALS_CONTRACT = '0x2c18BCab190A39b82126CB421593706067A57395'
  const SPIRALS_CONTRACT = '0x2ED6550746891875A7e39d3747d1a4FFe5433289'
  const [svgs, setSvgs] = useState(null)
  const [mintColors, setMintColors] = useState(null)
  const [address, setAddress] = useState(null)
  const [minted, setMint] = useState(null)
  const [submitting, setSubmitting] = useState(null)
  const [colorsOwned, setColorsOwned] = useState(null)

  useEffect(async () => {

    setMintColors(0)
    setSvgs([]);

    if (context.active) {

      setAddress(context.account)
      console.log(context.account)
      const contract = new Contract(TheColors.abi, COLORS_CONTRACT, context.library.getSigner());
      await updateNFTs(contract, context.account)
    }

  }, []);

  async function updateNFTs(contract, account){
    const svgs = [];

    const colorsCount = await contract.methods.balanceOf(account).call()
    setColorsOwned(colorsCount)
  
    for (const i = 0; i < colorsCount; ++i) {
      const tokenId = await contract.methods.tokenOfOwnerByIndex(account, web3.eth.abi.encodeParameter('uint256',i)).call()
      const svg = await contract.methods.getTokenSVG(web3.eth.abi.encodeParameter('uint256',tokenId)).call()
      const color = await contract.methods.getHexColor(web3.eth.abi.encodeParameter('uint256',tokenId)).call()
      svgs.push({
        svg: svg.replace(/"690"/g,"75", 'g'),
        tokenId,
        color
      })
    }
    console.log(svgs)
    setSvgs(svgs)
  }

  async function mintSpiral(){
    setSubmitting("spirals")
    let txToast;
    try {
      const nonce = await web3.eth.getTransactionCount(address, 'latest');
      const contract = new web3.eth.Contract(SyncXColors.abi, SPIRALS_CONTRACT);
      
      const tokens = svgs.filter(svg => svg.selected).map(svg =>  parseInt(svg.tokenId))
      const txCall =  contract.methods.mintSync(tokens)
      const gas = await web3.eth.estimateGas({
        from: address,
        to: SPIRALS_CONTRACT,
        data: txCall.encodeABI()
      })
      console.log(tokens)
      console.log(contract.methods.mintSync(web3.eth.abi.encodeParameter('uint256[]', tokens)))
      const tx = {
        'from': address,
        'to': SPIRALS_CONTRACT,
        'nonce': nonce,
        'data': txCall.encodeABI(),
        gas
      };

      txToast = toast.loading("Transaction processing")
      const tx2 = await web3.eth.sendTransaction(tx, address).catch(error => {
        toast.error("Transaction failed!", {
          id: txToast
        })
        setSubmitting(undefined)
      })
      console.log(tx2)
      if (tx2?.code) {
        toast.error("Transaction failed!", {
          id: txToast
        })
        setSubmitting(undefined)
      } else {
        toast.success("Transaction successful!", {
          id: txToast
        })
      }
      setSubmitting(undefined)
      Router.push('/nfts')
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

  const handleConnect = async () => {
    if (window.ethereum) { //check if Metamask is installed
      await window.ethereum.enable(); //connect Metamask  
    } 
  }

  async function mintColor(){
    //setSubmitting("colors");
    const nonce = await web3.eth.getTransactionCount(address, 'latest');
    const contract = new web3.eth.Contract(TheColors.abi, COLORS_CONTRACT);

    const txCall = contract.methods.mintNextColors(web3.eth.abi.encodeParameter('uint256',1))
    const gas = await web3.eth.estimateGas({
      from: address,
      to: COLORS_CONTRACT,
      data: txCall.encodeABI()
    })
console.log(`Gas: ${gas}`);
//const gas = await txCall.estimateGas()
//console.log(gas)
    const tx = {
      'from': address,
      'to': COLORS_CONTRACT,
      'nonce': nonce,
      'data': txCall.encodeABI(),
      gas
    };
    console.log(tx)
    const txToast = toast.loading("Transaction processing")
    const tx2 = await web3.eth.sendTransaction(tx, address).catch(error => {
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
      await updateNFTs(contract, address)
    }

    console.log(tx2)
  }

  if (context.active){
    if (context.chainId !== network) {
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
            {!svgs.length && <Loader />}
            </div>
          </div> }

          <div className={"content-center justify-center flex mb-10"}>
            {submitting != 'spirals' && <button onClick={mintSpiral}  className={"bg-green-500 mx-5 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"}>
              MINT!
            </button> }
            {submitting == "spirals" && <button  className={"bg-green-500 mx-5 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"}>
              Minting...
            </button> }
          </div>
        </div>
      );
    }
  }

  return (
    <div className={"flex-1 flex center-content justify-center"}>
      <p className={'font-bold text-red-500'}>Please Connect Using MetaMask</p>
    </div>
  )
}
