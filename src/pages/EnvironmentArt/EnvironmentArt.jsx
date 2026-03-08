import { useState } from 'react'
import PageTransition from '../../components/PageTransition/PageTransition'
import ScrollReveal from '../../components/ScrollReveal/ScrollReveal'
import Lightbox from '../../components/Lightbox/Lightbox'

const ENVS = [
  {
    thumb: '/assets/images/environment-art/thumbnails/ToadallyDreadful_Thumb.jpg',
    full: '/assets/images/environment-art/Toadally Dreadful.jpg',
    caption: 'Camper Cabins',
  },
  {
    thumb: '/assets/images/environment-art/thumbnails/ToadallyDreadful2_Thumb.jpg',
    full: '/assets/images/environment-art/Toadally Dreadful 2.jpg',
    caption: 'Lake Scene',
  },
  {
    thumb: '/assets/images/environment-art/thumbnails/TD3_Thumb.png',
    full: '/assets/images/environment-art/TD3.png',
    caption: 'Cliffs, Rocks, and Trees',
  },
]

export default function EnvironmentArt() {
  const [lightboxSrc, setLightboxSrc] = useState(null)

  return (
    <PageTransition>
      <div style={{ paddingTop: '80px', background: '#fff' }}>
        <ScrollReveal>
          <section className="project-intro" style={{ paddingTop: '20px' }}>
            <div className="intro-text">
              <h2>Environment &amp; Game Art</h2>
              <p>
                These environments were created for <em>Toadally Dreadful</em>, a game
                project built in Unity. The scenes include a campsite with cabins, a
                lakeside setting, and natural terrain with cliffs and trees — all designed
                to establish tone and atmosphere for the game world.
              </p>
              <p>
                Assets were built with a mix of original modeling and kit-bashing, then
                lit and composed in-engine. Replace this text with your own notes on the
                project, your workflow, and the design decisions behind the environments.
              </p>
            </div>
            <div className="intro-image">
              <figure>
                <img
                  src="/assets/images/environment-art/thumbnails/ToadallyDreadful_Thumb.jpg"
                  alt="Camper Cabins"
                />
                <figcaption>Camper Cabins — Toadally Dreadful</figcaption>
              </figure>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <section className="photo-wall">
            <h2>Environment &amp; Game Art</h2>
            <div className="gallery">
              {ENVS.map((e) => (
                <figure key={e.full} onClick={() => setLightboxSrc(e.full)}>
                  <img src={e.thumb} alt={e.caption} />
                  <figcaption>{e.caption}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        </ScrollReveal>
      </div>

      <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
    </PageTransition>
  )
}
