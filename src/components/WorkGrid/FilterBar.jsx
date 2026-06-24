import { motion } from 'framer-motion'
import { getVisibleMediums } from '../../data/projects'
import styles from './FilterBar.module.css'

const FILTERS = [{ key: 'all', label: 'All' }, ...getVisibleMediums()]

export default function FilterBar({ active, onChange }) {
  return (
    <div className={styles.bar} role="tablist" aria-label="Filter projects by medium">
      {FILTERS.map(f => {
        const isActive = active === f.key
        return (
          <button
            key={f.key}
            role="tab"
            aria-selected={isActive}
            className={`${styles.pill} ${isActive ? styles.active : ''}`}
            onClick={() => onChange(f.key)}
          >
            {isActive && (
              <motion.span
                className={styles.pillBg}
                layoutId="filterPill"
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            )}
            <span className={styles.pillLabel}>{f.label}</span>
          </button>
        )
      })}
    </div>
  )
}
