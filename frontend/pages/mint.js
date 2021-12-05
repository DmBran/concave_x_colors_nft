import styles from '../styles/meme.module.css'
import { Navbar } from '../components/navbar'
import { Footer } from '../components/footer'
import { MetaHead } from '../components/head'
import { Minter } from '../components/minter'

export default function Mint() {
  function componentDidMount() {
    document.querySelector("body").classList.add('body')
  }

  return (
    <div className={styles.mainContainer}>
      <MetaHead />
      <Navbar />
      <div className={styles.container}>
        <div className={styles.main}>
          <main className={'pb-4 pt-10 mx-auto mt-10 flex flex-1 center-items'}>
              <Minter />
          </main>
        </div>
        <Footer />
      </div>
    </div>
  )
}