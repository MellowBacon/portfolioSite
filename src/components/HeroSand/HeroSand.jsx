import { useEffect, useRef, useState } from 'react'
import { SandWorld, buildPalette, SAND_PALETTES, sandId, EMPTY } from './sandEngine'
import styles from './HeroSand.module.css'

// Screen pixels per simulation cell — "medium to largish" sand pixels. Bigger on
// phones so the grid (and the work per tick) stays small.
const CELL_DESKTOP = 6
const CELL_MOBILE = 9
const MAX_GRID_W = 360 // cap so ultrawide monitors don't balloon the cell count
const BRUSH_RADIUS = 3
// Vacuum particle effect — the erased sand lifts off the grid and swirls as free
// particles (continuous position + velocity), which the grid can't do.
const VAC_RADIUS = 11 // intake reach, in cells
const VAC_INTAKE_P = 0.06 // chance a sand cell in reach lifts off per frame (gradual, windy)
const VAC_SPIN = 0.07 // tangential force — the windy swirl
const VAC_PULL = 0.022 // inward force — gentle drift toward the eye
const VAC_DAMP = 0.94 // velocity damping (lower = draggier, more flowing)
const VAC_FADE = 0.012 // life lost per frame (~80 frames)
const VAC_CORE = 1.6 // particles within this of the eye finish fading fast
const MAX_PARTICLES = 2400

