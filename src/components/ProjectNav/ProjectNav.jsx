import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getAdjacent } from '../../data/projects'
import styles from './ProjectNav.module.css'

function NavCard({ project, dir }) {
  const isNext = dir === 'next'
  return (
    <motion.div
      whileHover={{ x: isNext ? 6 : -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={isNext ? styles.next : styles.prev}
    >
      <Link to={`/work/${project.slug}`} className={styles.link}>
        <span className={styles.dirLabel}>
          {isNext ? 'Next project →' : '← Previous project'}
        </span>
        <span className={styles.title}>{project.title}</span>
      </Link>
    </motion.div>
  )
}

export default function ProjectNav({ slug }) {
  const { prev, next } = getAdjacent(slug)
  if (!prev || !next) return null

  return (
    <nav className={styles.nav} aria-label="Project navigation">
      <div className="container">
        <div className={styles.row}>
          <NavCard project={prev} dir="prev" />
          <NavCard project={next} dir="next" />
        </div>
      </div>
    </nav>
  )
}
