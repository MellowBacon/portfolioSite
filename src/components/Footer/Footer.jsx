import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <nav className={styles.footerNav} aria-label="Footer navigation">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/photogrammetry">Exhibitions</Link>
          <Link to="/3d-modeling">3D Modeling</Link>
          <Link to="/video-art">Video Art</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        <div className={styles.footerSocial}>
          <a href="https://www.instagram.com/nbello.creates/" target="_blank" rel="noopener noreferrer">
            <img src="/assets/icons/Instagram.png" alt="Instagram" />
          </a>
          <a href="https://bsky.app/profile/noahbello.bsky.social" target="_blank" rel="noopener noreferrer">
            <img src="/assets/icons/bluesky.png" alt="Bluesky" />
          </a>
          <a href="https://nbello.itch.io/" target="_blank" rel="noopener noreferrer">
            <img src="/assets/icons/itchio.png" alt="Itch.io" />
          </a>
        </div>
        <p className={styles.footerCopy}>&copy; 2025 Noah Bello</p>
      </div>
    </footer>
  )
}
