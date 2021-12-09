/*  ./components/Navbar.jsx     */
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from '../styles/meme.module.css'
import { useWeb3Context } from 'web3-react';

export const Navbar = () => {
  const context = useWeb3Context()

  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive(!active);
  };

  useEffect(async () => {
    await context.setFirstValidConnector(['MetaMask'])
  })

  return (
    <div>
      <nav className={styles.nav}>
        <div className='container mx-auto flex flex-wrap p-4 flex-col md:flex-row items-center md:mb-4'>
          <Link href='/'>
            <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0"
              href="" target="_blank"><span className="mr-3 text-xl">CONCAVE</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
                  className="w-10 h-10 text-white p-2 bg-black rounded-full" viewBox="0 0 24 24">
                <path d="M12 11.293l10.293-10.293.707.707-10.293 10.293 10.293 10.293-.707.707-10.293-10.293-10.293 10.293-.707-.707 10.293-10.293-10.293-10.293.707-.707 10.293 10.293z"></path>
              </svg>
              <span className="ml-3 text-xl">COLORS.NFT</span>
            </a>
          </Link>
          <button
            className='hamburger inline-flex p-3 hover:bg-concave-600 rounded lg:hidden ml-auto outline-none'
            onClick={handleClick}
          >
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 6h16M4 12h16M4 18h16'
              />
            </svg>
          </button>
          {/*Note that in this div we will use a ternary operator to decide whether or not to display the content of the div  */}
          <div
            className={`${
              active ? '' : 'hidden'
            }   w-full lg:inline-flex lg:flex-grow lg:w-auto`}
          >
            <div className='lg:inline-flex lg:flex-row lg:ml-auto lg:w-auto w-full lg:items-center items-start  flex flex-col lg:h-auto'>
              <Link href='/'>
                <a className='text-black uppercase lg:inline-flex lg:w-auto w-full px-3 py-2 rounded font-bold items-center justify-center hover:bg-concave-600'>
                  Home
                </a>
              </Link>
              <Link href='/mint'>
                <a className='text-black uppercase lg:inline-flex lg:w-auto w-full px-3 py-2 rounded font-bold items-center justify-center hover:bg-concave-600'>
                  Mint
                </a>
              </Link>
              {/*<Link href='/nfts'>
                <a className='text-black uppercase lg:inline-flex lg:w-auto w-full px-3 py-2 rounded font-bold items-center justify-center hover:bg-concave-600'>
                  My NFTs
                </a>
              </Link>*/}
              {context.active && context.account && <Link href='https://github.com/concave-dash/concave_x_colors_nft'>
                <p className='text-black uppercase lg:inline-flex lg:w-auto w-full px-3 py-2 rounded font-bold items-center justify-center hover:bg-concave-600'>
                {context.account.substring(0,5)+'....'+context.account.substring(11,16)}</p>
              </Link> }
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};