import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Magnetic from '../motion/Magnetic'
import styles from './Footer.module.css'

const SOCIALS = [
  { href: 'https://www.instagram.com/nbello.creates/', icon: '/assets/icons/Instagram.png', label: 'Instagram' },
  { href: 'https://bsky.app/profile/noahbello.bsky.social', icon: '/assets/icons/bluesky.png', label: 'Bluesky' },
  { href: 'https://nbello.itch.io/', icon: '/assets/icons/itchio.png', label: 'Itch.io' },
]

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <Link to="/contact" className={styles.cta}>
          Let's talk
          <motion.span
            className={styles.arrow}
            initial={{ x: 0 }}
            whileHover={{ x: 6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            {' '}&rarr;
          </motion.span>
        </Link>

        <div className={styles.row}>
          <nav className={styles.footerNav} aria-label="Footer navigation">
            <Link to="/">Home</Link>
            <Link to="/work">Work</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </nav>

          <div className={styles.footerSocial}>
            {SOCIALS.map(s => (
              <Magnetic key={s.href} strength={4}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                  <img src={s.icon} alt={s.label} />
                </a>
              </Magnetic>
            ))}
          </div>
        </div>

        <p className={styles.footerCopy}>&copy; 2025 Noah Bello</p>
      </div>
    </footer>
  )
}
