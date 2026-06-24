import { useEffect, useRef, useState } from 'react'
import { SandWorld, MATERIALS, MAT, EMPTY, buildPalette } from './sandEngine'
import styles from './HeroSand.module.css'

// Screen pixels per simulation cell — "medium to largish" sand pixels. Bigger on
// phones so the grid (and the work per tick) stays small.
const CELL_DESKTOP = 6
const CELL_MOBILE = 9
const MAX_GRID_W = 360 // cap so ultrawide monitors don't balloon the cell count
const BRUSH_RADIUS = 3

// Order of swatches in the selector pill.
const PALETTE_ORDER = [
  MAT.SAND,
  MAT.WATER,
  MAT.STONE,
  MAT.WOOD,
  MAT.PLANT,
  MAT.FIRE,
  MAT.SMOKE,
  MAT.OIL,
  MAT.SALT,
  MAT.ACID,
]

const rgb = (c) => `rgb(${c[0]}, ${c[1]}, ${c[2]})`

export default function HeroSand() {
  const canvasRef = useRef(null)
  const wrapRef = useRef(null)
  const worldRef = useRef(null)
  const matRef = useRef(MAT.SAND) // selected material (ref so the rAF loop sees it)
  const [selected, setSelected] = useState(MAT.SAND)

  useEffect(() => {
    matRef.current = selected
  }, [selected])

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    const ctx = canvas.getContext('2d', { alpha: true })
    const isMobile = window.innerWidth < 768
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
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

      if (!reduceMotion) seed()
    }

    // Gentle ambient start: a few shallow drifts of sand/water so the hero is
    // alive before anyone touches it.
    function seed() {
      const { w, h } = world
      const floor = h - 1
      for (let x = 0; x < w; x++) {
        if (Math.random() < 0.5) world.spawn(world.idx(x, floor), MAT.SAND)
        if (Math.random() < 0.22) world.spawn(world.idx(x, floor - 1), MAT.SAND)
      }
    }

    // Little-endian RGBA packing for the Uint32 buffer.
    function pack(r, g, b, a) {
      return (a << 24) | (b << 16) | (g << 8) | r
    }

    function render() {
      const grid = world.grid
      const data = world.data
      const n = grid.length
      for (let i = 0; i < n; i++) {
        const m = grid[i]
        if (m === EMPTY) {
          buf[i] = 0
          continue
        }
        // Per-cell shade variation for texture: nudge brightness by the stored seed.
        const v = vary[m]
        const shift = v ? ((data[i] % (v * 2)) - v) : 0
        const r = clamp(base[m * 3] + shift)
        const g = clamp(base[m * 3 + 1] + shift)
        const b = clamp(base[m * 3 + 2] + shift)
        buf[i] = pack(r, g, b, 255)
      }
      ctx.putImageData(imageData, 0, 0)
    }

    // --- pointer painting -------------------------------------------------
    const pointers = new Map() // id -> {x,y} in grid space
    let drawing = false

    function toCell(clientX, clientY) {
      const rect = canvas.getBoundingClientRect()
      const x = Math.floor((clientX - rect.left) / cellW)
      const y = Math.floor((clientY - rect.top) / cellH)
      return { x, y }
    }

    function paintAt(clientX, clientY) {
      const { x, y } = toCell(clientX, clientY)
      const mat = matRef.current
      world.paint(x, y, BRUSH_RADIUS, mat === 0 ? EMPTY : mat)
    }

    function onPointerDown(e) {
      drawing = true
      pointers.set(e.pointerId, true)
      paintAt(e.clientX, e.clientY)
    }
    function onPointerMove(e) {
      if (!drawing || !pointers.has(e.pointerId)) return
      paintAt(e.clientX, e.clientY)
    }
    function onPointerUp(e) {
      pointers.delete(e.pointerId)
      if (pointers.size === 0) drawing = false
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
        // On mobile, step the sim every other frame to halve the work.
        if (!isMobile || frame % 2 === 0) world.step()
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

    function onVisibility() {
      running = !document.hidden && isInView()
    }
    function isInView() {
      const r = wrap.getBoundingClientRect()
      return r.bottom > 0 && r.top < window.innerHeight
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
    // With reduced motion we still want one painted frame, but no auto-stepping.
    if (reduceMotion) {
      running = false
      render()
      // Still allow manual painting to show up: re-render shortly after a paint.
      canvas.addEventListener('pointermove', () => render())
      canvas.addEventListener('pointerdown', () => render())
    } else {
      raf = requestAnimationFrame(tick)
    }

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

  return (
    <>
      <div ref={wrapRef} className={styles.canvasLayer}>
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      </div>

      {/* Sibling of the canvas layer (not nested) so it isn't trapped inside the
          layer's z-index:0 stacking context and stays above the headline. */}
      <div className={styles.selector} role="toolbar" aria-label="Falling sand materials">
        {PALETTE_ORDER.map((id) => {
          const m = MATERIALS[id]
          return (
            <button
              key={id}
              type="button"
              className={`${styles.swatch} ${selected === id ? styles.swatchActive : ''}`}
              style={{ background: rgb(m.color) }}
              onClick={() => setSelected(id)}
              aria-pressed={selected === id}
              aria-label={m.name}
              title={m.name}
            />
          )
        })}
        <button
          type="button"
          className={`${styles.swatch} ${styles.eraser} ${selected === EMPTY ? styles.swatchActive : ''}`}
          onClick={() => setSelected(EMPTY)}
          aria-pressed={selected === EMPTY}
          aria-label="Eraser"
          title="Eraser"
        />
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
