import Link from 'next/link'
import Countdown from 'react-countdown'
import { Footer } from '../components/footer'
import { MetaHead } from '../components/head'
import { Navbar } from '../components/navbar'
import styles from '../styles/meme.module.css'
import NoSSR from 'react-no-ssr'
import HeroSlider from "../components/heroslider";
import Gallery from "../components/gallery";

export default function Home() {
  const LAUNCH_DATE = process.env.NEXT_PUBLIC_LAUNCH_DATE

  // Renderer callback with condition
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return (
        <Link href="/mint">
          <a>MINT NOW</a>
        </Link>
      )
    } else {
      // Render a countdown
      return (
        <div className="center-text text-center">
          <p className="uppercase">Minting starts in</p>
          <span>
            {days.toString().padStart(2, '0')}:
            {hours.toString().padStart(2, '0')}:
            {minutes.toString().padStart(2, '0')}:
            {seconds.toString().padStart(2, '0')}
          </span>
        </div>
      )
    }
  }

  return (
    <div className={styles.mainContainer}>
      <MetaHead />
      <Navbar />
      <div className={styles.container}>
        <div className={styles.hero}></div>
        <div className="text-gray-900 body-font pb-32">
          <div className={styles.mintHome}>
            <div className={styles.mintButton}>
              <NoSSR>
                <Countdown date={LAUNCH_DATE} renderer={renderer} />
              </NoSSR>
            </div>
          </div>
          <div className="container mx-auto flex px-5 py-24 lg:flex-row flex-col bg-gray-300 bg-opacity-50 items-center border-gray-800 border-8">
            <div className="sm:w-full md:w-full lg:flex-grow  md:w-1/3 lg:pr-20 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
              <h1 className="title-font text-center sm:text-4xl text-3xl mb-4 font-black text-gray-900 pt-2">
                SYNC X COLORS
              </h1>
              <p className="mb-8 leading-relaxed text-xl font-bold">
                This is the ultimate collaboration between Sync X Colors,
                Concave Finance (
                <a
                  style={{ color: '#047c45' }}
                  className={'underline'}
                  href="https://twitter.com/ConcaveFi"
                  target="_blank"
                >
                  @ConcaveFi
                </a>
                ) and{' '}
                <a
                  href="https://opensea.io/collection/the-colors-dot-art"
                  target="_blank"
                  className={'underline'}
                  style={{ color: '#047c45' }}
                >
                  TheColors.NFT
                </a>{' '}
                Project.
              </p>
              <p className="mb-8 leading-relaxed text-xl font-bold">
                Own a <b>Sync X Colors NFT</b> to qualify for the elusive
                Concave Finance token whitelist and a retroactive airdrop!
              </p>
              <p className="mb-8 leading-relaxed text-xl font-bold">
                Our NFT collection is 100% generated and stored on chain!
              </p>
              <div className="flex justify-center py-2">
                <Link href="/">
                  <button className=" inline-flex border-gray-800 border-4 text-gray-700 bg-green-200 py-2 px-6 focus:outline-none hover:text-gray-900 rounded text-lg">
                    Minting Soon!
                  </button>
                </Link>
                <a
                  href="https://medium.com/@syncxcolors"
                  target="_blank"
                  className="ml-5 inline-flex md:inline-block"
                >
                  <button className="ml-4 inline-flex border-gray-800 border-4 hidden md:inline-block text-gray-700 bg-gray-200 border-0 py-2 px-6 focus:outline-none hover:text-gray-900 rounded text-lg">
                    Learn More
                  </button>
                </a>
              </div>
              <div className="justify-center items-center align-bottom mt-4">
                <a
                  href="https://medium.com/@syncxcolors"
                  target="_blank"
                  className="ml-5 inline-flex md:inline-block"
                >
                  <img
                    className="object-cover object-center rounded items-center"
                    alt="Medium Icon"
                    src="/static/medium-letter.svg"
                    width="42"
                    height="36"
                  />
                </a>
                <a
                  href="https://discord.gg/SejJhQvz"
                  target="_blank"
                  className="ml-5 inline-flex md:inline-block"
                >
                  <img
                    className="object-cover object-center rounded"
                    alt="Discord Icon"
                    src="/static/discord.svg"
                    width="42"
                    height="36"
                  />
                </a>
                <a
                  href="https://twitter.com/syncxcolors"
                  target="_blank"
                  className="ml-5 inline-flex md:inline-block"
                >
                  <img
                    className="object-cover object-center rounded"
                    alt="Twitter Icon"
                    src="/static/twitter.svg"
                    width="42"
                    height="36"
                  />
                </a>
              </div>
            </div>
            <div className="md:mt-2  sm:w-full md:4/6 md:w-4/6 w-5/6">
              <HeroSlider />
            </div>
          </div>
        </div>
        {/*Gallery Section */}
        <div className={styles.gallery}>
          <div className="container px-5 py-24 mx-auto">

            <div className="flex flex-col text-center w-full mb-0">
              <h1 className="title-font sm:text-4xl text-3xl font-black mb-4 py-24">
                GALLERY
              </h1>
            </div>
            <Gallery />
            <div className="flex md:w-1/3 mx-auto justify-center align-top text-center text-xl">
              {/*<div className="p-2 md:w-1/2 w-full">
                <div className="h-full flex items-center p-4 flex-col">
                  <img
                    className="w-full bg-gray-100 object-cover object-center flex-shrink-0"
                    alt="team icon"
                    src="/static/500x500.png"
                    width="500"
                    height="500"
                  />
                  <div className="flex-grow p-5 text-center">
                    <h2 className="text-gray-900 title-font font-bold">XYZ</h2>

                      <p className="text-gray-700 ">Traits XYZ</p>

                  </div>
                </div>
              </div>
              <div className="p-2 md:w-1/2 w-full">
                <div className="h-full flex items-center p-4 flex-col">
                  <img
                    className="w-full bg-gray-100 object-cover object-center flex-shrink-0"
                    alt="team icon"
                    src="/static/500x500.png"
                    width="500"
                    height="500"
                  />
                  <div className="flex-grow p-5 text-center">
                    <h2 className="text-gray-900 title-font font-bold">XYZ</h2>

                      <p className="text-gray-700 ">Traits XYZ</p>

                  </div>
                </div>
              </div>
              <div className="p-2 md:w-1/2 w-full">
                <div className="h-full flex items-center p-4 flex-col">
                  <img
                    className="w-full bg-gray-100 object-cover object-center flex-shrink-0"
                    alt="team icon"
                    src="/static/500x500.png"
                    width="500"
                    height="500"
                  />
                  <div className="flex-grow p-5 text-center">
                    <h2 className="text-gray-900 title-font font-bold">XYZ</h2>

                      <p className="text-gray-700 ">Traits XYZ</p>

                  </div>
                </div>
              </div>
              <div className="p-2 md:w-1/2 w-full">
                <div className="h-full flex items-center p-4 flex-col">
                  <img
                    className="w-full bg-gray-100 object-cover object-center flex-shrink-0"
                    alt="team icon"
                    src="/static/500x500.png"
                    width="500"
                    height="500"
                  />
                  <div className="flex-grow p-5 text-center">
                    <h2 className="text-gray-900 title-font font-bold">XYZ</h2>

                      <p className="text-gray-700 ">Traits XYZ</p>

                  </div>
                </div>
              </div>
              <div className="p-2 md:w-1/2 w-full">
                <div className="h-full flex items-center p-4 flex-col">
                  <img
                    className="w-full bg-gray-100 object-cover object-center flex-shrink-0"
                    alt="team icon"
                    src="/static/500x500.png"
                    width="500"
                    height="500"
                  />
                  <div className="flex-grow p-5 text-center">
                    <h2 className="text-gray-900 title-font font-bold">XYZ</h2>

                      <p className="text-gray-700 ">Traits XYZ</p>

                  </div>
                </div>
              </div>
              <div className="p-2 md:w-1/2 w-full">
                <div className="h-full flex items-center p-4 flex-col">
                  <img
                    className="w-full bg-gray-100 object-cover object-center flex-shrink-0"
                    alt="team icon"
                    src="/static/500x500.png"
                    width="500"
                    height="500"
                  />
                  <div className="flex-grow p-5 text-center">
                    <h2 className="text-gray-900 title-font font-bold">XYZ</h2>

                      <p className="text-gray-700 ">Traits XYZ</p>

                  </div>
                </div>
              </div>
              */}
            </div>
          </div>
        </div>



        {/*Media Section*/}
        <section className="text-gray-700 body-font py-24">
          <div className="container px-5 py-24 mx-auto">
            <div className="flex flex-col text-center w-full mb-20">
              <h1 className="title-font sm:text-4xl text-3xl font-black mb-4 text-gray-900">
                MEDIA
              </h1>
            </div>
            <div className="flex justify-center">
              <div className="p-2 md:w-1/2 w-full">
                <div className={'pr-0 md:pr-6'}>
                <video src="/static/sync.mp4" type="video/mp4" controls/>
              </div>
              </div>
            </div>
          </div>
        </section>
        {/*Team Section*/}
        <section className="text-gray-700 body-font py-24">
          <div className="container px-5 py-24 mx-auto">
            <div className="flex flex-col text-center w-full mb-20">
              <h1 className="title-font sm:text-4xl text-3xl font-black mb-4 text-gray-900">
                OUR TEAM
              </h1>
            </div>
            <div className="flex flex-wrap -m-2 text-xl">
              <div className="p-2 xl:w-1/5 md:w-1/2 w-full">
                <div className="h-full flex items-center border-gray-900 border-4 p-4 bg-gray-300 bg-opacity-50 ">
                  <img
                    className="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-3"
                    alt="team icon"
                    src="/static/picky.jpg"
                    width="90"
                    height="90"
                  />
                  <div className="flex-grow ml-5">
                    <h2 className="text-gray-900 title-font font-bold">
                      picky
                    </h2>
                    <a href="https://twitter.com/pickypxl" target="_blank">
                      <p className="text-gray-700">@pickypxl</p>
                    </a>
                  </div>
                </div>
              </div>
              <div className="p-2 xl:w-1/5 md:w-1/2 w-full">
                <div className="h-full flex items-center border-gray-900 border-4 p-4 bg-gray-300 bg-opacity-50 ">
                  <img
                    className="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-1"
                    alt="team icon"
                    src="/static/cryptog.jpg"
                    width="90"
                    height="90"
                  />
                  <div className="flex-grow ml-5 lg:ml-1 ">
                    <h2 className="lg:text-lg text-gray-900 title-font font-bold">
                      cryptographer87
                    </h2>
                    <a
                      href="https://twitter.com/cryptographer87"
                      target="_blank"
                    >
                      <p style={{ fontSize: '15px' }} className="text-gray-700">
                        @cryptographer87
                      </p>
                    </a>
                  </div>
                </div>
              </div>
              <div className="p-2 xl:w-1/5 md:w-1/2 w-full">
                <div className="h-full w- flex items-center border-gray-900 border-4 p-4 bg-gray-300 bg-opacity-50">
                  <img
                    className="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4"
                    alt="team icon"
                    src="/static/heyjan.jpg"
                    width="90"
                    height="90"
                  />
                  <div className="flex-grow ml-5">
                    <h2 className="text-gray-900 title-font font-bold">
                      heyjan
                    </h2>
                    <a href="https://twitter.com/_janbjj" target="_blank">
                      <p className="text-gray-700">@_janbjj</p>
                    </a>
                  </div>
                </div>
              </div>
              <div className="p-2 xl:w-1/5 md:w-1/2 w-full">
                <div className="h-full flex items-center border-gray-900 border-4 p-4 bg-gray-300 bg-opacity-50">
                  <img
                    className="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4"
                    alt="team icon"
                    src="/static/qbg.jpg"
                    width="90"
                    height="90"
                  />
                  <div className="flex-grow ml-5">
                    <h2 className="text-gray-900 title-font font-bold">qbg</h2>
                    <a href="https://twitter.com/j2gainz" target="_blank">
                      <p className="text-gray-700">@j2gainz</p>
                    </a>
                  </div>
                </div>
              </div>
              <div className="p-2 xl:w-1/5 md:w-1/2 w-full">
                <div className="h-full flex items-center border-gray-900 border-4 p-4 bg-gray-300 bg-opacity-50 ">
                  <img
                    className="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4"
                    alt="team icon"
                    src="/static/blazer.jpg"
                    width="90"
                    height="90"
                  />
                  <div className="flex-grow ml-5">
                    <h2 className="text-gray-900 title-font font-bold">
                      b1azer
                    </h2>
                    <a href="https://twitter.com/b1azer" target="_blank">
                      <p className="text-gray-700">@b1azer</p>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="text-gray-700 body-font py-24 pt-0">
          <div className="container px-5 py-24 mx-auto">
            <div className="flex flex-col text-center w-full mb-20">
              <h1 className="title-font sm:text-4xl text-3xl font-black mb-4 text-gray-900">
                LISTINGS
              </h1>
            </div>
            <div className="flex self-center mx-auto  max-w-4xl flex-wrap justify-center content-center">
              <div className="w-full  lg:w-1/2 mb-10  lg:mb-10 self-center text-center">
                <a
                  href="https://nftcalendar.io/event/sync-x-colors-nft-collection-a-concave-finance-project/"
                  target="_blank"
                  className={
                    'inline-block relative top-5 align-top title-font text-md font-black mb-4 uppercase'
                  }
                >
                  <img
                    className="ml-3 inline object-cover object-center rounded"
                    alt="NFT Calendar"
                    src="/static/nftcalendar-logo.svg"
                    width="100"
                  />
                </a>
              </div>
              <div className="w-full  sm:my-4 mb-10 lg:w-1/2 mb-4 self-center text-center">
                <a
                  href={`https://opensea.com/asset/${process.env.NEXT_PUBLIC_SYNC_CONTRACT}`}
                  target="_blank"
                  className={
                    ' inline-block self-start align-top title-font text-md font-black mb-4 uppercase'
                  }
                >
                  <img width="100" src="/static/opensea.svg" />
                </a>
              </div>
              <div className="w-full  mb-10 lg:mt-10 lg:w-1/2 mb-4 self-center text-center">
                <a
                  href="https://www.earlycoins.io/coin-details/61bf34fb5c05686df9f02bf9"
                  target="_blank"
                  className={
                    'inline-block title-font text-md font-black uppercase'
                  }
                >
                  <img
                    width="250"
                    src="https://www.earlycoins.io/images/header-logo.png"
                  />
                </a>
              </div>
              <div className="w-full  mb-10 lg:mt-10 lg:w-1/2 mb-4 self-center text-center">
                <a
                  href="https://nftprojectlist.com/projects/"
                  target="_blank"
                  className={
                    'inline-block title-font text-md font-black uppercase'
                  }
                >
                  <img
                    width="300"
                    src="https://nftprojectlist.com/wp-content/uploads/2021/08/logo-transparent-300x51.png"
                  />
                </a>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </div>
  )
}
