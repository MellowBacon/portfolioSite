import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

const directionMap = {
  up: { y: 32, x: 0 },
  down: { y: -32, x: 0 },
  left: { y: 0, x: -32 },
  right: { y: 0, x: 32 },
  none: { y: 0, x: 0 },
}

// Spring in-view reveal. Successor to ScrollReveal.
export default function Reveal({
  children,
  direction = 'up',
  delay = 0,
  amount = 0.2,
  className,
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount, margin: '0px 0px -8% 0px' })
  const reduced = useReducedMotion()
  const { x, y } = directionMap[direction] ?? directionMap.up

  const hidden = reduced ? { opacity: 0 } : { opacity: 0, x, y }
  const shown = reduced ? { opacity: 1 } : { opacity: 1, x: 0, y: 0 }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={hidden}
      animate={inView ? shown : hidden}
      transition={
        reduced
          ? { duration: 0.4, delay }
          : { type: 'spring', stiffness: 90, damping: 18, delay }
      }
    >
      {children}
    </motion.div>
  )
}
