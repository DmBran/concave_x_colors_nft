import 'tailwindcss/tailwind.css'
import toast, { Toaster } from 'react-hot-toast';
import React, {useState, useEffect} from 'react';
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { Navbar } from '../components/navbar'
import { Footer } from '../components/footer'
import { MetaHead } from '../components/head'

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [
    1, // Mainet
    3, // Ropsten
  ],
})

function getLibrary(provider, connector) {
  return new Web3Provider(provider) // this will vary according to whether you use e.g. ethers or web3.js
}

export const Wallet = () => {
  const { chainId, account, activate, active } = useWeb3React()

  const onClick = () => {
    if (!active){
      activate(injectedConnector)
    }
  }

  if (active) {
    return (
      <p className='text-black uppercase lg:inline-flex lg:w-auto w-full px-3 py-2 rounded font-bold items-center justify-center hover:text-indigo-500'>
        {account.substring(0,5)+'....'+account.substring(11,16)}</p>
    )
  }

  return (
    <button type="button" className={'uppercase inline-flex ring-1 ring-indigo-500 items-center  py-1 px-3 focus:outline-none rounded text-base'} onClick={onClick}>
      <p className={'font-bold'}>Connect Wallet</p>
    </button>
  )
}

function MyApp({ Component, pageProps }) {

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <MetaHead />
      <Navbar wallet={() => Wallet()}/>
      <Component web3Library={() => getLibrary()} {...pageProps} />
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            border: '1px solid #fff',
            padding: '16px',
            color: 'white',
            background: 'rgb(110, 170, 250)',
            fontWeight: 'bold'
          },
          success: {
            style: {
              background: 'green',
            },
          },
          error: {
            style: {
              background: 'red',
            },
          }
        }}
      />
    </Web3ReactProvider>
  )
}

export default MyApp