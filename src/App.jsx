import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home'
import Work from './pages/Work/Work'
import Project from './pages/Project/Project'
import About from './pages/About/About'
import Contact from './pages/Contact/Contact'
import useLenis from './hooks/useLenis'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  const location = useLocation()
  useLenis()

  return (
    <MotionConfig reducedMotion="user">
      <ScrollToTop />
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/work/:slug" element={<Project />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Legacy routes -> new structure */}
          <Route path="/photogrammetry" element={<Navigate to="/work/radiant-overgrowth" replace />} />
          <Route path="/3d-modeling" element={<Navigate to="/work/3d-models" replace />} />
          <Route path="/video-art" element={<Navigate to="/work?medium=video" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </MotionConfig>
  )
}
