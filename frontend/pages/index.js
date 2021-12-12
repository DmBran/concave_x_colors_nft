import styles from '../styles/meme.module.css'
import { Navbar } from '../components/navbar'
import { Footer } from '../components/footer'
import { MetaHead } from '../components/head'
import Link from 'next/link';
import Countdown from 'react-countdown';

export default function Home() {
  // Renderer callback with condition
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <Link href="/mint"><a>MINT NOW</a></Link>;
    } else {
      // Render a countdown
      return <div className="center-text text-center">
        <p className="uppercase">Minting starts in</p>
        <span>
          {days.toString().padStart(2, '0')}:
          {hours.toString().padStart(2, '0')}:
          {minutes.toString().padStart(2, '0')}:
          {seconds.toString().padStart(2, '0')}
        </span>
      </div>
    }
  };

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
          <div className={styles.mintButton}>
            <Countdown date={new Date('2021-12-22 00:00:00')} renderer={renderer} />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  )
}