import { motion, useReducedMotion } from 'framer-motion'

// Splits text into words that rise in with a stagger, masked by overflow.
// Renders as the element given by `as` (default h1).
export default function StaggerText({
  text,
  as: Tag = 'h1',
  className,
  delay = 0,
  ...rest
}) {
  const reduced = useReducedMotion()
  const words = String(text).split(' ')

  if (reduced) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay }}
      >
        <Tag className={className} {...rest}>{text}</Tag>
      </motion.div>
    )
  }

  return (
    <Tag className={className} aria-label={text} {...rest}>
      {words.map((word, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}
        >
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '0.9em', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 110,
              damping: 16,
              delay: delay + i * 0.045,
            }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
