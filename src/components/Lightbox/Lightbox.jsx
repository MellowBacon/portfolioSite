import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './Lightbox.module.css'

export default function Lightbox({ src, caption, onClose }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <AnimatePresence>
      {src && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            &#10005;
          </button>
          <motion.figure
            className={styles.figure}
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            onClick={e => e.stopPropagation()}
          >
            <img src={src} alt={caption ?? 'Expanded view'} className={styles.img} />
            {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
