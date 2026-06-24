// A compact falling-sand cellular automaton.
//
// The world is a coarse grid stored in flat typed arrays — one cell per several
// screen pixels — which is what makes this cheap enough to run full-bleed behind
// the hero on phones. `grid` holds a material id per cell; `data` holds a small
// per-cell byte we reuse for two things depending on the material: a shade seed
// for static stuff (so sand/water look textured, not flat) and a remaining
// lifetime for ephemeral stuff (fire/smoke/acid).

export const EMPTY = 0

// Material ids. Order here is the order they appear in the selector.
export const MAT = {
  SAND: 1,
  WATER: 2,
  STONE: 3,
  WOOD: 4,
  PLANT: 5,
  FIRE: 6,
  SMOKE: 7,
  OIL: 8,
  SALT: 9,
  ACID: 10,
}

// Behavioral category for each material.
const POWDER = 'powder' // falls, slides off piles (sand, salt)
const LIQUID = 'liquid' // falls and spreads flat (water, oil, acid)
const GAS = 'gas' // rises and fades (fire, smoke)
const SOLID = 'solid' // immovable (stone, wood, plant)

// [r,g,b] base colors keyed to the site palette. Shade variation is applied at
// render time from the per-cell `data` byte.
export const MATERIALS = {
  [MAT.SAND]: { name: 'Sand', type: POWDER, color: [91, 46, 255], vary: 26 }, // violet --color-accent
  [MAT.WATER]: { name: 'Water', type: LIQUID, color: [150, 197, 230], vary: 18 }, // pale blue
  [MAT.STONE]: { name: 'Stone', type: SOLID, color: [17, 17, 16], vary: 14 }, // ink --color-ink
  [MAT.WOOD]: { name: 'Wood', type: SOLID, color: [150, 111, 71], vary: 16 }, // warm tan
  [MAT.PLANT]: { name: 'Plant', type: SOLID, color: [39, 179, 107], vary: 22 }, // green
  [MAT.FIRE]: { name: 'Fire', type: GAS, color: [240, 150, 40], vary: 40 }, // amber
  [MAT.SMOKE]: { name: 'Smoke', type: GAS, color: [120, 120, 118], vary: 24 }, // grey
  [MAT.OIL]: { name: 'Oil', type: LIQUID, color: [44, 40, 54], vary: 14 }, // dark
  [MAT.SALT]: { name: 'Salt', type: POWDER, color: [244, 244, 240], vary: 12 }, // near-white
  [MAT.ACID]: { name: 'Acid', type: LIQUID, color: [176, 224, 40], vary: 30 }, // lime
}

const isLiquid = (m) => m === MAT.WATER || m === MAT.OIL || m === MAT.ACID
const isGas = (m) => m === MAT.FIRE || m === MAT.SMOKE
const flammable = (m) => m === MAT.WOOD || m === MAT.PLANT || m === MAT.OIL
const acidEats = (m) => m === MAT.SAND || m === MAT.STONE || m === MAT.WOOD || m === MAT.SALT || m === MAT.PLANT

export class SandWorld {
  constructor(w, h) {
    this.resize(w, h)
  }

  resize(w, h) {
    this.w = w
    this.h = h
    this.grid = new Uint8Array(w * h)
    this.data = new Uint8Array(w * h)
    // Tracks the cell a unit moved into this tick so we don't process it twice.
    this.moved = new Uint8Array(w * h)
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
  }

