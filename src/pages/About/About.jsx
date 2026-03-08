import PageTransition from '../../components/PageTransition/PageTransition'
import ScrollReveal from '../../components/ScrollReveal/ScrollReveal'

export default function About() {
  return (
    <PageTransition>
      <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#050505' }}>
        <ScrollReveal>
          <section className="about-section">
            <h2>About Noah Bello</h2>
            <div className="about-image">
              <img src="/assets/images/profile pic.jpg" alt="Noah Bello" />
            </div>
            <p>
              Noah Bello's work explores the evolving relationship between the physical
              and digital. He is drawn to the ways technology shapes perception, distorts
              memory, and reconfigures the organic into something new. His process often
              begins with real, scanned environments then shifts into something altered.
            </p>
            <p>
              By merging organic forms with digital systems, Bello's work explores the
              shifting boundaries between the physical and virtual. His practice examines
              how digital reconstruction can alter, distort, or extend the life of natural
              forms, raising questions about transformation, memory, and perception in an
              increasingly digitized world.
            </p>
          </section>
        </ScrollReveal>
      </div>
    </PageTransition>
  )
}
