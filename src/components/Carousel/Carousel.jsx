import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import styles from './Carousel.module.css'

const variants = {
  enter: (dir) => ({ x: dir > 0 ? '6%' : '-6%', opacity: 0 }),
  center: { x: '0%', opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? '-6%' : '6%', opacity: 0 }),
}

const SWIPE_THRESHOLD = 60 // px of drag needed to change slides
const CLICK_SLOP = 6       // movement under this still counts as a click, not a drag

export default function Carousel({ images, onZoom }) {
  const [[index, direction], setSlide] = useState([0, 0])
  const pointerDownX = useRef(0)
  const reduce = useReducedMotion()

  const paginate = useCallback((newDir) => {
    setSlide(([prev]) => {
      const next = (prev + newDir + images.length) % images.length
      return [next, newDir]
    })
  }, [images.length])

  const goTo = useCallback((i) => {
    setSlide(([prev]) => [i, i > prev ? 1 : -1])
  }, [])

  function handleKeyDown(e) {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      paginate(1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      paginate(-1)
    }
  }

  const transition = reduce
    ? { duration: 0 }
    : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }

  const multiple = images.length > 1

  return (
    <div
      className={styles.container}
      tabIndex={0}
      role="group"
      aria-roledescription="carousel"
      aria-label="Image gallery"
      onKeyDown={handleKeyDown}
    >
      <div className={styles.stage}>
        <AnimatePresence mode="sync" custom={direction} initial={false}>
          <motion.img
            key={index}
            src={images[index]}
            alt={`Image ${index + 1} of ${images.length}`}
            className={styles.slide}
            draggable={false}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
            drag={multiple ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onPointerDown={(e) => { pointerDownX.current = e.clientX }}
            onDragEnd={(e, info) => {
              if (info.offset.x < -SWIPE_THRESHOLD) paginate(1)
              else if (info.offset.x > SWIPE_THRESHOLD) paginate(-1)
            }}
            onClick={(e) => {
              if (onZoom && Math.abs(e.clientX - pointerDownX.current) < CLICK_SLOP) {
                onZoom(images[index])
              }
            }}
          />
        </AnimatePresence>
      </div>

      {multiple && (
        <>
          <button
            className={`${styles.arrow} ${styles.arrowLeft}`}
            onClick={() => paginate(-1)}
            aria-label="Previous image"
          >
            &larr;
          </button>
          <button
            className={`${styles.arrow} ${styles.arrowRight}`}
            onClick={() => paginate(1)}
            aria-label="Next image"
          >
            &rarr;
          </button>
        </>
      )}

      <div className={styles.footer}>
        <span className={styles.counter} aria-live="polite">
          {index + 1} / {images.length}
        </span>
        {multiple && (
          <div className={styles.dots}>
            {images.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === index ? styles.active : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Go to image ${i + 1}`}
                aria-current={i === index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