  // Paint a filled circle of `mat` (or EMPTY) at grid cell (cx,cy).
  paint(cx, cy, radius, mat) {
    const r2 = radius * radius
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        if (dx * dx + dy * dy > r2) continue
        const x = cx + dx
        const y = cy + dy
        if (!this.inBounds(x, y)) continue
        const i = this.idx(x, y)
        if (mat === EMPTY) {
          this.grid[i] = EMPTY
          this.data[i] = 0
          continue
        }
        // Don't overwrite existing material when painting a movable type — lets
        // you pile sand on top of structures rather than punching holes.
        if (this.grid[i] !== EMPTY && mat !== MAT.STONE && mat !== MAT.WOOD) continue
        this.spawn(i, mat)
      }
    }
  }

  spawn(i, mat) {
    this.grid[i] = mat
    if (mat === MAT.FIRE) this.data[i] = 60 + ((Math.random() * 40) | 0) // lifetime
    else if (mat === MAT.SMOKE) this.data[i] = 90 + ((Math.random() * 60) | 0)
    else if (mat === MAT.ACID) this.data[i] = 200
    else this.data[i] = (Math.random() * 255) | 0 // shade seed
  }

  swap(a, b) {
    const gm = this.grid[a]
    const dm = this.data[a]
    this.grid[a] = this.grid[b]
    this.data[a] = this.data[b]
    this.grid[b] = gm
    this.data[b] = dm
  }

  // Advance the simulation one tick. Process bottom-to-top so falling material
  // settles in a single pass; randomize the horizontal scan direction each row
  // to avoid a left/right drift bias.
  step() {
    this.moved.fill(0)
    const { w, h } = this
    for (let y = h - 1; y >= 0; y--) {
      const leftToRight = Math.random() < 0.5
      for (let k = 0; k < w; k++) {
        const x = leftToRight ? k : w - 1 - k
        const i = this.idx(x, y)
        const mat = this.grid[i]
        if (mat === EMPTY || this.moved[i]) continue
        const type = MATERIALS[mat].type
        if (type === POWDER) this.stepPowder(x, y, i, mat)
        else if (type === LIQUID) this.stepLiquid(x, y, i, mat)
        else if (type === GAS) this.stepGas(x, y, i, mat)
        // SOLID stays put, but wood/plant can still catch fire from a neighbor;
        // that conversion happens from the fire cell's side in stepGas.
      }
    }
  }

  // True if a falling unit can occupy the target cell — empty, or (for powder)
  // sinking through a liquid.
  canSink(targetMat, fallingMat) {
    if (targetMat === EMPTY) return true
    if (MATERIALS[fallingMat].type === POWDER && isLiquid(targetMat)) return true
    return false
  }

  stepPowder(x, y, i, mat) {
    // Salt dissolves when it lands in water: both become water.
    if (mat === MAT.SALT) {
      for (const [dx, dy] of NEIGHBORS) {
        const nx = x + dx
        const ny = y + dy
        if (!this.inBounds(nx, ny)) continue
        if (this.grid[this.idx(nx, ny)] === MAT.WATER && Math.random() < 0.04) {
          this.grid[i] = MAT.WATER
          this.data[i] = (Math.random() * 255) | 0
          return
        }
      }
    }
    const below = this.idx(x, y + 1)
    if (y + 1 < this.h && this.canSink(this.grid[below], mat) && !this.moved[below]) {
      this.swap(i, below)
      this.moved[below] = 1
      return
    }
    // Slide diagonally down off a pile.
    const dir = Math.random() < 0.5 ? 1 : -1
    for (const dx of [dir, -dir]) {
      const nx = x + dx
      if (nx < 0 || nx >= this.w || y + 1 >= this.h) continue
      const d = this.idx(nx, y + 1)
      if (this.canSink(this.grid[d], mat) && !this.moved[d]) {
        this.swap(i, d)
        this.moved[d] = 1
        return
      }
    }
  }

  stepLiquid(x, y, i, mat) {
    // Acid corrodes whatever it touches, then weakens and dies.
    if (mat === MAT.ACID) {
      if (this.corrode(x, y, i)) return
    }
    const below = this.idx(x, y + 1)
    if (y + 1 < this.h && this.grid[below] === EMPTY && !this.moved[below]) {
      this.swap(i, below)
      this.moved[below] = 1
      return
    }
    // Diagonal down.
    const dir = Math.random() < 0.5 ? 1 : -1
    for (const dx of [dir, -dir]) {
      const nx = x + dx
      if (nx < 0 || nx >= this.w || y + 1 >= this.h) continue
      const d = this.idx(nx, y + 1)
      if (this.grid[d] === EMPTY && !this.moved[d]) {
        this.swap(i, d)
        this.moved[d] = 1
        return
      }
    }
    // Spread sideways so liquids find their level.
    for (const dx of [dir, -dir]) {
      const nx = x + dx
      if (nx < 0 || nx >= this.w) continue
      const s = this.idx(nx, y)
      if (this.grid[s] === EMPTY && !this.moved[s]) {
        this.swap(i, s)
        this.moved[s] = 1
        return
      }
    }
  }

  corrode(x, y, i) {
    for (const [dx, dy] of NEIGHBORS) {
      const nx = x + dx
      const ny = y + dy
      if (!this.inBounds(nx, ny)) continue
      const n = this.idx(nx, ny)
      if (acidEats(this.grid[n])) {
        this.grid[n] = EMPTY
        this.data[n] = 0
        this.data[i] -= 60 // each bite spends the acid
        if (this.data[i] <= 0) {
          this.grid[i] = EMPTY
          this.data[i] = 0
          return true
        }
      }
    }
    return false
  }

  stepGas(x, y, i, mat) {
    // Lifetime: fire burns down into smoke; smoke fades to nothing.
    this.data[i] = this.data[i] > 0 ? this.data[i] - 1 : 0
    if (this.data[i] === 0) {
      if (mat === MAT.FIRE) {
        this.grid[i] = MAT.SMOKE
        this.data[i] = 70 + ((Math.random() * 40) | 0)
      } else {
        this.grid[i] = EMPTY
        this.data[i] = 0
      }
      return
    }

    if (mat === MAT.FIRE) {
      // Ignite flammable neighbors; get doused by adjacent water.
      for (const [dx, dy] of NEIGHBORS) {
        const nx = x + dx
        const ny = y + dy
        if (!this.inBounds(nx, ny)) continue
        const n = this.idx(nx, ny)
        const nm = this.grid[n]
        if (nm === MAT.WATER) {
          this.grid[i] = MAT.SMOKE
          this.data[i] = 50
          return
        }
        if (flammable(nm) && Math.random() < 0.18) {
          this.grid[n] = MAT.FIRE
          this.data[n] = 40 + ((Math.random() * 30) | 0)
        }
      }
    }

    // Rise; drift up-diagonally or sideways if blocked.
    const up = this.idx(x, y - 1)
    if (y - 1 >= 0 && this.grid[up] === EMPTY && !this.moved[up]) {
      this.swap(i, up)
      this.moved[up] = 1
      return
    }
    const dir = Math.random() < 0.5 ? 1 : -1
    for (const dx of [dir, -dir]) {
      const nx = x + dx
      if (nx < 0 || nx >= this.w || y - 1 < 0) continue
      const u = this.idx(nx, y - 1)
      if (this.grid[u] === EMPTY && !this.moved[u]) {
        this.swap(i, u)
        this.moved[u] = 1
        return
      }
    }
  }

}

const NEIGHBORS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
  [-1, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
]

// Build a flat RGBA color lookup so render can index by material id without a
// property access per pixel. Index 0 (EMPTY) is transparent.
export function buildPalette() {
  const maxId = Math.max(...Object.values(MAT))
  const base = new Uint8Array((maxId + 1) * 3)
  const vary = new Uint8Array(maxId + 1)
  for (const idStr of Object.keys(MATERIALS)) {
    const id = Number(idStr)
    const m = MATERIALS[id]
    base[id * 3] = m.color[0]
    base[id * 3 + 1] = m.color[1]
    base[id * 3 + 2] = m.color[2]
    vary[id] = m.vary
  }
  return { base, vary }
}
