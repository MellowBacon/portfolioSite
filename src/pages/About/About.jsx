import PageTransition from '../../components/PageTransition/PageTransition'
import StaggerText from '../../components/motion/StaggerText'
import Reveal from '../../components/motion/Reveal'
import styles from './About.module.css'

export default function About() {
  return (
    <PageTransition>
      <div className={`page ${styles.page}`}>
        <div className="container">
          <header className={styles.header}>
            <span className="section-label">About</span>
            <StaggerText text="Noah Bello" className={styles.heading} />
          </header>

          <div className={styles.layout}>
            <Reveal direction="left">
              <img
                src="/assets/images/profile pic.jpg"
                alt="Noah Bello"
                className={styles.portrait}
              />
            </Reveal>

            <div className={styles.bio}>
              <Reveal delay={0.1}>
                <p>
                  Noah Bello's work explores the evolving relationship between the physical
                  and digital. He is drawn to the ways technology shapes perception, distorts
                  memory, and reconfigures the organic into something new. His process often
                  begins with real, scanned environments then shifts into something altered.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <p>
                  By merging organic forms with digital systems, Bello's work explores the
                  shifting boundaries between the physical and virtual. His practice examines
                  how digital reconstruction can alter, distort, or extend the life of natural
                  forms, raising questions about transformation, memory, and perception in an
                  increasingly digitized world.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
