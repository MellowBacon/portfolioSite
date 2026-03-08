import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './Carousel.module.css'

const variants = {
  enter: (dir) => ({
    x: dir > 0 ? '50%' : '-50%',
    opacity: 0,
    scale: 1.05,
  }),
  center: {
    x: '0%',
    opacity: 1,
    scale: 1,
  },
  exit: (dir) => ({
    x: dir > 0 ? '-50%' : '50%',
    opacity: 0,
    scale: 0.95,
  }),
}

export default function Carousel({ images, interval = 5000 }) {
  const [[index, direction], setSlide] = useState([0, 1])

  const paginate = useCallback((newDir) => {
    setSlide(([prev]) => {
      const next = (prev + newDir + images.length) % images.length
      return [next, newDir]
    })
  }, [images.length])

  useEffect(() => {
    const timer = setInterval(() => paginate(1), interval)
    return () => clearInterval(timer)
  }, [paginate, interval])

  return (
    <div className={styles.container}>
      <AnimatePresence mode="sync" custom={direction}>
        <motion.img
          key={index}
          src={images[index]}
          alt={`Slide ${index + 1}`}
          className={styles.slide}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        />
      </AnimatePresence>
      <div className={styles.dots}>
        {images.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === index ? styles.active : ''}`}
            onClick={() => setSlide([i, i > index ? 1 : -1])}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
