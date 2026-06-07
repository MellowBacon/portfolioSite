import { motion, AnimatePresence } from 'framer-motion'
import ProjectCard from '../ProjectCard/ProjectCard'
import styles from './WorkGrid.module.css'

export default function WorkGrid({ projects }) {
  return (
    <motion.div className={styles.grid} layout>
      <AnimatePresence mode="popLayout">
        {projects.map(project => (
          <motion.div
            key={project.slug}
            layout
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 200, damping: 24 }}
          >
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
