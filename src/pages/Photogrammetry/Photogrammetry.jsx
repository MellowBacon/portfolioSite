import PageTransition from '../../components/PageTransition/PageTransition'
import ScrollReveal from '../../components/ScrollReveal/ScrollReveal'
import Carousel from '../../components/Carousel/Carousel'

const SPLATS = Array.from(
  { length: 25 },
  (_, i) => `/assets/images/photogrammetry/splats/Splat${i + 1}.jpg`
)

export default function Photogrammetry() {
  return (
    <PageTransition>
      <div style={{ paddingTop: '80px', background: '#fff' }}>
        <ScrollReveal>
          <section className="project-intro" style={{ paddingTop: '20px' }}>
            <div className="intro-text">
              <h2>Radiant Overgrowth</h2>
              <p>
                When I think of something that left a strong impression on me, I usually
                picture it floating in black, isolated. The parts I remember most are
                vivid and detailed, while everything around them fades into nothing.
                Radiant Overgrowth is a visualization of that kind of memory, a virtual
                echo of a strong thought, where certain details remain sharp while others
                dissolve. The work runs in real-time, a simulation built in Unity that's
                constantly moving and shifting views.
              </p>
              <p>
                The nine prints come from inside that space. Each one is a rephotograph
                of a photograph, captured from within the simulation, which itself was
                built from a 3D scan made with a camera. Pulled out of motion and into
                material form, they sit somewhere between documentation and residue,
                reminders of a place that's both constructed and remembered.
              </p>
            </div>
            <div className="intro-image">
              <figure>
                <img
                  src="/assets/images/photogrammetry/radiant-overgrowth/Full.jpg"
                  alt="Radiant Overgrowth full model overview"
                />
                <figcaption>
                  Radiant Overgrowth, Unity3D, custom-built PC, flatscreen TV,
                  43.5×24.5", 2024
                </figcaption>
                <figcaption>
                  Radiant Overgrowth (print series), archival inkjet prints from
                  simulation, 10×10" each (framed), 2025
                </figcaption>
              </figure>
            </div>
          </section>
        </ScrollReveal>

        <section style={{ background: '#111' }}>
          <h2 style={{ color: '#fff', margin: 0, padding: '20px 0 10px' }}>
            Radiant Overgrowth
          </h2>
          <Carousel images={SPLATS} />
        </section>
      </div>
    </PageTransition>
  )
}
