import { useEffect } from 'react'
import Lenis from 'lenis'

export default function useLenis() {
  useEffect(() => {
    // Respect prefers-reduced-motion: fall back to native scroll
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      duration: 1.2,
      // expo ease-out
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      prevent: (node) => node.tagName === 'IFRAME',
    })

    let rafId

    function raf(time) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }

    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])
}
