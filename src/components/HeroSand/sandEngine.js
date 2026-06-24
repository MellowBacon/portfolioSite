// A sand-art stencil engine.
//
// This is a coarse cellular grid (one cell per several screen pixels) repurposed
// as a screen-print toy rather than a physics sandbox. The only moving material
// is colored sand. Two flag layers sit on a passable "glue board" behind the
// sand: `sticky` (glue you draw) and `mask` (a coating over the glue). Sand
// falls through empty cells and adheres only where glue is exposed
// (sticky && !mask), or accretes onto already-stuck sand. Excess sand pours off
// the bottom, so the canvas keeps only the design.

export const EMPTY = 0

// Five cohesive 9-color sand palettes. A placed grain stores an id that encodes
// (palette, slot), so its color is frozen forever — swapping palettes only
// changes what new pours look like, never what's already down.
export const SAND_PALETTES = [
  // Brand violet
  ['#5b2eff', '#7048ff', '#8a68ff', '#a385ff', '#4318e0', '#3410b0', '#b9a3ff', '#2a0d8c', '#d4c7ff'],
  // Desert / earth
  ['#e8c89a', '#d9a85f', '#c4863c', '#a9692a', '#8a4f22', '#f0dcc0', '#b9763a', '#6e3d1c', '#caa06a'],
  // Ocean
  ['#bfe6e3', '#8fd0cf', '#5ab3b8', '#2f8f9c', '#1f6f86', '#16526e', '#7fc6c2', '#0e3b54', '#a6dad4'],
  // Sunset
  ['#ffd6a5', '#ffb37a', '#ff8f6b', '#f56a6a', '#d94f7a', '#b23a86', '#ff9e9e', '#7d2a78', '#ffc2b0'],
  // Forest
  ['#cfe3a8', '#a7cf72', '#7fb04a', '#5a9136', '#3d7029', '#2a541f', '#bcd98c', '#1c3c16', '#e0ead0'],
  // Mono ink
  ['#e6e6e2', '#cfcfc9', '#b3b3ac', '#969690', '#7a7a73', '#5d5d57', '#42423d', '#2a2a26', '#141412'],
  // Rose
  ['#ffe0e6', '#ffc1cd', '#ff9bb0', '#f5738f', '#e24e79', '#c2356a', '#9e2558', '#771a45', '#511132'],
  // Amber gold
  ['#fff1c2', '#ffe08a', '#ffc94d', '#f5ad2b', '#e08e1f', '#c0701a', '#9c5616', '#763f12', '#52290c'],
  // Mint
  ['#d8f5e6', '#aee9cd', '#7fd9b0', '#52c193', '#33a378', '#1f8460', '#15664a', '#0e4836', '#082c20'],
  // Plum berry
  ['#f3d6f0', '#e6abe0', '#d57fcf', '#bd54b8', '#a0379c', '#82287f', '#641d62', '#471447', '#2c0c2c'],
]

const SAND_BASE = 1 // first sand id
const PALETTE_COUNT = SAND_PALETTES.length
const SLOTS = 9
export const SAND_MAX = SAND_BASE + PALETTE_COUNT * SLOTS - 1 // 45

export const isSand = (id) => id >= SAND_BASE && id <= SAND_MAX
export const sandId = (paletteIndex, slot) => SAND_BASE + paletteIndex * SLOTS + slot

// Subtle texture for sand grains.
const SAND_VARY = 12

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

// Board overlay colors (drawn only on empty cells; sand covers them).
export const STICKY_RGB = [222, 214, 200] // faint warm sheen
export const MASK_RGB = [120, 108, 150] // soft violet-grey tint

export class SandWorld {
  constructor(w, h) {
    this.resize(w, h)
  }

  resize(w, h) {
    this.w = w
    this.h = h
    this.grid = new Uint8Array(w * h) // sand color id or EMPTY
    this.data = new Uint8Array(w * h) // per-cell shade seed
    this.frozen = new Uint8Array(w * h) // 1 = stuck in place
    this.sticky = new Uint8Array(w * h) // glue flag
    this.mask = new Uint8Array(w * h) // coating flag
    this.moved = new Uint8Array(w * h) // per-tick move guard
  }

  idx(x, y) {
    return y * this.w + x
  }

  inBounds(x, y) {
    return x >= 0 && x < this.w && y >= 0 && y < this.h
  }

  clear() {
    this.grid.fill(EMPTY)
    this.data.fill(0)
    this.frozen.fill(0)
    this.sticky.fill(0)
    this.mask.fill(0)
  }