export default function HeroSand() {
  const canvasRef = useRef(null)
  const wrapRef = useRef(null)
  const worldRef = useRef(null)

  const [slot, setSlot] = useState(0) // selected sand color (0..8)
  const [paletteIndex, setPaletteIndex] = useState(0)
  const [mode, setMode] = useState('sand') // 'sand' | 'vacuum'
  const slotRef = useRef(slot)
  const paletteRef = useRef(paletteIndex)
  const modeRef = useRef(mode)
  const vacuumRef = useRef({ active: false, fx: 0, fy: 0 })

  useEffect(() => {
    slotRef.current = slot
  }, [slot])
  useEffect(() => {
    paletteRef.current = paletteIndex
  }, [paletteIndex])
  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    const ctx = canvas.getContext('2d', { alpha: true })
    const isMobile = window.innerWidth < 768
    const { base, vary } = buildPalette()

    let world = null
    let imageData = null
    let buf = null // Uint32 view over the image data for fast pixel writes
    let cellW = 0
    let cellH = 0

    // (Re)build the grid to match the hero's current pixel size.
    function setup() {
      const rect = wrap.getBoundingClientRect()
      const cell = isMobile ? CELL_MOBILE : CELL_DESKTOP
      let gw = Math.max(1, Math.floor(rect.width / cell))
      if (gw > MAX_GRID_W) gw = MAX_GRID_W
      const gh = Math.max(1, Math.floor((rect.height / rect.width) * gw))

      if (!world) world = new SandWorld(gw, gh)
      else world.resize(gw, gh)
      worldRef.current = world

      canvas.width = gw
      canvas.height = gh
      imageData = ctx.createImageData(gw, gh)
      buf = new Uint32Array(imageData.data.buffer)
      cellW = rect.width / gw
      cellH = rect.height / gh
    }

    // Little-endian RGBA packing for the Uint32 buffer.
    function pack(r, g, b, a) {
      return (a << 24) | (b << 16) | (g << 8) | r
    }

    // Free particles lifted off the grid by the vacuum. Each has a float position
    // and velocity (in grid cells), its sand color, and a 1..0 life.
    const particles = []

    function render() {
      const { grid, data } = world
      const n = grid.length
      for (let i = 0; i < n; i++) {
        const m = grid[i]
        if (m === EMPTY) {
          buf[i] = 0
          continue
        }
        const v = vary[m]
        const shift = v ? (data[i] % (v * 2)) - v : 0
        buf[i] = pack(
          clamp(base[m * 3] + shift),
          clamp(base[m * 3 + 1] + shift),
          clamp(base[m * 3 + 2] + shift),
          255,
        )
      }
      ctx.putImageData(imageData, 0, 0)

      // Draw swirling particles on top as sand-sized blocks (matches the pixel look).
      for (let p = 0; p < particles.length; p++) {
        const pt = particles[p]
        ctx.globalAlpha = pt.life > 1 ? 1 : pt.life
        ctx.fillStyle = pt.css
        ctx.fillRect(Math.round(pt.x), Math.round(pt.y), 1, 1)
      }
      ctx.globalAlpha = 1
    }

    // Lift sand near the pointer off the grid into the swirl. Probabilistic per
    // cell so the pile feeds the vortex gradually rather than vanishing at once.
    function intakeParticles(fx, fy) {
      const cx = Math.round(fx)
      const cy = Math.round(fy)
      const R = VAC_RADIUS
      const r2 = R * R
      for (let dy = -R; dy <= R; dy++) {
        for (let dx = -R; dx <= R; dx++) {
          if (dx * dx + dy * dy > r2) continue
          if (Math.random() > VAC_INTAKE_P) continue
          const x = cx + dx
          const y = cy + dy
          if (!world.inBounds(x, y)) continue
          if (particles.length >= MAX_PARTICLES) return
          const id = world.takeSand(x, y)
          if (!id) continue
          // Kick it tangentially so the swirl forms immediately.
          const ddx = fx - x
          const ddy = fy - y
          const dist = Math.hypot(ddx, ddy) || 1
          const tx = -ddy / dist
          const ty = ddx / dist
          particles.push({
            x,
            y,
            vx: tx * 0.5 + (Math.random() - 0.5) * 0.3,
            vy: ty * 0.5 + (Math.random() - 0.5) * 0.3,
            life: 1,
            css: `rgb(${base[id * 3]},${base[id * 3 + 1]},${base[id * 3 + 2]})`,
          })
        }
      }
    }

    // Advance every live particle toward the last vacuum point on a windy spiral,
    // fading as it goes. Runs even after release so the swirl finishes naturally.
    function updateParticles(fx, fy) {
      for (let p = particles.length - 1; p >= 0; p--) {
        const pt = particles[p]
        const ddx = fx - pt.x
        const ddy = fy - pt.y
        const dist = Math.hypot(ddx, ddy) || 1
        const rx = ddx / dist
        const ry = ddy / dist
        const tx = -ry // tangential → swirl
        const ty = rx
        pt.vx += rx * VAC_PULL + tx * VAC_SPIN
        pt.vy += ry * VAC_PULL + ty * VAC_SPIN
        pt.vx *= VAC_DAMP
        pt.vy *= VAC_DAMP
        pt.x += pt.vx
        pt.y += pt.vy
        pt.life -= VAC_FADE + (dist < VAC_CORE ? 0.25 : 0)
        if (pt.life <= 0) {
          particles[p] = particles[particles.length - 1]
          particles.pop()
        }
      }
    }

    // --- pointer painting -------------------------------------------------
    const pointers = new Map()
    let drawing = false

    // Apply the active tool at a pointer location. Sand paints immediately; the
    // vacuum just records where to swirl (in float grid coords) — the actual intake
    // happens in the run loop so it keeps pulling while the pointer is held still.
    function applyAt(clientX, clientY) {
      const rect = canvas.getBoundingClientRect()
      const fx = (clientX - rect.left) / cellW
      const fy = (clientY - rect.top) / cellH
      if (modeRef.current === 'vacuum') {
        const vac = vacuumRef.current
        vac.active = true
        vac.fx = fx
        vac.fy = fy
      } else {
        world.paintSand(
          Math.floor(fx),
          Math.floor(fy),
          BRUSH_RADIUS,
          sandId(paletteRef.current, slotRef.current),
        )
      }
    }

    function onPointerDown(e) {
      drawing = true
      pointers.set(e.pointerId, true)
      applyAt(e.clientX, e.clientY)
    }
    function onPointerMove(e) {
      if (!drawing || !pointers.has(e.pointerId)) return
      applyAt(e.clientX, e.clientY)
    }
    function onPointerUp(e) {
      pointers.delete(e.pointerId)
      if (pointers.size === 0) {
        drawing = false
        vacuumRef.current.active = false
      }
    }

    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)

    // --- run loop ---------------------------------------------------------
    let raf = 0
    let running = true
    let frame = 0
    function tick() {
      if (running) {
        if (!isMobile || frame % 2 === 0) world.step()
        const vac = vacuumRef.current
        if (vac.active) intakeParticles(vac.fx, vac.fy)
        if (particles.length) updateParticles(vac.fx, vac.fy)
        render()
      }
      frame++
      raf = requestAnimationFrame(tick)
    }

    // Pause when the hero scrolls out of view — no point simulating off-screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting
      },
      { threshold: 0 },
    )
    io.observe(wrap)

    function isInView() {
      const r = wrap.getBoundingClientRect()
      return r.bottom > 0 && r.top < window.innerHeight
    }
    function onVisibility() {
      running = !document.hidden && isInView()
    }
    document.addEventListener('visibilitychange', onVisibility)

    // Rebuild grid on resize (debounced).
    let resizeTimer = 0
    function onResize() {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(setup, 200)
    }
    window.addEventListener('resize', onResize)

    setup()
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
    }
  }, [])

  function clearWorld() {
    if (worldRef.current) worldRef.current.clear()
  }

  const palette = SAND_PALETTES[paletteIndex]

  return (
    <>
      <div ref={wrapRef} className={styles.canvasLayer}>
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      </div>

      {/* Sibling of the canvas layer (not nested) so it isn't trapped inside the
          layer's z-index:0 stacking context and stays above the headline. */}
      <div className={styles.selector} role="toolbar" aria-label="Sand colors">
        {palette.map((hex, s) => {
          const active = mode === 'sand' && slot === s
          return (
            <button
              key={s}
              type="button"
              className={`${styles.swatch} ${active ? styles.swatchActive : ''}`}
              style={{ background: hex }}
              onClick={() => {
                setSlot(s)
                setMode('sand')
              }}
              aria-pressed={active}
              aria-label={`Sand color ${s + 1}`}
              title={`Sand color ${s + 1}`}
            />
          )
        })}

        <span className={styles.divider} aria-hidden="true" />

        <button
          type="button"
          className={`${styles.tool} ${mode === 'vacuum' ? styles.toolActive : ''}`}
          onClick={() => setMode('vacuum')}
          aria-pressed={mode === 'vacuum'}
          title="Detach — swirl sand away as particles"
        >
          Detach
        </button>
        <button
          type="button"
          className={styles.tool}
          onClick={() => setPaletteIndex((p) => (p + 1) % SAND_PALETTES.length)}
          title="Swap sand palette"
        >
          Palette {paletteIndex + 1}/{SAND_PALETTES.length}
        </button>
        <button type="button" className={styles.clearBtn} onClick={clearWorld}>
          Clear
        </button>
      </div>
    </>
  )
}

function clamp(v) {
  return v < 0 ? 0 : v > 255 ? 255 : v
}
