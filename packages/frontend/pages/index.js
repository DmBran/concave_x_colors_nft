import Link from 'next/link'
import Countdown from 'react-countdown'
import { Footer } from '../components/footer'
import { MetaHead } from '../components/head'
import { Navbar } from '../components/navbar'
import styles from '../styles/meme.module.css'

export default function Home() {
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
              <Countdown
                date={new Date('2021-12-24 12:00:00')}
                renderer={renderer}
              />
            </div>
          </div>
          <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col bg-gray-300 bg-opacity-50 items-center border-gray-800 border-8">
            <div className="lg:flex-grow  md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
              <h1 className="title-font text-center sm:text-4xl text-3xl mb-4 font-black text-gray-900 pt-2">
                SYNC X COLORS
              </h1>
              <p className="mb-8 leading-relaxed text-xl font-bold">
                Sync X Colors is the ultimate collaboration between Concave
                Finance Community Members and TheColors.NFT Project.
              </p>
              <p className="mb-8 leading-relaxed text-xl font-bold">
                Own a <b>Sync X Colors NFT</b> to qualify for the ever elusive
                Concave Finance token whitelist and a retroactive airdrop.
                WAGMI!
              </p>
              <p className="mb-8 leading-relaxed text-xl font-bold">
                Our NFT collection is 100% generated and stored on chain!
              </p>
              <div className="flex justify-center py-2">
                <Link href="/">
                  <button className="ml-4 inline-flex border-gray-800 border-4 text-gray-700 bg-green-200 py-2 px-6 focus:outline-none hover:text-gray-900 rounded text-lg">
                    Mint an NFT
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
                    src="data:img/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0yNCAyNGgtMjR2LTI0aDI0djI0em0tNC4wMy01LjY0OXYtLjI2OWwtMS4yNDctMS4yMjRjLS4xMS0uMDg0LS4xNjUtLjIyMi0uMTQyLS4zNTl2LTguOTk4Yy0uMDIzLS4xMzcuMDMyLS4yNzUuMTQyLS4zNTlsMS4yNzctMS4yMjR2LS4yNjloLTQuNDIybC0zLjE1MiA3Ljg2My0zLjU4Ni03Ljg2M2gtNC42Mzh2LjI2OWwxLjQ5NCAxLjc5OWMuMTQ2LjEzMy4yMjEuMzI3LjIwMS41MjN2Ny4wNzJjLjA0NC4yNTUtLjAzNy41MTYtLjIxNi43MDJsLTEuNjgxIDIuMDM4di4yNjloNC43NjZ2LS4yNjlsLTEuNjgxLTIuMDM4Yy0uMTgxLS4xODYtLjI2Ni0uNDQ1LS4yMzItLjcwMnYtNi4xMTZsNC4xODMgOS4xMjVoLjQ4NmwzLjU5My05LjEyNXY3LjI3M2MwIC4xOTQgMCAuMjMyLS4xMjcuMzU5bC0xLjI5MiAxLjI1NHYuMjY5aDYuMjc0eiIvPjwvc3ZnPg=="
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
                    src="data:img/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0xOS41NCAwYzEuMzU2IDAgMi40NiAxLjEwNCAyLjQ2IDIuNDcydjIxLjUyOGwtMi41OC0yLjI4LTEuNDUyLTEuMzQ0LTEuNTM2LTEuNDI4LjYzNiAyLjIyaC0xMy42MDhjLTEuMzU2IDAtMi40Ni0xLjEwNC0yLjQ2LTIuNDcydi0xNi4yMjRjMC0xLjM2OCAxLjEwNC0yLjQ3MiAyLjQ2LTIuNDcyaDE2LjA4em0tNC42MzIgMTUuNjcyYzIuNjUyLS4wODQgMy42NzItMS44MjQgMy42NzItMS44MjQgMC0zLjg2NC0xLjcyOC02Ljk5Ni0xLjcyOC02Ljk5Ni0xLjcyOC0xLjI5Ni0zLjM3Mi0xLjI2LTMuMzcyLTEuMjZsLS4xNjguMTkyYzIuMDQuNjI0IDIuOTg4IDEuNTI0IDIuOTg4IDEuNTI0LTEuMjQ4LS42ODQtMi40NzItMS4wMi0zLjYxMi0xLjE1Mi0uODY0LS4wOTYtMS42OTItLjA3Mi0yLjQyNC4wMjRsLS4yMDQuMDI0Yy0uNDIuMDM2LTEuNDQuMTkyLTIuNzI0Ljc1Ni0uNDQ0LjIwNC0uNzA4LjM0OC0uNzA4LjM0OHMuOTk2LS45NDggMy4xNTYtMS41NzJsLS4xMi0uMTQ0cy0xLjY0NC0uMDM2LTMuMzcyIDEuMjZjMCAwLTEuNzI4IDMuMTMyLTEuNzI4IDYuOTk2IDAgMCAxLjAwOCAxLjc0IDMuNjYgMS44MjQgMCAwIC40NDQtLjU0LjgwNC0uOTk2LTEuNTI0LS40NTYtMi4xLTEuNDE2LTIuMS0xLjQxNmwuMzM2LjIwNC4wNDguMDM2LjA0Ny4wMjcuMDE0LjAwNi4wNDcuMDI3Yy4zLjE2OC42LjMuODc2LjQwOC40OTIuMTkyIDEuMDguMzg0IDEuNzY0LjUxNi45LjE2OCAxLjk1Ni4yMjggMy4xMDguMDEyLjU2NC0uMDk2IDEuMTQtLjI2NCAxLjc0LS41MTYuNDItLjE1Ni44ODgtLjM4NCAxLjM4LS43MDggMCAwLS42Ljk4NC0yLjE3MiAxLjQyOC4zNi40NTYuNzkyLjk3Mi43OTIuOTcyem0tNS41OC01LjYwNGMtLjY4NCAwLTEuMjI0LjYtMS4yMjQgMS4zMzIgMCAuNzMyLjU1MiAxLjMzMiAxLjIyNCAxLjMzMi42ODQgMCAxLjIyNC0uNiAxLjIyNC0xLjMzMi4wMTItLjczMi0uNTQtMS4zMzItMS4yMjQtMS4zMzJ6bTQuMzggMGMtLjY4NCAwLTEuMjI0LjYtMS4yMjQgMS4zMzIgMCAuNzMyLjU1MiAxLjMzMiAxLjIyNCAxLjMzMi42ODQgMCAxLjIyNC0uNiAxLjIyNC0xLjMzMiAwLS43MzItLjU0LTEuMzMyLTEuMjI0LTEuMzMyeiIvPjwvc3ZnPg=="
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
                    src="data:img/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGhlaWdodD0iMTAwJSIgc3R5bGU9ImZpbGwtcnVsZTpldmVub2RkO2NsaXAtcnVsZTpldmVub2RkO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoyOyIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgd2lkdGg9IjEwMCUiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6c2VyaWY9Imh0dHA6Ly93d3cuc2VyaWYuY29tLyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxwYXRoIGQ9Ik00NDkuNDQ2LDBjMzQuNTI1LDAgNjIuNTU0LDI4LjAzIDYyLjU1NCw2Mi41NTRsMCwzODYuODkyYzAsMzQuNTI0IC0yOC4wMyw2Mi41NTQgLTYyLjU1NCw2Mi41NTRsLTM4Ni44OTIsMGMtMzQuNTI0LDAgLTYyLjU1NCwtMjguMDMgLTYyLjU1NCwtNjIuNTU0bDAsLTM4Ni44OTJjMCwtMzQuNTI0IDI4LjAyOSwtNjIuNTU0IDYyLjU1NCwtNjIuNTU0bDM4Ni44OTIsMFptLTI1My45MjcsNDI0LjU0NGMxMzUuOTM5LDAgMjEwLjI2OCwtMTEyLjY0MyAyMTAuMjY4LC0yMTAuMjY4YzAsLTMuMjE4IDAsLTYuNDM3IC0wLjE1MywtOS41MDJjMTQuNDA2LC0xMC40MjEgMjYuOTczLC0yMy40NDggMzYuOTM1LC0zOC4zMTRjLTEzLjE4LDUuODI0IC0yNy40MzMsOS44MDkgLTQyLjQ1MiwxMS42NDhjMTUuMzI2LC05LjE5NiAyNi45NzMsLTIzLjYwMiAzMi40OSwtNDAuOTJjLTE0LjI1Miw4LjQyOSAtMzAuMDM4LDE0LjU2IC00Ni44OTYsMTcuOTMxYy0xMy40ODcsLTE0LjQwNiAtMzIuNjQ0LC0yMy4yOTUgLTUzLjk0NiwtMjMuMjk1Yy00MC43NjcsMCAtNzMuODcsMzMuMTA0IC03My44Nyw3My44N2MwLDUuODI0IDAuNjEzLDExLjQ5NCAxLjk5MiwxNi44NThjLTYxLjQ1NiwtMy4wNjUgLTExNS44NjIsLTMyLjQ5IC0xNTIuMzM3LC03Ny4yNDFjLTYuMjg0LDEwLjg4MSAtOS45NjIsMjMuNjAxIC05Ljk2MiwzNy4wODhjMCwyNS41OTQgMTMuMDI3LDQ4LjI3NiAzMi45NSw2MS40NTZjLTEyLjEwNywtMC4zMDcgLTIzLjQ0OCwtMy42NzggLTMzLjQxLC05LjE5NmwwLDAuOTJjMCwzNS44NjIgMjUuNDQxLDY1LjU5NCA1OS4zMTEsNzIuNDljLTYuMTMsMS42ODYgLTEyLjcyLDIuNjA2IC0xOS40NjQsMi42MDZjLTQuNzUxLDAgLTkuMzQ4LC0wLjQ2IC0xMy45NDYsLTEuMzhjOS4zNDksMjkuNDI2IDM2LjYyOCw1MC43MjggNjguOTY1LDUxLjM0MWMtMjUuMjg3LDE5Ljc3MSAtNTcuMTY0LDMxLjU3MSAtOTEuOCwzMS41NzFjLTUuOTc3LDAgLTExLjgwMSwtMC4zMDYgLTE3LjYyNSwtMS4wNzNjMzIuMzM3LDIxLjE1IDcxLjI2NCwzMy40MSAxMTIuOTUsMzMuNDFaIi8+PC9zdmc+"
                    width="42"
                    height="36"
                  />
                </a>
              </div>
            </div>
            <div className="lg:max-w-lg m-0 lg:w-full md:w-1/2 w-5/6">
              <img
                className="object-cover object-center rounded"
                alt="hero img"
                src="/static/500x500.png"
                width="500"
                height="500"
              />
            </div>
          </div>
        </div>
        <div className={styles.gallery}>
          <div className="container px-5 py-24 mx-auto">
            <div className="flex flex-col text-center w-full mb-0">
              <h1 className="title-font sm:text-4xl text-3xl font-black mb-4">
                GALLERY COMING SOON!
              </h1>
              <h1 className="title-font sm:text-xl text-xl font-black mb-4">
                CHECK BACK TOMORROW!
              </h1>
            </div>
            <div className="flex text-center center-text flex-wrap text-xl">
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
        {/*Team Section*/}
        <section className="text-gray-700 body-font py-24">
          <div className="container px-5 py-24 mx-auto">
            <div className="flex flex-col text-center w-full mb-20">
              <h1 className="title-font sm:text-4xl text-3xl font-black mb-4 text-gray-900">
                OUR TEAM
              </h1>
            </div>
            <div className="flex flex-wrap -m-2 text-xl">
              <div className="p-2 lg:w-1/5 md:w-1/2 w-full">
                <div className="h-full flex items-center border-gray-900 border-4 p-4 bg-gray-300 bg-opacity-50 ">
                  <img
                    className="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4"
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
              <div className="p-2 lg:w-1/5 md:w-1/2 w-full">
                <div className="h-full flex items-center border-gray-900 border-4 p-4 bg-gray-300 bg-opacity-50 ">
                  <img
                    className="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4"
                    alt="team icon"
                    src="/static/cryptog.jpg"
                    width="90"
                    height="90"
                  />
                  <div className="flex-grow ml-5">
                    <h2 className="text-gray-900 title-font font-bold">
                      cryptographer87
                    </h2>
                    <a href="https://twitter.com/colin_gbc" target="_blank">
                      <p className="text-gray-700">@colin_gbc</p>
                    </a>
                  </div>
                </div>
              </div>
              <div className="p-2 lg:w-1/5 md:w-1/2 w-full">
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
              <div className="p-2 lg:w-1/5 md:w-1/2 w-full">
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
              <div className="p-2 lg:w-1/5 md:w-1/2 w-full">
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
            <div className={'flex justify-center'}>
              <div
                className={
                  'flex w-1/2 flex-wrap content-center items-center justify-center'
                }
              >
                <div className={'flex align-top align'}>
                  <a
                    href="https://nftcalendar.io/event/sync-x-colors-nft-collection-a-concave-finance-project/"
                    target="_blank"
                    className={
                      'mx-12 relative top-5 align-top title-font text-md font-black mb-4 uppercase'
                    }
                  >
                    <img
                      className="ml-3 inline object-cover object-center rounded"
                      alt="NFT Calendar"
                      src="/static/nftcalendar-logo.svg"
                      width="100"
                    />
                  </a>
                  <a
                    href={`https://opensea.com/asset/${process.env.NEXT_PUBLIC_SYNC_CONTRACT}`}
                    target="_blank"
                    className={
                      'mx-12 self-start align-top title-font text-md font-black mb-4 uppercase'
                    }
                  >
                    <img width="100" src="/static/opensea.svg" />
                  </a>
                </div>
                <div className={' mt-20 flex align-top align'}>
                  <div className={'mx-12 self-center '}>
                    <a
                      href="https://www.earlycoins.io/coin-details/61bf34fb5c05686df9f02bf9"
                      target="_blank"
                      className={'title-font text-md font-black uppercase'}
                    >
                      <img
                        width="250"
                        src="https://www.earlycoins.io/images/header-logo.png"
                      />
                    </a>
                  </div>
                  <div className={'mx-12 relative  self-center'}>
                    <a
                      href="https://nftprojectlist.com/projects/"
                      target="_blank"
                      className={'title-font text-md font-black uppercase'}
                    >
                      <img
                        width="300"
                        src="https://nftprojectlist.com/wp-content/uploads/2021/08/logo-transparent-300x51.png"
                      />
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
