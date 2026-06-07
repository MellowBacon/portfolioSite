import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

// Pointer-tracking "magnetic" wrapper for buttons and icons.
// Passthrough on touch devices and under prefers-reduced-motion.
export default function Magnetic({ children, strength = 6, className }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 16 })
  const sy = useSpring(y, { stiffness: 220, damping: 16 })

  const fineSupported =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(pointer: fine)').matches

  if (reduced || !fineSupported) {
    return <div className={className}>{children}</div>
  }

  function handleMove(e) {
    const rect = ref.current.getBoundingClientRect()
    const relX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
    const relY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
    x.set(relX * strength)
    y.set(relY * strength)
  }

  function handleLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy, display: 'inline-block' }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {children}
    </motion.div>
  )
}
