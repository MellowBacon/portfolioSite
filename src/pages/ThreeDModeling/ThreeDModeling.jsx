import PageTransition from '../../components/PageTransition/PageTransition'
import ScrollReveal from '../../components/ScrollReveal/ScrollReveal'
import ModelViewer from '../../three/ModelViewer'

export default function ThreeDModeling() {
  return (
    <PageTransition>
      <div style={{ paddingTop: '80px', background: '#050505' }}>
        <ScrollReveal>
          <section className="project-intro">
            <div className="intro-text">
              <h2>3D Modeling</h2>
              <p>
                A collection of game-ready 3D models made in Blender. Each one was built
                with real-time use in mind: low-poly where it counts and textured to hold
                up in an engine. Some are rigged for animation.
              </p>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <section style={{ padding: '0 clamp(16px, 5vw, 80px) 80px' }}>
            <ModelViewer />
          </section>
        </ScrollReveal>
      </div>
    </PageTransition>
  )
}
