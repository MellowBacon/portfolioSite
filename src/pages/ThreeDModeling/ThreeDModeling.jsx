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
                This work spans a range of styles and subjects — from a detailed Les Paul
                guitar to a rigged robot and a submarine. Each piece explores a different
                aspect of form, material, and rendering.
              </p>
              <p>
                The process involves modeling, UV unwrapping, texturing, rigging, and lighting
                in Blender. Use the viewer below to inspect the models interactively — toggle
                wireframe, switch models, or watch the animations play.
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
