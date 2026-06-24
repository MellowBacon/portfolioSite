import { useState, useRef, useLayoutEffect } from 'react'
import styles from './Marquee.module.css'

// CSS-keyframe marquee. The track is filled with N identical "passes" of the
// item list and scrolls left by exactly one pass, then loops — since every pass
// is identical, the jump back is seamless. N is measured so the track always
// overflows the container by at least a pass; otherwise short content leaves a
// gap on wide screens (the loop "reappears" mid-scroll). Shifting by one pass
// (not a fixed %) also keeps the scroll speed constant across screen widths.
// Pauses on hover; hidden entirely under prefers-reduced-motion (see CSS).
export default function Marquee({ items, separator = '·' }) {
  const marqueeRef = useRef(null)
  const passRef = useRef(null)
  const [passes, setPasses] = useState(3)

  useLayoutEffect(() => {
    function recompute() {
      const m = marqueeRef.current
      const p = passRef.current
      if (!m || !p) return
      const passW = p.offsetWidth
      if (!passW) return // hidden (reduced-motion) or not laid out yet
      // Enough passes to overflow the container by a full pass on either side.
      setPasses(Math.ceil(m.offsetWidth / passW) + 2)
    }
    recompute()
    window.addEventListener('resize', recompute)
    return () => window.removeEventListener('resize', recompute)
  }, [items])

  return (
    <div className={styles.marquee} aria-hidden="true" ref={marqueeRef}>
      <div className={styles.track} style={{ '--passes': passes }}>
        {Array.from({ length: passes }).map((_, p) => (
          <span className={styles.pass} key={p} ref={p === 0 ? passRef : undefined}>
            {items.map((item, i) => (
              <span key={i} className={styles.group}>
                <span className={styles.item}>{item}</span>
                <span className={styles.sep} aria-hidden="true">{separator}</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  )
}