  // Pour sand of color `id` in a filled circle. Never overwrites an occupied cell,
  // so stuck sand (and any sand) is preserved — new sand falls around it.
  paintSand(cx, cy, radius, id) {
    this.forEachInBrush(cx, cy, radius, (i) => {
      if (this.grid[i] !== EMPTY) return
      this.grid[i] = id
      this.data[i] = (Math.random() * 255) | 0
    })
  }

  // Set/clear a flag layer (sticky or mask) across the brush.
  paintFlag(layer, cx, cy, radius, value) {
    const arr = layer === 'sticky' ? this.sticky : this.mask
    this.forEachInBrush(cx, cy, radius, (i) => {
      arr[i] = value
    })
  }

  forEachInBrush(cx, cy, radius, fn) {
    const r2 = radius * radius
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        if (dx * dx + dy * dy > r2) continue
        const x = cx + dx
        const y = cy + dy
        if (!this.inBounds(x, y)) continue
        fn(this.idx(x, y))
      }
    }
  }

  swap(a, b) {
    const gm = this.grid[a]
    const dm = this.data[a]
    this.grid[a] = this.grid[b]
    this.data[a] = this.data[b]
    this.grid[b] = gm
    this.data[b] = dm
  }

  freeze(i) {
    this.frozen[i] = 1
  }

  exposedGlue(i) {
    return this.sticky[i] === 1 && this.mask[i] === 0
  }

  // Advance one tick: bottom-to-top, randomized row direction to avoid drift bias.
  step() {
    this.moved.fill(0)
    const { w, h } = this
    for (let y = h - 1; y >= 0; y--) {
      const leftToRight = Math.random() < 0.5
      for (let k = 0; k < w; k++) {
        const x = leftToRight ? k : w - 1 - k
        const i = this.idx(x, y)
        const mat = this.grid[i]
        if (mat === EMPTY || this.frozen[i] || this.moved[i]) continue
        this.stepSand(x, y, i)
      }
    }
  }

  stepSand(x, y, i) {
    // Fall straight down into empty space; adhere the instant we land on exposed
    // glue so floating stencils catch the sand.
    if (y + 1 < this.h) {
      const below = this.idx(x, y + 1)
      if (this.grid[below] === EMPTY && !this.moved[below]) {
        this.swap(i, below)
        this.moved[below] = 1
        if (this.exposedGlue(below)) this.freeze(below)
        return
      }
      // Slide diagonally down off a slope (spreads sand across an exposed region).
      const dir = Math.random() < 0.5 ? 1 : -1
      for (const dx of [dir, -dir]) {
        const nx = x + dx
        if (nx < 0 || nx >= this.w) continue
        const d = this.idx(nx, y + 1)
        if (this.grid[d] === EMPTY && !this.moved[d]) {
          this.swap(i, d)
          this.moved[d] = 1
          if (this.exposedGlue(d)) this.freeze(d)
          return
        }
      }
    }

    // Can't fall any further. If we're sitting on exposed glue, stick — that's the
    // design. Otherwise stay put as loose sand: the stream that isn't caught by glue
    // (or that overflows a now-filled glue cell) piles up at the bottom like a real
    // sand stream, rather than being absorbed.
    if (this.exposedGlue(i)) this.freeze(i)
  }

  // Convert the sand cell at (x,y) to empty and return its color id (0 if it was
  // empty). The vacuum tool uses this to lift sand off the grid into the particle
  // swirl — free particles, not grid cells, are what actually animate the effect.
  takeSand(x, y) {
    const i = this.idx(x, y)
    const id = this.grid[i]
    if (id === EMPTY) return 0
    this.grid[i] = EMPTY
    this.data[i] = 0
    this.frozen[i] = 0
    return id
  }
}

// Build a flat RGBA color lookup for sand ids so render indexes by id directly.
// Index 0 (EMPTY) is transparent; board overlays (sticky/mask) are handled in the
// renderer, not here.
export function buildPalette() {
  const base = new Uint8Array((SAND_MAX + 1) * 3)
  const vary = new Uint8Array(SAND_MAX + 1)
  for (let p = 0; p < PALETTE_COUNT; p++) {
    for (let s = 0; s < SLOTS; s++) {
      const id = sandId(p, s)
      const [r, g, b] = hexToRgb(SAND_PALETTES[p][s])
      base[id * 3] = r
      base[id * 3 + 1] = g
      base[id * 3 + 2] = b
      vary[id] = SAND_VARY
    }
  }
  return { base, vary }
}
