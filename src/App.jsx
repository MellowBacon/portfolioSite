import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home'
import Photography from './pages/Photography/Photography'
import Photogrammetry from './pages/Photogrammetry/Photogrammetry'
import ThreeDModeling from './pages/ThreeDModeling/ThreeDModeling'
import EnvironmentArt from './pages/EnvironmentArt/EnvironmentArt'
import VideoArt from './pages/VideoArt/VideoArt'
import About from './pages/About/About'
import Contact from './pages/Contact/Contact'
import useLenis from './hooks/useLenis'

export default function App() {
  const location = useLocation()
  useLenis()

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/photography" element={<Photography />} />
          <Route path="/photogrammetry" element={<Photogrammetry />} />
          <Route path="/3d-modeling" element={<ThreeDModeling />} />
          <Route path="/environment-art" element={<EnvironmentArt />} />
          <Route path="/video-art" element={<VideoArt />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </>
  )
}
