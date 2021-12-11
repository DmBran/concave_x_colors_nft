import styles from '../styles/meme.module.css'
import { Navbar } from '../components/navbar'
import { Footer } from '../components/footer'
import { MetaHead } from '../components/head'
import { Minter } from '../components/minter'

export default function Mint(props) {

  return (
    <div className={'relative'}><div className={styles.mainContainer}>
      <div className={styles.container}>
        <div className={styles.main}>
          <main className={styles.modal}>
            <Minter web3Library={props.web3Library} />
          </main>
        </div>
        <Footer />
      </div>
    </div></div>
  )
}