import { useState } from 'react'
import PageTransition from '../../components/PageTransition/PageTransition'
import ScrollReveal from '../../components/ScrollReveal/ScrollReveal'
import Carousel from '../../components/Carousel/Carousel'
import Lightbox from '../../components/Lightbox/Lightbox'
import styles from './Photogrammetry.module.css'

const EXHIBITIONS = [
  {
    title: 'Radiant Overgrowth',
    show: 'Patchwork',
    year: '2025',
    poster: '/assets/images/show-posters/patchwork_poster.JPEG',
    posterAlt: 'Patchwork group show poster',
    statement: [
      `When I think of something that left a strong impression on me, I usually picture it
       floating in black, isolated. The parts I remember most are vivid and detailed, while
       everything around them fades into nothing. Radiant Overgrowth is a visualization of
       that kind of memory — a virtual echo of a strong thought, where certain details remain
       sharp while others dissolve. The work runs in real-time, a simulation built in Unity
       that's constantly moving and shifting views.`,
      `The nine prints come from inside that space. Each one is a rephotograph of a photograph,
       captured from within the simulation, which itself was built from a 3D scan made with a
       camera. Pulled out of motion and into material form, they sit somewhere between
       documentation and residue — reminders of a place that's both constructed and remembered.`,
    ],
    captions: [
      'Radiant Overgrowth, Unity3D, custom-built PC, flatscreen TV, 43.5×24.5", 2024',
      'Radiant Overgrowth (print series), archival inkjet prints from simulation, 10×10" each (framed), 2025',
    ],
    installation: '/assets/images/photogrammetry/radiant-overgrowth/Full.jpg',
    installationAlt: 'Radiant Overgrowth installation view, Patchwork group show',
    images: [1, 6, 7, 8, 9, 12, 15, 17, 22].map(n => `/assets/images/photogrammetry/splats/Splat${n}.jpg`),
  },
]

export default function Exhibitions() {
  const [lightboxSrc, setLightboxSrc] = useState(null)

  return (
    <PageTransition>
      <div className={styles.page}>
      <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />

        <ScrollReveal>
          <header className={styles.pageHeader}>
            <h1>Exhibitions</h1>
            <p>Selected works shown in group and solo exhibitions</p>
          </header>
        </ScrollReveal>

        {EXHIBITIONS.map((ex) => (
          <article key={ex.title}>
            <ScrollReveal>
              <section className={styles.exhibition}>
                <div className={styles.exhibitionHeader}>

                  {/* Poster */}
                  <div className={styles.posterWrap}>
                    <img
                      className={`${styles.poster} ${styles.clickable}`}
                      src={ex.poster}
                      alt={ex.posterAlt}
                      onClick={() => setLightboxSrc(ex.poster)}
                    />
                    <p className={styles.posterCaption}>{ex.show} — {ex.year}</p>
                  </div>

                  {/* Info + statement */}
                  <div className={styles.exhibitionInfo}>
                    <div className={styles.showMeta}>
                      <span className={styles.tag}>{ex.show}</span>
                      <span className={styles.tag}>{ex.year}</span>
                    </div>
                    <h2>{ex.title}</h2>
                    <div className={styles.statement}>
                      {ex.statement.map((p, i) => <p key={i}>{p}</p>)}
                    </div>
                    <div className={styles.workCaption}>
                      {ex.captions.map((c, i) => <span key={i}>{c}</span>)}
                    </div>
                  </div>

                </div>
              </section>
            </ScrollReveal>

            {/* Installation photo */}
            {ex.installation && (
              <ScrollReveal>
                <div className={styles.installationWrap}>
                  <img
                    className={`${styles.installationPhoto} ${styles.clickable}`}
                    src={ex.installation}
                    alt={ex.installationAlt}
                    onClick={() => setLightboxSrc(ex.installation)}
                  />
                  <p className={styles.installationCaption}>Installation view — {ex.show}, {ex.year}</p>
                </div>
              </ScrollReveal>
            )}

            {/* Carousel */}
            <div className={styles.carouselBand}>
              <p className={styles.carouselLabel}>Print series — {ex.images.length} works</p>
              <Carousel images={ex.images} />
            </div>
          </article>
        ))}

      </div>
    </PageTransition>
  )
}
