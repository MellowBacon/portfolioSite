import { useState, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [hidden, setHidden] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const lastScrollY = useRef(0)

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

  const activeClass = ({ isActive }) => isActive ? styles.active : ''

  return (
    <>
      <motion.nav
        className={styles.nav}
        animate={{ y: hidden ? '-100%' : '0%', opacity: hidden ? 0 : 1 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div
          className={`${styles.menuIcon} ${mobileOpen ? styles.open : ''}`}
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </div>

        <div className={styles.navLinks}>
          <NavLink to="/" end className={activeClass}>Home</NavLink>
          <NavLink to="/photogrammetry" className={activeClass}>Exhibitions</NavLink>
          <NavLink to="/3d-modeling" className={activeClass}>3D Modeling</NavLink>
          <NavLink to="/video-art" className={activeClass}>Video Art</NavLink>
          <NavLink to="/about" className={activeClass}>About</NavLink>
          <NavLink to="/contact" className={activeClass}>Contact</NavLink>
        </div>

        <div className={styles.socialIcons}>
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
      </motion.nav>

      {/* Mobile menu */}
      <div className={`${styles.mobileMenu} ${mobileOpen ? styles.show : ''}`}>
        <NavLink to="/" end onClick={() => setMobileOpen(false)}>Home</NavLink>
        <NavLink to="/photogrammetry" onClick={() => setMobileOpen(false)}>Exhibitions</NavLink>
        <NavLink to="/3d-modeling" onClick={() => setMobileOpen(false)}>3D Modeling</NavLink>
        <NavLink to="/video-art" onClick={() => setMobileOpen(false)}>Video Art</NavLink>
        <NavLink to="/about" onClick={() => setMobileOpen(false)}>About</NavLink>
        <NavLink to="/contact" onClick={() => setMobileOpen(false)}>Contact</NavLink>
      </div>
    </>
  )
}
