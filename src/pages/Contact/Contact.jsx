import { useState } from 'react'
import PageTransition from '../../components/PageTransition/PageTransition'
import ScrollReveal from '../../components/ScrollReveal/ScrollReveal'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const form = e.target
    const data = new FormData(form)

    try {
      const res = await fetch('https://formspree.io/f/xkgolezg', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      if (res.ok) {
        setSubmitted(true)
        form.reset()
      } else {
        alert('Oops! Something went wrong.')
      }
    } catch {
      alert('Error submitting form. Please try again.')
    }
  }

  return (
    <PageTransition>
      <div
        style={{
          paddingTop: '80px',
          minHeight: '100vh',
          background: 'url(/assets/images/splatbackground.png) no-repeat center center / cover fixed',
        }}
      >
        <ScrollReveal>
          <section className="contact-section">
            <h2>Get in Touch</h2>
            <p>Feel free to reach out for collaborations, inquiries, or just to say hello.</p>
            <form onSubmit={handleSubmit}>
              <label htmlFor="name">Your Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                required
              />
              <label htmlFor="email">Your Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email address"
                required
              />
              <label htmlFor="message">Your Message:</label>
              <textarea
                id="message"
                name="message"
                placeholder="Write your message here..."
                required
              />
              {submitted && (
                <p id="success-message">Message sent successfully!</p>
              )}
              <button type="submit">Send</button>
            </form>
          </section>
        </ScrollReveal>
      </div>
    </PageTransition>
  )
}
