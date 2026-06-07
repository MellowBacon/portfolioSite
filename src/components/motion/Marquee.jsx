import styles from './Marquee.module.css'

// CSS-keyframe marquee: duplicated track translates -50%.
// Pauses on hover; hidden entirely under prefers-reduced-motion (see CSS).
export default function Marquee({ items, separator = '·' }) {
  function Track({ prefix }) {
    return items.map((item, i) => (
      <span key={`${prefix}-${i}`} className={styles.group}>
        <span className={styles.item}>{item}</span>
        <span className={styles.sep} aria-hidden="true">{separator}</span>
      </span>
    ))
  }

  return (
    <div className={styles.marquee} aria-hidden="true">
      <div className={styles.track}>
        <Track prefix="a" />
        <Track prefix="b" />
      </div>
    </div>
  )
}
