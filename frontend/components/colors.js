import TheColors from '../../artifacts/contracts/legacy_colors/TheColors.sol/TheColors.json';
import React, {useState, useEffect} from 'react';
import { Loader } from './loader';
import Web3 from 'web3';
import { useWeb3Context } from 'web3-react';

export const Colors = (props) => {
  const context = useWeb3Context()


  const COLORS_CONTRACT = '0x3C4CfA9540c7aeacBbB81532Eb99D5E870105CA9'
  const [svgs, setSvgs] = useState(null)
  const [web3, setWeb3] = useState(null)
  const [tokenId, setTokenId] = useState(null)
  const [colorsOwned, setColorsOwned] = useState(null)

  useEffect(async () => {
    context.setFirstValidConnector(['MetaMask', 'Infura'])

    const contract = new context.library.Contract(TheColors.abi, COLORS_CONTRACT);
    await updateNFTs(web3, contract, props.address)
  }, []);

  function setToken(e, data){
    setTokenId(parseInt(e.target.getAttribute('data-token')))
    window.localStorage.setItem('tokenId', tokenId)
  }

  async function updateNFTs(web3, contract, account){
    const svgs = [];

    const colorsCount = await contract.methods.balanceOf(account).call()
    setColorsOwned(colorsCount)
  
    for (const i = 0; i < colorsCount; ++i) {
      const tokenId = await contract.methods.tokenOfOwnerByIndex(account, context.library.abi.encodeParameter('uint256',i)).call()
      const svg = await contract.methods.getTokenSVG(context.library.abi.encodeParameter('uint256',tokenId)).call()
      const color = await contract.methods.getHexColor(context.library.abi.encodeParameter('uint256',tokenId)).call()
      svgs.push({
        svg: svg.replace(/"690"/g,"75", 'g'),
        tokenId,
        color
      })
    }
    //console.log(svgs)
    setSvgs(svgs)
  }

    if (colorsOwned > 0){
        return (
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
                {(!svgs || !svgs.length) && <Loader />}
            </div>
        )
    } else {
        return (
        <div className={"flex colors justify-center content-center"}>
            <p className={"text-red-600 font-bold"}> No TheColors NFT Owned</p>
        </div>

        )
    }
}
