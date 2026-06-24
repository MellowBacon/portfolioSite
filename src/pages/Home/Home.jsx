import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageTransition from '../../components/PageTransition/PageTransition'
import HeroSand from '../../components/HeroSand/HeroSand'
import StaggerText from '../../components/motion/StaggerText'
import Reveal from '../../components/motion/Reveal'
import Magnetic from '../../components/motion/Magnetic'
import Marquee from '../../components/motion/Marquee'
import ProjectCard from '../../components/ProjectCard/ProjectCard'
import { getFeatured, getVisibleMediums } from '../../data/projects'
import styles from './Home.module.css'

export default function Home() {
  const featured = getFeatured()

  return (
    <PageTransition>
      {/* Hero */}
      <section className={styles.hero}>
        <HeroSand />
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <motion.p
            className="section-label"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Visual Artist &amp; Digital Creator
          </motion.p>
          <StaggerText text="Noah Bello" className={styles.heroTitle} delay={0.15} />
          <motion.p
            className={styles.intro}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Exploring the intersection of photography, 3D modeling, and interactive media
          </motion.p>
          <motion.div
            className={styles.ctaRow}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
          >
            <Magnetic>
              <Link to="/work" className="btn btn--solid">View Work</Link>
            </Magnetic>
            <Magnetic>
              <Link to="/contact" className="btn">Get in Touch</Link>
            </Magnetic>
          </motion.div>
        </div>
      </section>

      {/* Medium marquee */}
      <Marquee items={getVisibleMediums().map(m => m.label)} />

      {/* Featured Work */}
      <section className={styles.featuredWork}>
        <div className="container">
          <Reveal>
            <div className={styles.sectionHeader}>
              <span className="section-label">Selected projects</span>
              <h2>Featured Work</h2>
            </div>
          </Reveal>
          <div className={styles.projectGrid}>
            {featured.map((project, i) => (
              <Reveal key={project.slug} delay={i * 0.1}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
          <Reveal>
            <Link to="/work" className={styles.allWork}>
              All work <span aria-hidden="true">&rarr;</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* About Preview */}
      <section className={styles.aboutPreview}>
        <div className="container">
          <div className={styles.aboutInner}>
            <Reveal direction="left">
              <img
                src="/assets/images/profile pic.jpg"
                alt="Noah Bello"
                className={styles.aboutImage}
              />
            </Reveal>
            <Reveal direction="right" delay={0.1}>
              <div className={styles.aboutContent}>
                <span className="section-label">About</span>
                <h2>About Me</h2>
                <p>
                  I'm a multimedia artist focused on creating immersive experiences through
                  digital and physical mediums. My work explores the boundaries between
                  reality and digital space.
                </p>
                <Magnetic>
                  <Link to="/about" className="btn">Learn More</Link>
                </Magnetic>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
