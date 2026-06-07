import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '../../components/PageTransition/PageTransition'
import StaggerText from '../../components/motion/StaggerText'
import Reveal from '../../components/motion/Reveal'
import styles from './Contact.module.css'

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
      <div className={`page ${styles.page}`}>
        <div className="container">
          <header className={styles.header}>
            <span className="section-label">Contact</span>
            <StaggerText text="Get in Touch" className={styles.heading} />
            <p className={styles.sub}>
              Feel free to reach out for collaborations, inquiries, or just to say hello.
            </p>
          </header>

          <Reveal>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="email">Your Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="message">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Write your message here..."
                  required
                />
              </div>

              <AnimatePresence>
                {submitted && (
                  <motion.p
                    className={styles.success}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    Message sent successfully!
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                className={`btn btn--solid ${styles.submit}`}
                whileTap={{ scale: 0.96 }}
              >
                Send
              </motion.button>
            </form>
          </Reveal>
        </div>
      </div>
    </PageTransition>
  )
}
