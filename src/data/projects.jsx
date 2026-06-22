// ─── Central content data layer ───────────────────────────────────────────────
// Single source of truth for all portfolio projects across mediums.
// Content (text, image paths, Vimeo IDs) migrated verbatim from the previous
// page-per-medium components. Captions are JSX, hence the .jsx extension.

export const MEDIUMS = [
  { key: 'photogrammetry', label: 'Photogrammetry' },
  { key: '3d', label: '3D Modeling' },
  { key: 'video', label: 'Video Art' },
  { key: 'photography', label: 'Photography' },
  { key: 'environment', label: 'Environment Art' },
  { key: 'web', label: 'Web' },
]

export const MEDIUM_LABELS = Object.fromEntries(MEDIUMS.map(m => [m.key, m.label]))

// 3D model viewer config (moved from src/three/ModelViewer.jsx)
export const MODELS = [
  { name: 'Ballbot', file: '/assets/models/Ballbot.glb', isBallbot: true },
  { name: 'Les Paul', file: '/assets/models/les paul.glb' },
  { name: 'Submarine', file: '/assets/models/Submarine.glb' },
]

export const EMOTIONS = [
  { name: '-_-', file: '/assets/models/robot facial animations/-_-/-_- strip.png' },
  { name: 'Angry', file: '/assets/models/robot facial animations/angry/angry.png' },
  { name: 'Blink', file: '/assets/models/robot facial animations/blink/Test Blink Animation no CRT_green_alpha.png', rows: 1 },
  { name: 'Happy', file: '/assets/models/robot facial animations/happy/happy.png' },
  { name: 'oO', file: '/assets/models/robot facial animations/oO/oO.png' },
  { name: 'Sad', file: '/assets/models/robot facial animations/sad/Sad.png' },
  { name: 'Skeptical', file: '/assets/models/robot facial animations/skeptical/skeptical.png' },
]

// Project shape:
// { slug, title, medium, year, featured, thumbnail, thumbnailAlt, summary,
//   meta: [{ label, value }], blocks: [typed content blocks] }
//
// Block types:
//   statement   — { paragraphs: (string | JSX)[] }
//   image       — { src, alt, caption, lightbox }
//   carousel    — { images: string[], label }
//   vimeo       — { id, params?, title }
//   gallery     — { items: [{ thumb, full, caption }] }
//   modelViewer — { models, emotions }
//   captions    — { items: string[] }  (small-print work captions)
//   link        — { href, label }  (external call-to-action button)

