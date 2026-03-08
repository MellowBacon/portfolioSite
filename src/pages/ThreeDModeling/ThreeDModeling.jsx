import { useState } from 'react'
import PageTransition from '../../components/PageTransition/PageTransition'
import ScrollReveal from '../../components/ScrollReveal/ScrollReveal'
import Lightbox from '../../components/Lightbox/Lightbox'

const MODELS = [
  {
    thumb: '/assets/images/3d-modeling/thumbnails/fidgettoonlines_Thumb.png',
    full: '/assets/images/3d-modeling/fidgettoonlines.png',
    caption: 'Toon Fidgets',
  },
  {
    thumb: '/assets/images/3d-modeling/thumbnails/Jelly_Thumb.png',
    full: '/assets/images/3d-modeling/Jelly.png',
    caption: 'Jellies in Glass',
  },
  {
    thumb: '/assets/images/3d-modeling/thumbnails/LesPaul_Thumb.jpg',
    full: '/assets/images/3d-modeling/Les Paul.jpg',
    caption: 'Les Paul',
  },
]

export default function ThreeDModeling() {
  const [lightboxSrc, setLightboxSrc] = useState(null)

  return (
    <PageTransition>
      <div style={{ paddingTop: '80px', background: '#fff' }}>
        <ScrollReveal>
          <section className="project-intro" style={{ paddingTop: '20px' }}>
            <div className="intro-text">
              <h2>3D Modeling</h2>
              <p>
                This work spans a range of styles and subjects — from toon-shaded fidget
                toys to glass jellies and a detailed Les Paul guitar model. Each piece
                explores a different aspect of form, material, and rendering.
              </p>
              <p>
                The process involves modeling, UV unwrapping, texturing, and lighting in
                Blender. Replace this text with your own description of your 3D modeling
                practice, tools, and what draws you to these particular subjects.
              </p>
            </div>
            <div className="intro-image">
              <figure>
                <img
                  src="/assets/images/3d-modeling/thumbnails/fidgettoonlines_Thumb.png"
                  alt="Toon Fidgets"
                />
                <figcaption>Toon Fidgets</figcaption>
              </figure>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <section className="photo-wall">
            <h2>3D Modeling</h2>
            <div className="gallery">
              {MODELS.map((m) => (
                <figure key={m.full} onClick={() => setLightboxSrc(m.full)}>
                  <img src={m.thumb} alt={m.caption} />
                  <figcaption>{m.caption}</figcaption>
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
