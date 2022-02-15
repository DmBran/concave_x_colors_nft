import Link from 'next/link'
import Countdown from 'react-countdown'
import { Footer } from '../components/footer'
import { MetaHead } from '../components/head'
import { Navbar } from '../components/navbar'
import styles from '../styles/meme.module.css'
import NoSSR from 'react-no-ssr'
import HeroSlider from '../components/heroslider'
import Gallery from '../components/gallery'
import ColorGallery from '../components/colorgallery'

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
          <div className="container mx-auto flex px-5 py-10 md:py-24 lg:flex-row flex-col bg-white items-center border-gray-800 border-8">
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
                  The Colors
                </a>
                .
              </p>
              <p className="mb-8 leading-relaxed text-xl font-bold">
                Own a <b>Sync X Colors NFT</b> to qualify for the elusive
                Concave Finance token whitelist and a retroactive airdrop!
              </p>
              <p className="mb-8 leading-relaxed text-xl font-bold">
                Our NFT collection is 100% generated and stored on chain!
              </p>
              <div className="flex justify-center py-2">
                <Link href="/mint">
                  <button className=" inline-flex border-gray-800 border-4 text-gray-700 bg-green-200 py-2 px-6 focus:outline-none hover:text-gray-900 rounded text-lg">
                    Mint Now!
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
                  href="https://discord.gg/PDwkZZyu2e"
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
            <div className="mt-10 lg:mt-2 w-full md:w-full lg:w-4/6">
              <div className="lg:mr-10" style={{ maxWidth: '600px' }}>
                <HeroSlider />
              </div>
            </div>
          </div>
        </div>
        {/*Gallery Section */}
        <div className={styles.gallery}>
          <div className="container px-5 py-36 mx-auto">
            <div className="flex flex-col text-center w-full pb-12">
              <h1 className="title-font sm:text-4xl text-3xl font-black ">
                RARITIES
              </h1>
              <p className={'text-center mb-3 font-late-500 text-xs'}>
                (colors will vary)
              </p>
            </div>
            <Gallery />
            <div className="mt-20   flex flex-col text-center w-full pb-12">
              <h1 className="title-font sm:text-4xl text-3xl font-black ">
                COLORS
              </h1>
              <p className={'text-center mb-3 font-late-500 text-xs'}>
                (rarities will vary)
              </p>
            </div>
            <ColorGallery />
          </div>
        </div>

        {/*Media Section*/}
        <section className="text-gray-700 body-font py-24">
          <div className="container px-5  mx-auto">
            <div className="flex flex-col text-center w-full mb-20">
              <h1 className="title-font sm:text-4xl text-3xl font-black mb-4 text-gray-900">
                MEDIA
              </h1>
            </div>
            <div className="flex justify-center">
              <div className="p-2 md:w-1/2 w-full">
                <div className={'pr-0 md:pr-6'}>
                  <video src="/static/sync.mp4" type="video/mp4" controls />
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
        <Footer />
      </div>
    </div>
  )
}