export const PROJECTS = [
  {
    slug: 'radiant-overgrowth',
    title: 'Radiant Overgrowth',
    medium: 'photogrammetry',
    year: '2025',
    featured: true,
    thumbnail: '/assets/images/photogrammetry/thumbnails/InstaShot1_Thumb.jpg',
    thumbnailAlt: 'Gaussian splat render from Radiant Overgrowth',
    summary: 'Real-time simulation and print series shown in Patchwork, a group exhibition.',
    meta: [
      { label: 'Show', value: 'Patchwork' },
      { label: 'Year', value: '2025' },
    ],
    blocks: [
      {
        type: 'statement',
        paragraphs: [
          `When I think of something that left a strong impression on me, I usually picture it
           floating in black, isolated. The parts I remember most are vivid and detailed, while
           everything around them fades into nothing. Radiant Overgrowth is a visualization of
           that kind of memory — a virtual echo of a strong thought, where certain details remain
           sharp while others dissolve. The work runs in real-time, a simulation built in Unity
           that's constantly moving and shifting views.`,
          `The nine prints come from inside that space. Each one is a rephotograph of a photograph,
           captured from within the simulation, which itself was built from a 3D scan made with a
           camera. Pulled out of motion and into material form, they sit somewhere between
           documentation and residue — reminders of a place that's both constructed and remembered.`,
        ],
      },
      {
        type: 'captions',
        items: [
          'Radiant Overgrowth, Unity3D, custom-built PC, flatscreen TV, 43.5×24.5", 2024',
          'Radiant Overgrowth (print series), archival inkjet prints from simulation, 10×10" each (framed), 2025',
        ],
      },
      {
        type: 'image',
        src: '/assets/images/photogrammetry/radiant-overgrowth/Full.jpg',
        alt: 'Radiant Overgrowth installation view, Patchwork group show',
        caption: 'Installation view — Patchwork, 2025',
        lightbox: true,
      },
      {
        type: 'carousel',
        label: 'Print series — 9 works',
        images: [1, 6, 7, 8, 9, 12, 15, 17, 22].map(n => `/assets/images/photogrammetry/splats/Splat${n}.jpg`),
      },
      {
        type: 'image',
        src: '/assets/images/show-posters/patchwork_poster.JPEG',
        alt: 'Patchwork group show poster',
        caption: 'Patchwork — show poster',
        lightbox: true,
      },
    ],
  },

  {
    slug: '3d-models',
    title: 'Game-Ready 3D Models',
    medium: '3d',
    year: '2024',
    featured: true,
    thumbnail: '/assets/images/3d-modeling/thumbnails/sub_thumbnail.png',
    thumbnailAlt: 'Submarine 3D model render',
    summary: 'Rigged characters, instruments, and vehicles built in Blender — explore them live.',
    meta: [
      { label: 'Tools', value: 'Blender, Unity' },
    ],
    blocks: [
      {
        type: 'statement',
        paragraphs: [
          `A collection of game-ready 3D models made in Blender. Each one was built
           with real-time use in mind: low-poly where it counts and textured to hold
           up in an engine. Some are rigged for animation.`,
        ],
      },
      {
        type: 'modelViewer',
        models: MODELS,
        emotions: EMOTIONS,
      },
    ],
  },

  {
    slug: 'base-layers',
    title: 'Base Layers',
    medium: '3d',
    year: '2025',
    featured: false,
    thumbnail: '/assets/images/Texture Book/thumbnails/7 Noah Bello - Base Layers (excerpt 1).webp',
    thumbnailAlt: 'Excerpt from Base Layers — a book of 3D model textures',
    summary: 'A book of 3D model textures, unwrapped and presented as standalone images.',
    blocks: [
      {
        type: 'statement',
        paragraphs: [
          <>
            <em>Base Layers</em> is a book that strips 3D models down to their textures —
            the flat, unwrapped maps that normally stay hidden, wrapped around geometry in
            an engine. Pulled off the mesh and laid flat on the page, they become images in
            their own right.
          </>,
          `Each spread isolates a texture as a standalone composition, treating the working
           material of 3D art as something worth looking at directly.`,
        ],
      },
      {
        type: 'carousel',
        label: 'Selected spreads',
        images: [1, 2, 3].map((n) => {
          const base = `${n + 6} Noah Bello - Base Layers (excerpt ${n})`
          return {
            thumb: `/assets/images/Texture Book/thumbnails/${base}.webp`,
            full: `/assets/images/Texture Book/full/${base}.webp`,
          }
        }),
      },
    ],
  },

  {
    slug: 'fidget-series',
    title: 'Fidget Series',
    medium: '3d',
    year: '2025',
    featured: false,
    thumbnail: '/assets/images/Fidget Series/5 ways to fidget/thumbnails/fidgettoonmetal.webp',
    thumbnailAlt: 'Stylized 3D fidget spinner render',
    summary: 'A series of 3D fidget spinners rendered across material studies and furry variations.',
    blocks: [
      {
        type: 'statement',
        paragraphs: [
          `The Fidget Series takes a single restless object — the fidget spinner — and
           reworks it as a subject for 3D rendering. Each set runs the same form through
           a different lens, turning a throwaway toy into a study of material and surface.`,
        ],
      },
      {
        type: 'carousel',
        label: '5 Ways to Fidget — material studies',
        images: [
          'fidgettoonpng',
          'fidgettoonmetal',
          'fidgettoonglass',
          'fidgettoonlines',
          'fidget',
        ].map(name => ({
          thumb: `/assets/images/Fidget Series/5 ways to fidget/thumbnails/${name}.webp`,
          full: `/assets/images/Fidget Series/5 ways to fidget/full/${name}.webp`,
        })),
      },
      {
        type: 'carousel',
        label: 'Furry Fidgets — animal coats',
        images: ['Dalmation', 'giraffe', 'leopard', 'tiger', 'zebra'].map(name => ({
          thumb: `/assets/images/Fidget Series/Furry Fidgets/thumbnails/FurryFidget${name}.webp`,
          full: `/assets/images/Fidget Series/Furry Fidgets/full/FurryFidget${name}.webp`,
        })),
      },
    ],
  },

  {
    slug: 'ebb-and-flow',
    title: 'Ebb and Flow',
    medium: 'video',
    year: '2025',
    featured: false,
    thumbnail: '/assets/images/video-art/thumbnails/VideoArt.JPG',
    thumbnailAlt: 'Still from Ebb and Flow',
    summary: 'A video art piece thinking about our changing planet.',
    blocks: [
      {
        type: 'vimeo',
        id: '1066783296',
        params: 'badge=0&autopause=0&player_id=0&app_id=58479',
        title: 'Ebb and Flow',
      },
      {
        type: 'statement',
        paragraphs: [
          <>
            <em>Ebb and Flow</em> is a video art piece thinking about our changing planet.
          </>,
          <>
            A collaboration with{' '}
            <a href="https://averyjam.com/" target="_blank" rel="noopener noreferrer">
              Avery Jam
            </a>.
          </>,
        ],
      },
    ],
  },

  {
    slug: 'household-experiments',
    title: 'Household Experiments',
    medium: 'video',
    year: '2024',
    featured: false,
    thumbnail: null,
    summary: 'A macro video abstracting simple chemical reactions into something otherworldly.',
    blocks: [
      {
        type: 'vimeo',
        id: '1064859715',
        title: 'Household Experiments',
      },
      {
        type: 'statement',
        paragraphs: [
          <>
            <em>Household Experiments</em> is a macro video that shows a different view of
            simple chemical reactions that can be done with household products.
          </>,
          'It abstracts the everyday into something otherworldly.',
        ],
      },
    ],
  },

  {
    slug: 'culture-shock',
    title: 'Culture Shock',
    medium: 'video',
    year: '2024',
    featured: false,
    thumbnail: null,
    summary: 'A video collage built from found footage on Google Maps.',
    blocks: [
      {
        type: 'vimeo',
        id: '1064853626',
        title: 'Culture Shock',
      },
      {
        type: 'statement',
        paragraphs: [
          <>
            <em>Culture Shock</em> is a video collage project that attempts to immerse the
            viewer in cultures that have seemed so far away to me.
          </>,
          `All the videos are found footage from Google Maps, mostly posted in the review
           section of businesses. In a way, this is a condensed visit to these locations.`,
        ],
      },
    ],
  },

  {
    slug: 'ai-self-portrait',
    title: 'AI Self Portrait',
    medium: 'video',
    year: '2024',
    featured: false,
    thumbnail: null,
    summary: 'An experiment exploring the advancement of AI tech in 2024.',
    blocks: [
      {
        type: 'vimeo',
        id: '1064867250',
        title: 'AI Self Portrait',
      },
      {
        type: 'statement',
        paragraphs: [
          <>
            <em>AI Self Portrait</em> is an experiment exploring the advancement of AI tech
            in 2024. The prompt was to use Processing 4 (a coding sketchbook for visual
            artists) to create digital visualizations and then explain the visuals.
          </>,
          `I then fed its explanations into a voice synthesizer, which I modified because,
           by this point, I was pretty spooked.`,
          `I found it to be an interesting experience that highlighted some strengths and
           weaknesses of the technology at the time.`,
        ],
      },
    ],
  },

  {
    slug: 'untitled-rotoscope',
    title: 'Untitled',
    medium: 'video',
    year: '2022',
    featured: false,
    thumbnail: null,
    summary: 'A rotoscope-style animation about the war in Ukraine.',
    blocks: [
      {
        type: 'vimeo',
        id: '1065173650',
        title: 'Untitled',
      },
      {
        type: 'statement',
        paragraphs: [
          `This is a rotoscope-style animation made with footage I shot before the war in
           Ukraine started, as well as video pulled from a Telegram channel after videos of
           the war began to come out.`,
          `I was pretty shocked when I started to see footage come out of Ukraine using some
           of the same tech I was using to do science experiments for my astronomy class.
           The shots I had were insanely similar.`,
          'Except instead of dropping hacky sacks, it was grenades.',
          <>
            <em>Music Credit: Taras Keen Zомбі</em>
          </>,
        ],
      },
    ],
  },

  {
    slug: 'street-lens',
    title: 'Street Lens',
    medium: 'web',
    year: '2026',
    featured: true,
    thumbnail: '/assets/images/web/streetlens.jpg',
    thumbnailAlt: 'Street Lens homepage — community discovery in a sea of images',
    summary: 'A virtual photography platform reshaping Google Street View into artistically composed images.',
    meta: [
      { label: 'Live site', value: 'streetlens.art' },
    ],
    blocks: [
      {
        type: 'statement',
        paragraphs: [
          <>
            <em>Street Lens</em> is a virtual photography platform I built that reshapes
            Google Street View documentation into artistically composed images —
            community discovery in a sea of images. Find your location, make your frame.
          </>,
          `Users explore the world through Street View, compose and capture frames, and
           share them to a community feed. Curated featured captures surface standout
           images from around the globe, each with location details and artist commentary.`,
          `The project draws inspiration from Jon Rafman, Doug Rickard, Michael Wolf, and
           Jacqui Kenny — artists who saw something more in Google's automated archive.
           Street Lens aims to create global connections by exposing people to parts of
           the world they may never have a chance to visit in reality.`,
        ],
      },
      {
        type: 'link',
        href: 'https://www.streetlens.art/',
        label: 'Visit streetlens.art',
      },
    ],
  },

  {
    slug: 'pacific-northwest-macro',
    title: 'Pacific Northwest Macro',
    medium: 'photography',
    year: '2024',
    featured: false,
    thumbnail: '/assets/images/photography/thumbnails/DSC03183_Thumb.jpg',
    thumbnailAlt: 'Moss Highway — macro photograph',
    summary: 'Close observations of the quieter details of the natural world.',
    blocks: [
      {
        type: 'statement',
        paragraphs: [
          `These photographs explore the quieter details of the natural world — the
           textures, patterns, and moments that are easy to overlook. Shot in the
           Pacific Northwest, the series focuses on abstracted organic forms: moss,
           leaves, berries, and the subtle geometry of the forest floor.`,
          `Each image is a close observation, an attempt to find something unfamiliar
           in the deeply familiar.`,
        ],
      },
      {
        type: 'gallery',
        items: [
          {
            thumb: '/assets/images/photography/thumbnails/DSC03226_Thumb.jpg',
            full: '/assets/images/photography/DSC03226_Original.jpg',
            caption: 'Leaf Feeling',
          },
          {
            thumb: '/assets/images/photography/thumbnails/DSC03183_Thumb.jpg',
            full: '/assets/images/photography/DSC03183_Original.jpg',
            caption: 'Moss Highway',
          },
          {
            thumb: '/assets/images/photography/thumbnails/DSC03230_Thumb.jpg',
            full: '/assets/images/photography/DSC03230_Original.jpg',
            caption: 'Lone Berry',
          },
        ],
      },
    ],
  },

  {
    slug: 'toadally-dreadful',
    title: 'Toadally Dreadful',
    medium: 'environment',
    year: '2024',
    featured: false,
    thumbnail: '/assets/images/environment-art/thumbnails/ToadallyDreadful_Thumb.jpg',
    thumbnailAlt: 'Camper Cabins environment — Toadally Dreadful',
    summary: 'Game environments built in Unity: campsite cabins, a lakeside, and natural terrain.',
    meta: [
      { label: 'Engine', value: 'Unity' },
    ],
    blocks: [
      {
        type: 'statement',
        paragraphs: [
          <>
            These environments were created for <em>Toadally Dreadful</em>, a game
            project built in Unity. The scenes include a campsite with cabins, a
            lakeside setting, and natural terrain with cliffs and trees — all designed
            to establish tone and atmosphere for the game world.
          </>,
          `Assets were built with a mix of original modeling and kit-bashing, then
           lit and composed in-engine.`,
        ],
      },
      {
        type: 'gallery',
        items: [
          {
            thumb: '/assets/images/environment-art/thumbnails/ToadallyDreadful_Thumb.jpg',
            full: '/assets/images/environment-art/Toadally Dreadful.jpg',
            caption: 'Camper Cabins',
          },
          {
            thumb: '/assets/images/environment-art/thumbnails/ToadallyDreadful2_Thumb.jpg',
            full: '/assets/images/environment-art/Toadally Dreadful 2.jpg',
            caption: 'Lake Scene',
          },
          {
            thumb: '/assets/images/environment-art/thumbnails/TD3_Thumb.png',
            full: '/assets/images/environment-art/TD3.png',
            caption: 'Cliffs, Rocks, and Trees',
          },
        ],
      },
    ],
  },

  {
    slug: 'feed-me-chef',
    title: 'Feed Me Chef!',
    medium: 'environment',
    year: '2025',
    featured: false,
    thumbnail: '/assets/images/Feed Me Chef!/ice cave/thumbnails/Full with octo arms.webp',
    thumbnailAlt: 'Ice cave environment from Feed Me Chef!',
    summary: 'Environment art for Feed Me Chef!, a cooking game that was cancelled in development.',
    meta: [
      { label: 'Project', value: 'Cancelled' },
    ],
    blocks: [
      {
        type: 'statement',
        paragraphs: [
          <>
            <em>Feed Me Chef!</em> was a co-op cooking game, cancelled partway through
            development. Players worked together to keep their sea monster guests fed
            while navigating a maze of obstacles across a series of platforms. These are
            the environments I built for it — three distinct stages the players would
            cook their way through.
          </>,
          `The Ice Cave centers on a fridge guarded by an octopus; the Kitchen sets the
           core cooking stage; and Route 66 takes the action out onto the open road.
           Though the game never shipped, the worlds were far enough along to stand on
           their own.`,
        ],
      },
      {
        type: 'carousel',
        label: 'Ice Cave',
        images: [
          'Full with octo arms',
          'From Inside',
          'Fridge 2',
          'fridge front',
          'Screenshot 2025-05-28 114341',
        ].map(name => ({
          thumb: `/assets/images/Feed Me Chef!/ice cave/thumbnails/${name}.webp`,
          full: `/assets/images/Feed Me Chef!/ice cave/full/${name}.webp`,
        })),
      },
      {
        type: 'carousel',
        label: 'Kitchen',
        images: [
          'Screenshot 2025-06-23 092935',
          'Screenshot 2025-06-23 093054',
          'Screenshot 2025-06-23 093121',
        ].map(name => ({
          thumb: `/assets/images/Feed Me Chef!/kitchen/thumbnails/${name}.webp`,
          full: `/assets/images/Feed Me Chef!/kitchen/full/${name}.webp`,
        })),
      },
      {
        type: 'carousel',
        label: 'Route 66',
        images: [
          'Screenshot 2025-06-27 095127',
          'Screenshot 2025-06-27 095217',
          'Screenshot 2025-06-27 095338',
        ].map(name => ({
          thumb: `/assets/images/Feed Me Chef!/route 66/thumbnails/${name}.webp`,
          full: `/assets/images/Feed Me Chef!/route 66/full/${name}.webp`,
        })),
      },
    ],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getProject(slug) {
  return PROJECTS.find(p => p.slug === slug) ?? null
}

export function getFeatured() {
  return PROJECTS.filter(p => p.featured)
}

export function getByMedium(key) {
  if (!key || key === 'all') return PROJECTS
  return PROJECTS.filter(p => p.medium === key)
}

export function getAdjacent(slug) {
  const i = PROJECTS.findIndex(p => p.slug === slug)
  if (i === -1) return { prev: null, next: null }
  return {
    prev: PROJECTS[(i - 1 + PROJECTS.length) % PROJECTS.length],
    next: PROJECTS[(i + 1) % PROJECTS.length],
  }
}
