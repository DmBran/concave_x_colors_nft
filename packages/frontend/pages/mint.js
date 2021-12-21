import { useRouter } from 'next/router'
import { Footer } from '../components/footer'
import { MetaHead } from '../components/head'
import { Minter } from '../components/minter'
import { Navbar } from '../components/navbar'
import styles from '../styles/meme.module.css'

export default function Mint() {
  const { query } = useRouter()

  return (
    <div className={'relative'}>
      <div className={styles.mainContainer}>
        <MetaHead />
        <Navbar />
        <div className={styles.container}>
          <div className={styles.main}>
            <main
              className={
                'container mx-auto flex px-5 py-6 lg:py-24 md:flex-row flex-col bg-gray-300 bg-opacity-50 items-center border-gray-800 border-8'
              }
            >
              <Minter tokenID={query.tokenID} />
            </main>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  )
}
