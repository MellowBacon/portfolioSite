import { useState } from 'react'
import PageTransition from '../../components/PageTransition/PageTransition'
import ScrollReveal from '../../components/ScrollReveal/ScrollReveal'
import Lightbox from '../../components/Lightbox/Lightbox'

const PHOTOS = [
  {
    thumb: '/assets/images/photography/thumbnails/DSC03226_Thumb.jpg',
    full: '/assets/images/photography/DSC03226_Original.jpg',
    caption: 'Leaf Feeling',
  },
  {
    thumb: '/assets/images/photography/thumbnails/DSC03183_Thumb.jpg',
    full: '/assets/images/photography/DSC03183_Original.jpg',
    caption: 'Moss Highway',
  },
  {
    thumb: '/assets/images/photography/thumbnails/DSC03230_Thumb.jpg',
    full: '/assets/images/photography/DSC03230_Original.jpg',
    caption: 'Lone Berry',
  },
]

export default function Photography() {
  const [lightboxSrc, setLightboxSrc] = useState(null)

  return (
    <PageTransition>
      <div style={{ paddingTop: '80px', background: '#fff' }}>
        <ScrollReveal>
          <section className="project-intro" style={{ paddingTop: '20px' }}>
            <div className="intro-text">
              <h2>Photography</h2>
              <p>
                These photographs explore the quieter details of the natural world — the
                textures, patterns, and moments that are easy to overlook. Shot in the
                Pacific Northwest, the series focuses on abstracted organic forms: moss,
                leaves, berries, and the subtle geometry of the forest floor.
              </p>
              <p>
                Each image is a close observation, an attempt to find something unfamiliar
                in the deeply familiar. Replace this text with your own words about your
                photography practice and what draws you to these subjects.
              </p>
            </div>
            <div className="intro-image">
              <figure>
                <img
                  src="/assets/images/photography/thumbnails/DSC03183_Thumb.jpg"
                  alt="Moss Highway"
                />
                <figcaption>Moss Highway</figcaption>
              </figure>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <section className="photo-wall">
            <h2>Photography</h2>
            <div className="gallery">
              {PHOTOS.map((p) => (
                <figure key={p.full} onClick={() => setLightboxSrc(p.full)}>
                  <img src={p.thumb} alt={p.caption} />
                  <figcaption>{p.caption}</figcaption>
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
