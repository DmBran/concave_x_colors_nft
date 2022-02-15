/*  ./components/Navbar.jsx     */
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useWeb3Context } from 'web3-react'
import styles from '../styles/meme.module.css'
export const Navbar = () => {
  const router = useRouter()
  const context = useWeb3Context()
  //console.log(router.pathname)
  const [active, setActive] = useState(false)
  const [path, setPath] = useState(undefined)

  useEffect(() => {
    const path = router.pathname
    setPath(path)
  }, [])

  const handleClick = () => {
    setActive(!active)
  }

  const activateMM = async () => {
    await context.setFirstValidConnector(['MetaMask'])
  }

  return (
    <div>
      <nav className="bg-gray-300 bg-opacity-50">
        <div className="container mx-auto flex flex-wrap p-4 md:mb-4">
          <Link href="/">
            <a className="flex title-font font-bold items-center text-gray-900 md:mb-0">
              <span className="mr-2 text-xl">SYNC</span>
              <span
                style={{ fontSize: '40px', top: '-2px' }}
                className="relative text-xl"
              >
                &infin;
              </span>
              <span className="ml-2 text-xl">COLORS</span>
            </a>
          </Link>

          {/*Mobile Button goes here*/}
          <button
            className="hamburger text-black align-right inline-flex p-3 hover:text-indigo-500 rounded lg:hidden ml-auto outline-none"
            onClick={handleClick}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          {/*Note that in this div we will use a ternary operator to decide whether or not to display the content of the div  */}
          <div
            className={`${
              active ? '' : 'hidden'
            }   w-full lg:inline-flex lg:flex-grow lg:w-auto`}
          >
            <div className="lg:inline-flex lg:flex-row lg:ml-auto lg:w-auto w-full lg:items-center items-start  flex flex-col lg:h-auto">
              {
                <Link prefetch={false} href={`/mint`}>
                  <a
                    className={`text-black uppercase lg:inline-flex lg:w-auto w-full px-3 py-2 rounded font-bold items-center justify-center hover:text-indigo-500 ${
                      path === '/mint' || path === '/resync'
                        ? styles.activeNavBar
                        : ''
                    }`}
                  >
                    Mint / Resync
                  </a>
                </Link>
              }
              {/* {
                <Link prefetch={false} href={`/rent`}>
                  <a className="text-black uppercase lg:inline-flex lg:w-auto w-full px-3 py-2 rounded font-bold items-center justify-center hover:text-indigo-500">
                    Rent
                  </a>
                </Link>
              } */}
              {/* {
                <Link prefetch={false} href={`/balances`}>
                  <a className="text-black uppercase lg:inline-flex lg:w-auto w-full px-3 py-2 rounded font-bold items-center justify-center hover:text-indigo-500">
                    Balances
                  </a>
                </Link>
              } */}
              {
                <Link prefetch={false} href={`/stake`}>
                  <a
                    className={`text-black uppercase lg:inline-flex lg:w-auto w-full px-3 py-2 rounded font-bold items-center justify-center hover:text-indigo-500 ${
                      path === '/stake' || path === '/balances'
                        ? styles.activeNavBar
                        : ''
                    }`}
                  >
                    Staking
                  </a>
                </Link>
              }
              {/* {
                <Link prefetch={false} href={`/unstake`}>
                  <a className="text-black uppercase lg:inline-flex lg:w-auto w-full px-3 py-2 rounded font-bold items-center justify-center hover:text-indigo-500">
                    Unstake
                  </a>
                </Link>
              } */}
              {
                <Link prefetch={false} href={`/display`}>
                  <a
                    className={`text-black uppercase lg:inline-flex lg:w-auto w-full px-3 py-2 rounded font-bold items-center justify-center hover:text-indigo-500 ${
                      path === '/display' ? styles.activeNavBar : ''
                    }`}
                  >
                    My NFTs
                  </a>
                </Link>
              }
              <Link href={`/faq`}>
                <a
                  className={`text-black uppercase lg:inline-flex lg:w-auto w-full px-3 py-2 rounded font-bold items-center justify-center hover:text-indigo-500 ${
                    path === '/faq' ? styles.activeNavBar : ''
                  }`}
                >
                  FAQ
                </a>
              </Link>
              {context.active && context.account && (
                <a
                  className="mt-2 lg:mt-0 ml-3 lg:ml-6 ring-4 ring-black text-black uppercase lg:inline-flex lg:w-auto w-full px-3 py-2 rounded font-bold items-center justify-center hover:text-indigo-500"
                  target="_blank"
                  href={`https://etherscan.io/address/${context.account}`}
                >
                  {context.account.substring(0, 5) +
                    '....' +
                    context.account.substring(
                      context.account.length - 5,
                      context.account.length
                    )}
                </a>
              )}
              {!context.active && (
                <button
                  type="button"
                  className={
                    'mt-2 lg:mt-0 ml-3 lg:ml-6  uppercase inline-flex ring-4 ring-black items-center  py-1 px-3 focus:outline-none rounded text-base'
                  }
                  onClick={activateMM}
                >
                  <p className={'font-bold'}>Connect Wallet</p>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}
