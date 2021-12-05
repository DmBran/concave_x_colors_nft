import styles from '../styles/meme.module.css'

export const Footer = () => {
    return (
        <footer className={styles.footer}>
            <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className={'lowercase py-10'}
            >
                Made with Love - Concave Finance Discord
            </a>
        </footer>
    )
}