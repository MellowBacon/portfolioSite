import { motion } from 'framer-motion'
import ProjectCard from '../ProjectCard/ProjectCard'
import styles from './WorkGrid.module.css'

export default function WorkGrid({ projects, filterKey }) {
  return (
    // Keyed on the active filter so the whole grid cross-fades when the filter
    // changes. Deliberately NOT an AnimatePresence + `layout` setup: a nested
    // presence inside a page wrapped by the route-level `mode="wait"`
    // AnimatePresence (App.jsx) can fail to report exit completion, which
    // hangs the outgoing page and blocks the next route from mounting.
    <motion.div
      key={filterKey}
      className={styles.grid}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {projects.map((project, i) => (
        <motion.div
          key={project.slug}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 24, delay: i * 0.04 }}
        >
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </motion.div>
  )
}
