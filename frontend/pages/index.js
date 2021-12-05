import styles from '../styles/meme.module.css'
import { Navbar } from '../components/navbar'
import { Footer } from '../components/footer'
import { MetaHead } from '../components/head'
import Link from 'next/link';

export default function Home() {
  function componentDidMount() {
    document.querySelector("body").classList.add('body')
  }

  return (
    <div className={styles.mainContainer}>
      <MetaHead />
      <Navbar />
      <div className={styles.container}>
        <div className={styles.hero}></div>
        <div className={styles.herotext}>
            100% on the Blockchain
        </div>

        <div className={styles.herotext2}>
            A different kind of NFT
        </div>

        <div className={styles.mintHome}>
          <Link href="/mint">
            <a className={"bg-green-500 text-black mx-5 hover:bg-green-700 font-bold py-2 px-4 rounded"}>SYNC NOW</a>
          </Link>
        </div>
        <Footer />
      </div>
    </div>
  )
}