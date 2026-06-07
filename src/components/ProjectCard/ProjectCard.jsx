import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MEDIUM_LABELS } from '../../data/projects'
import styles from './ProjectCard.module.css'

export default function ProjectCard({ project }) {
  return (
    <motion.div
      whileHover={{ y: -6, rotate: -0.4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={styles.cardWrap}
    >
      <Link to={`/work/${project.slug}`} className={styles.card}>
        <div className={styles.frame}>
          {project.thumbnail ? (
            <motion.img
              src={project.thumbnail}
              alt={project.thumbnailAlt ?? project.title}
              loading="lazy"
              whileHover={{ scale: 1.04 }}
              transition={{ type: 'spring', stiffness: 200, damping: 24 }}
            />
          ) : (
            <div className={styles.typographic}>
              <span className={styles.typoMedium}>{MEDIUM_LABELS[project.medium]}</span>
              <span className={styles.typoTitle}>{project.title}</span>
            </div>
          )}
        </div>
        <div className={styles.info}>
          <span className={styles.medium}>{MEDIUM_LABELS[project.medium]}</span>
          <h3 className={styles.title}>{project.title}</h3>
          <span className={styles.year}>{project.year}</span>
        </div>
      </Link>
    </motion.div>
  )
}
