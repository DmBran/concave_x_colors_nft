import TheSpirals from '../../artifacts/contracts/legacy_spirals/TheSpirals.sol/TheSpirals.json';
import TheColors from '../../artifacts/contracts/legacy_colors/TheColors.sol/TheColors.json';
import React, {useState, useEffect} from 'react';
import { Loader } from './loader';
import Web3 from 'web3';

export const Minter = () => {

  const MAX_COLORS = 4317
  const COLORS_CONTRACT = '0x3C4CfA9540c7aeacBbB81532Eb99D5E870105CA9'
  const SPIRALS_CONTRACT = '0x2c18BCab190A39b82126CB421593706067A57395'
  const [web3, setWeb3] = useState(null)
  const [svgs, setSvgs] = useState(null)
  const [tokenId, setTokenId] = useState(null)
  const [address, setAddress] = useState(null)
  const [network, setNetwork] = useState(null)
  const [colorsOwned, setColorsOwned] = useState(null)

  useEffect(async () => {
    if (!window.ethereum) {
      console.log("Please install Metamask")
      return
    }

    setTokenId(0)

    const accounts = await ethereum.request({ method: "eth_requestAccounts" })
    setAddress(accounts[0])

    setSvgs([]);

    const web3 = new Web3(ethereum)
    setWeb3(web3)

    const networkName = await web3.eth.net.getNetworkType()
    if (networkName === "main")   setNetwork("Mainnet")
    else setNetwork(networkName)

    const contract = new web3.eth.Contract(TheColors.abi, COLORS_CONTRACT);
    await updateNFTs(web3, contract, accounts[0])

  }, []);

  async function updateNFTs(web3, contract, account){
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
    console.log("minting spiral token "+tokenId)
    const nonce = await web3.eth.getTransactionCount(address, 'latest');
    const contract = new web3.eth.Contract(TheSpirals.abi, SPIRALS_CONTRACT);
    const tx = {
      'from': address,
      'to': SPIRALS_CONTRACT,
      'nonce': nonce,
      //"value": web3.utils.toWei('.01','ether'),
      'gas': 500000,
      'data': contract.methods.mintSpiral(web3.eth.abi.encodeParameter('uint256', tokenId)).encodeABI()
    };

    const tx2 = await web3.eth.sendTransaction(tx, address).catch(error => {
      console.log(error)
    })
  }

  function setToken(e, data){
    setTokenId(parseInt(e.target.getAttribute('data-token')))
  }

  async function mintColor(){

    const nonce = await web3.eth.getTransactionCount(address, 'latest');
    const contract = new web3.eth.Contract(TheColors.abi, COLORS_CONTRACT);
    const tx = {
      'from': address,
      'to': COLORS_CONTRACT,
      'nonce': nonce,
      //"value": web3.utils.toWei('.01','ether'),
      'gas': 500000,
      'data': contract.methods.mintNextColors(web3.eth.abi.encodeParameter('uint256',1)).encodeABI()
    };

    const tx2 = await web3.eth.sendTransaction(tx, address).catch(error => {
      console.log(error)
    })

    await updateNFTs(web3, contract, address)
    console.log(tx2)
  }

  if (address) {
    if (colorsOwned > 0){
      return (
        <div className={"flex-1"}>
          
          <div className={"mb-10"}>
            <p className={"text-center mb-3 font-bold"}>Your Colors:</p>
            <div className={"flex colors justify-center content-center"}>
            {svgs && svgs.map(svg => {
              return (
                <div onClick={setToken} data-token={svg.tokenId} key={svg.color} className={"color shadow-md" + (svg.tokenId == tokenId ? " border-solid border-4 border-concave-50 active" : "")} style={{
                  width: 75,
                  height: 75,
                  background: svg.color,
                  margin: 5
                }}/>
            )})}
            {!svgs.length && <Loader />}
            </div>
          </div>

          <div className={"content-center justify-center flex mb-10"}>
            <button onClick={mintColor} data-mint="color" className={"bg-blue-500 mx-5 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"}>
              Mint a Colors NFT!
            </button>
            <button onClick={mintSpiral} data-mint="spiral" className={"bg-green-500 mx-5 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"}>
              Mint a Spiral NFT!
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className={"flex-1 mb-10"}>
          <p className={"text-red-600 font-bold"}>You must own a Colors NFT to Mint!</p>
          <button onClick={mintColor} className={"bg-blue-500 mx-auto hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"}>
            Mint a Colors NFT!
          </button>
        </div>

      )
    }
  }
  return (
      <button
          className='inline-flex bg-green-500 items-center mr-5 border-b-4
               hover:border-8 border-black py-1 px-3 focus:outline-none rounded text-base mt-4 md:mt-0'>Connect Wallet
      </button>
  )
}
