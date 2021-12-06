import TheSpirals from '../../artifacts/contracts/legacy_spirals/TheSpirals.sol/TheSpirals.json';
import TheColors from '../../artifacts/contracts/legacy_colors/TheColors.sol/TheColors.json';
import styles from '../styles/meme.module.css'
import { Navbar } from '../components/navbar'
import { Footer } from '../components/footer'
import { MetaHead } from '../components/head'
import { Loader } from '../components/loader'
import React, {useState, useEffect} from 'react';
import Web3 from 'web3';

export default function NFTs() {
  const MAX_COLORS = 4317
  const COLORS_CONTRACT = '0x3C4CfA9540c7aeacBbB81532Eb99D5E870105CA9'
  const SPIRALS_CONTRACT = '0x2c18BCab190A39b82126CB421593706067A57395'
  const [web3, setWeb3] = useState(null)
  const [minted, setMint] = useState(null)
  const [address, setAddress] = useState(null)
  const [network, setNetwork] = useState(null)
  useEffect(async () => {
    if (!window.ethereum) {
      console.log("Please install Metamask")
      return
    }

    const accounts = await ethereum.request({ method: "eth_requestAccounts" })
    setAddress(accounts[0])

    const web3 = new Web3(ethereum)
    setWeb3(web3)

    const networkName = await web3.eth.net.getNetworkType()
    if (networkName === "main")   setNetwork("Mainnet")
    else setNetwork(networkName)

    const contract = new web3.eth.Contract(TheSpirals.abi, SPIRALS_CONTRACT);
    await fetchMint(45, web3, contract)

  }, []);

  async function fetchMint(tokenId, web3, contract) {
    const svgElement = await contract.methods.getTokenSVG(web3.eth.abi.encodeParameter('uint256',tokenId)).call()
    //await contract.methods.getBase64TokenSVG(web3.eth.abi.encodeParameter('uint256',tokenId)).call()
    setMint(svgElement)
  }

  return (
    <div className={styles.mainContainer}>
      <MetaHead />
      <Navbar />
      <div className={styles.container}>
        <div className={styles.main}>
          {minted && <main className={'pb-4 pt-10 mx-auto mt-10 center-items'}>
              <p class="text-center font-bold mb-10 color-green">AHHHH I SYNCED!</p>
              <div dangerouslySetInnerHTML={{ __html: minted }}></div>
          </main>}
          {!minted && <Loader/>}
        </div>
        <Footer />
      </div>
    </div>
  )
}