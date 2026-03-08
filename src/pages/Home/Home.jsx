import { Link } from 'react-router-dom'
import PageTransition from '../../components/PageTransition/PageTransition'
import HeroScene from '../../three/HeroScene'
import ScrollReveal from '../../components/ScrollReveal/ScrollReveal'
import styles from './Home.module.css'

export default function Home() {
  return (
    <PageTransition>
      {/* Hero */}
      <section className={styles.hero}>
        <HeroScene />
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Noah Bello</h1>
          <p className={styles.tagline}>Visual Artist &amp; Digital Creator</p>
          <p className={styles.intro}>
            Exploring the intersection of photography, 3D modeling, and interactive media
          </p>
          <a href="#featured-work" className="btn">View My Work</a>
        </div>
      </section>

      {/* Featured Work */}
      <section id="featured-work" className={styles.featuredWork}>
        <ScrollReveal>
          <div className={styles.sectionHeader}>
            <h2>Featured Work</h2>
            <p>A selection of my recent projects</p>
          </div>
        </ScrollReveal>
        <div className={styles.projectGrid}>
          <ScrollReveal delay={0.1}>
            <div className={styles.projectCard}>
              <div className={styles.projectImage}>
                <img
                  src="/assets/images/photogrammetry/thumbnails/InstaShot1_Thumb.jpg"
                  alt="Gaussian Splat"
                />
              </div>
              <div className={styles.projectInfo}>
                <h3>Radiant Overgrowth</h3>
                <p>An experimental photogrammetry project</p>
                <Link to="/photogrammetry" className="btn">Explore</Link>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className={styles.projectCard}>
              <div className={styles.projectImage}>
                <img
                  src="/assets/images/photography/thumbnails/DSC03183_Thumb.jpg"
                  alt="Photography Project"
                />
              </div>
              <div className={styles.projectInfo}>
                <h3>Photography Series</h3>
                <p>Abstracted nature photography from the PNW.</p>
                <Link to="/photography" className="btn">View Series</Link>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className={styles.projectCard}>
              <div className={styles.projectImage}>
                <img
                  src="/assets/images/video-art/thumbnails/VideoArt.JPG"
                  alt="Video Art"
                />
              </div>
              <div className={styles.projectInfo}>
                <h3>Video Art</h3>
                <p>A collection of video art projects spanning a few different themes.</p>
                <Link to="/video-art" className="btn">Experience</Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* About Preview */}
      <ScrollReveal>
        <section className={styles.aboutPreview}>
          <div className={styles.aboutContent}>
            <h2>About Me</h2>
            <p>
              I'm a multimedia artist focused on creating immersive experiences through
              digital and physical mediums. My work explores the boundaries between
              reality and digital space.
            </p>
            <Link to="/about" className="btn">Learn More</Link>
          </div>
        </section>
      </ScrollReveal>
    </PageTransition>
  )
}
