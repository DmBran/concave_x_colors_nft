import Link from 'next/link'
import { useRouter } from 'next/router'
import { Footer } from '../components/footer'
import { MetaHead } from '../components/head'
import { Minter } from '../components/minter'
import { Navbar } from '../components/navbar'
import styles from '../styles/meme.module.css'

export default function Mint() {
  const { query } = useRouter()
  const resync = query.tokenID > 0 ? query.tokenID : undefined

  return (
    <div className={'relative'}>
      <div className={styles.mainContainer}>
        <MetaHead />
        <Navbar />
        <div className={styles.container}>
          <div className={`${styles.main}`}>
            <main className={'relative container mx-auto  '}>
              <div className="text-left align-left ">
                <nav className="border-gray-800 border-b-0 justify-start flex flex-row">
                  <Link prefetch={false} href={`/mint`}>
                    <button
                      className={`${styles.menuItem} ${
                        query.tokenID ? '' : styles.menuActive
                      }`}
                    >
                      Mint Syncs
                    </button>
                  </Link>
                  <Link prefetch={false} href={`/resync`}>
                    <button
                      className={`${styles.menuItem} ${
                        query.tokenID ? styles.menuActive : ''
                      } cursor-pointer`}
                    >
                      Recolor Sync
                    </button>
                  </Link>
                </nav>
              </div>
              <div
                className={
                  'bg-white  border-gray-800 border-8 relative container mx-auto flex px-5 py-6 lg:py-24 md:flex-row flex-col items-center'
                }
              >
                <Minter tokenID={query.tokenID} />
              </div>
            </main>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  )
}
