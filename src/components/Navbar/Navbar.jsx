import { useState, useEffect, useRef } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Magnetic from '../motion/Magnetic'
import styles from './Navbar.module.css'

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/work', label: 'Work' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

const SOCIALS = [
  { href: 'https://www.instagram.com/nbello.creates/', icon: '/assets/icons/Instagram.png', label: 'Instagram' },
  { href: 'https://bsky.app/profile/noahbello.bsky.social', icon: '/assets/icons/bluesky.png', label: 'Bluesky' },
  { href: 'https://nbello.itch.io/', icon: '/assets/icons/itchio.png', label: 'Itch.io' },
]

const menuVariants = {
  closed: { opacity: 0, y: -12, transition: { duration: 0.2 } },
  open: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, staggerChildren: 0.05, delayChildren: 0.05 },
  },
}

const menuItemVariants = {
  closed: { opacity: 0, y: -8 },
  open: { opacity: 1, y: 0 },
}

export default function Navbar() {
  const [hidden, setHidden] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const lastScrollY = useRef(0)
  const location = useLocation()

  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY
      const delta = currentScrollY - lastScrollY.current
      if (Math.abs(delta) > 20) {
        setHidden(currentScrollY > lastScrollY.current && currentScrollY > 100)
        lastScrollY.current = currentScrollY
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 768) setMobileOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Which link is currently active (for the sliding underline)
  function isLinkActive(link) {
    if (link.end) return location.pathname === link.to
    return location.pathname.startsWith(link.to)
  }

  return (
    <>
      <motion.nav
        className={styles.nav}
        animate={{ y: hidden && !mobileOpen ? '-100%' : '0%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <Link to="/" className={styles.wordmark}>
          noah bello<span className={styles.dot}>.</span>
        </Link>

        <div className={styles.navLinks}>
          {LINKS.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => isActive ? styles.active : ''}
            >
              {link.label}
              {isLinkActive(link) && (
                <motion.span
                  className={styles.underline}
                  layoutId="navUnderline"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </NavLink>
          ))}
        </div>

        <div className={styles.socialIcons}>
          {SOCIALS.map(s => (
            <Magnetic key={s.href} strength={4}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                <img src={s.icon} alt={s.label} />
              </a>
            </Magnetic>
          ))}
        </div>

        <button
          className={`${styles.menuIcon} ${mobileOpen ? styles.open : ''}`}
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className={styles.mobileMenu}
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {LINKS.map(link => (
              <motion.div key={link.to} variants={menuItemVariants}>
                <NavLink to={link.to} end={link.end} onClick={() => setMobileOpen(false)}>
                  {link.label}
                </NavLink>
              </motion.div>
            ))}
            <motion.div className={styles.mobileSocials} variants={menuItemVariants}>
              {SOCIALS.map(s => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                  <img src={s.icon} alt={s.label} />
                </a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
