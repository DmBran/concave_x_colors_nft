import Link from 'next/link'
import { useRouter } from 'next/router'
import { Balances } from '../components/balances'
import { Footer } from '../components/footer'
import { MetaHead } from '../components/head'
import { Navbar } from '../components/navbar'
import styles from '../styles/meme.module.css'

export default function Balance() {
  const { query } = useRouter()

  return (
    <div className={'relative'}>
      <div className={styles.mainContainer}>
        <MetaHead />
        <Navbar />
        <div className={styles.container}>
          <div className={styles.main}>
            <main className={'relative container mx-auto'}>
              <div className="text-left align-left ">
                <nav className="border-gray-800 border-b-0 justify-start flex flex-row">
                  <Link prefetch={false} href={`/stake`}>
                    <button className={`${styles.menuItem}`}>
                      Stake Colors
                    </button>
                  </Link>
                  {/* <Link prefetch={false} href={`/unstake`}>
                    <button className={`${styles.menuItem}`}>
                      Unstake Colors
                    </button>
                  </Link> */}
                  <Link prefetch={false} href={`/balances`}>
                    <button
                      className={`${styles.menuItem} ${styles.menuActive}`}
                    >
                      Unstake &amp; Claim Royalties
                    </button>
                  </Link>
                </nav>
              </div>
              <div
                className={
                  'bg-white  border-gray-800 border-8 relative container mx-auto flex px-5 py-6 lg:py-24 md:flex-row flex-col items-center'
                }
              >
                <Balances />
              </div>
            </main>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  )
}
