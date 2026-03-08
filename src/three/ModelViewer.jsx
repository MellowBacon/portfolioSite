import { Suspense, useState, useEffect, useRef, useCallback } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations, useTexture, OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'
import styles from './ModelViewer.module.css'

const MODELS = [
  { name: 'Ballbot',   file: '/assets/models/Ballbot.glb', isBallbot: true },
  { name: 'Les Paul',  file: '/assets/models/les paul.glb' },
  { name: 'Submarine', file: '/assets/models/Submarine.glb' },
]

const EMOTIONS = [
  { name: '-_-',      file: '/assets/models/robot facial animations/-_-/-_- strip.png' },
  { name: 'Angry',    file: '/assets/models/robot facial animations/angry/angry.png' },
  { name: 'Blink',    file: '/assets/models/robot facial animations/blink/Test Blink Animation no CRT_green_alpha.png', rows: 1 },
  { name: 'Happy',    file: '/assets/models/robot facial animations/happy/happy.png' },
  { name: 'oO',       file: '/assets/models/robot facial animations/oO/oO.png' },
  { name: 'Sad',      file: '/assets/models/robot facial animations/sad/Sad.png' },
  { name: 'Skeptical',file: '/assets/models/robot facial animations/skeptical/skeptical.png' },
]

// Sprite grid constants (defaults — overridden per emotion via EMOTIONS[].rows)
const COLS = 4
const DEFAULT_ROWS = 2
const FPS = 8

// Set this to the bone name from Ballbot.glb that the screen should follow.
// Leave null to log all bone names to console so you can identify the right one.
const SCREEN_BONE = 'root_bone'

// Preload all models
MODELS.forEach(m => useGLTF.preload(m.file))
useGLTF.preload('/assets/models/Ballbot_screen.glb')

// ─── Camera reset helper ──────────────────────────────────────────────────────
function CameraReset({ trigger }) {
  const { camera, controls } = useThree()
  useEffect(() => {
    if (!trigger) return
    camera.position.set(0, 1.5, 4)
    camera.lookAt(0, 0, 0)
    if (controls) controls.reset()
  }, [trigger, camera, controls])
  return null
}

// ─── Ballbot: body + screen + sprite animation ────────────────────────────────
function BallbotScene({ wireframe, autoRotate, emotionFile, emotionRows, animIndex, onClipsReady }) {
  const { scene: bodyScene, animations } = useGLTF('/assets/models/Ballbot.glb')
  const { scene: screenScene } = useGLTF('/assets/models/Ballbot_screen.glb')
  const { actions, clips } = useAnimations(animations, bodyScene)

  const texture = useTexture(emotionFile)
  const frameRef = useRef(0)
  const timeRef = useRef(0)
  const waitRef = useRef(0)        // countdown timer between cycles
  const playingRef = useRef(true)  // true = animating, false = waiting
  const uvMappingRef = useRef(null)

  // Parent screen to bone once both scenes are loaded
  useEffect(() => {
    const bones = []
    bodyScene.traverse(node => { if (node.isBone) bones.push(node.name) })

    if (!SCREEN_BONE) {
      console.log('[Ballbot] Available bones — set SCREEN_BONE to one of these:', bones)
      return
    }

    const targetBone = bodyScene.getObjectByName(SCREEN_BONE)
    if (targetBone) {
      // attach() re-parents while preserving world-space transform
      targetBone.attach(screenScene)
    } else {
      console.warn(`[Ballbot] Bone "${SCREEN_BONE}" not found. Available:`, bones)
    }
  }, [bodyScene, screenScene])

  // Setup sprite texture tiling once per texture load
  useEffect(() => {
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.minFilter = THREE.NearestFilter
    texture.magFilter = THREE.NearestFilter

    // Apply frame 0 immediately using the computed UV mapping
    if (uvMappingRef.current) {
      const { rx, ry, baseOffsetX, baseOffsetY } = uvMappingRef.current
      texture.repeat.set(rx, ry)
      texture.offset.set(baseOffsetX, baseOffsetY) // frame 0
    }
    texture.needsUpdate = true

    // Replace screen mesh material with an unlit (MeshBasicMaterial) so the
    // sprite shows at full brightness regardless of scene lighting.
    screenScene.traverse(obj => {
      if (!obj.isMesh) return
      // Compute UV island bounds to map sprite frames to the exact screen region
      const uvAttr = obj.geometry.attributes.uv
      let minU = Infinity, maxU = -Infinity, minV = Infinity, maxV = -Infinity
      for (let i = 0; i < uvAttr.count; i++) {
        minU = Math.min(minU, uvAttr.getX(i))
        maxU = Math.max(maxU, uvAttr.getX(i))
        minV = Math.min(minV, uvAttr.getY(i))
        maxV = Math.max(maxV, uvAttr.getY(i))
      }
      const uvW = maxU - minU
      const uvH = maxV - minV
      const rx = 1 / (COLS * uvW)
      const ry = 1 / (emotionRows * uvH)
      uvMappingRef.current = {
        rx, ry,
        baseOffsetX: -minU * rx,
        baseOffsetY: (emotionRows - 1) / emotionRows - minV * ry,
      }

      obj.material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    })

    // Reset to frame 0 when emotion changes
    frameRef.current = 0
    timeRef.current = 0
    waitRef.current = 0
    playingRef.current = true
  }, [texture, screenScene, emotionRows])

  // Report clips to parent
  useEffect(() => { onClipsReady(clips) }, [clips, onClipsReady])

  // Play body animations
  useEffect(() => {
    if (!clips.length) return
    Object.values(actions).forEach(a => a.stop())
    const clip = clips[animIndex % clips.length]
    if (clip) actions[clip.name]?.reset().play()
  }, [actions, clips, animIndex])

  // Step sprite frames with random pauses between cycles
  useFrame((_, delta) => {
    if (!uvMappingRef.current) return
    const { rx, ry, baseOffsetX, baseOffsetY } = uvMappingRef.current

    if (!playingRef.current) {
      // Waiting between cycles
      waitRef.current -= delta
      if (waitRef.current <= 0) {
        playingRef.current = true
        frameRef.current = 0
        timeRef.current = 0
        texture.repeat.set(rx, ry)
        texture.offset.set(baseOffsetX, baseOffsetY)
      }
      return
    }

    timeRef.current += delta
    if (timeRef.current < 1 / FPS) return
    timeRef.current = 0

    const totalFrames = COLS * emotionRows
    frameRef.current++

    if (frameRef.current >= totalFrames) {
      // Cycle complete — hold frame 0, wait 1–4 s before replaying
      frameRef.current = 0
      playingRef.current = false
      waitRef.current = 1 + Math.random() * 3
      texture.repeat.set(rx, ry)
      texture.offset.set(baseOffsetX, baseOffsetY)
      return
    }

    const col = frameRef.current % COLS
    const row = Math.floor(frameRef.current / COLS)
    texture.repeat.set(rx, ry)
    texture.offset.set(
      col / COLS + baseOffsetX,
      baseOffsetY - row / emotionRows
    )
  })

  // Wireframe toggle across both scenes
  useEffect(() => {
    ;[bodyScene, screenScene].forEach(s =>
      s.traverse(obj => {
        if (!obj.isMesh) return
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
        mats.forEach(m => { m.wireframe = wireframe })
      })
    )
  }, [wireframe, bodyScene, screenScene])

  return (
    <>
      <primitive object={bodyScene} />
      {/* screenScene is rendered via bodyScene once attached to a bone.
          Fall back to rendering it independently until SCREEN_BONE is set. */}
      {!SCREEN_BONE && <primitive object={screenScene} />}
      <OrbitControls autoRotate={autoRotate} autoRotateSpeed={1.2} makeDefault enableDamping dampingFactor={0.08} />
    </>
  )
}

// ─── Generic model scene (Les Paul, Submarine, etc.) ─────────────────────────
function ModelScene({ modelFile, wireframe, autoRotate, animIndex, onClipsReady }) {
  const { scene, animations } = useGLTF(modelFile)
  const { actions, clips } = useAnimations(animations, scene)

  useEffect(() => { onClipsReady(clips) }, [clips, onClipsReady])

  useEffect(() => {
    if (!clips.length) return
    Object.values(actions).forEach(a => a.stop())
    const clip = clips[animIndex % clips.length]
    if (clip) actions[clip.name]?.reset().play()
  }, [actions, clips, animIndex, modelFile])

  useEffect(() => {
    scene.traverse(obj => {
      if (!obj.isMesh) return
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
      mats.forEach(m => { m.wireframe = wireframe })
    })
  }, [wireframe, scene])

  return (
    <>
      <primitive object={scene} />
      <OrbitControls autoRotate={autoRotate} autoRotateSpeed={1.2} makeDefault enableDamping dampingFactor={0.08} />
    </>
  )
}

// ─── Main viewer ──────────────────────────────────────────────────────────────
export default function ModelViewer() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [wireframe, setWireframe] = useState(false)
  const [autoRotate, setAutoRotate] = useState(true)
  const [animIndex, setAnimIndex] = useState(0)
  const [clips, setClips] = useState([])
  const [resetTrigger, setResetTrigger] = useState(0)
  const [emotionIndex, setEmotionIndex] = useState(0)

  const handleModelSwitch = (i) => {
    setActiveIndex(i)
    setAnimIndex(0)
    setClips([])
  }

  const handleClipsReady = useCallback((c) => {
    setClips(c)
    setAnimIndex(0)
  }, [])

  const isBallbot = MODELS[activeIndex].isBallbot
  const currentClipName = clips[animIndex % (clips.length || 1)]?.name ?? null

  return (
    <div className={styles.viewer}>
      {/* Model tabs */}
      <div className={styles.modelTabs}>
        {MODELS.map((m, i) => (
          <button
            key={m.file}
            className={`${styles.tabBtn} ${i === activeIndex ? styles.active : ''}`}
            onClick={() => handleModelSwitch(i)}
          >
            {m.name}
          </button>
        ))}
      </div>

      {/* Emotion tabs — only when Ballbot is active */}
      {isBallbot && (
        <div className={styles.emotionTabs}>
          {EMOTIONS.map((e, i) => (
            <button
              key={e.name}
              className={`${styles.emotionBtn} ${i === emotionIndex ? styles.active : ''}`}
              onClick={() => setEmotionIndex(i)}
            >
              {e.name}
            </button>
          ))}
        </div>
      )}

      {/* Canvas */}
      <div className={styles.canvasWrap}>
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 1.5, 4], fov: 45 }}
          gl={{ antialias: true }}
          style={{ background: '#1a1a1a' }}
        >
          <color attach="background" args={['#1a1a1a']} />
          <ambientLight intensity={0.15} />
          <directionalLight position={[5, 5, 3]} intensity={1.8} />
          <directionalLight position={[-4, 2, -3]} intensity={0.6} color="#8ab4f8" />

          <Suspense fallback={
            <Html center>
              <span className={styles.loading}>Loading…</span>
            </Html>
          }>
            {isBallbot ? (
              <BallbotScene
                key="ballbot"
                wireframe={wireframe}
                autoRotate={autoRotate}
                emotionFile={EMOTIONS[emotionIndex].file}
                emotionRows={EMOTIONS[emotionIndex].rows ?? DEFAULT_ROWS}
                animIndex={animIndex}
                onClipsReady={handleClipsReady}
              />
            ) : (
              <ModelScene
                key={MODELS[activeIndex].file}
                modelFile={MODELS[activeIndex].file}
                wireframe={wireframe}
                autoRotate={autoRotate}
                animIndex={animIndex}
                onClipsReady={handleClipsReady}
              />
            )}
          </Suspense>

          <CameraReset trigger={resetTrigger} />
        </Canvas>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <button
          className={`${styles.controlBtn} ${wireframe ? styles.on : ''}`}
          onClick={() => setWireframe(w => !w)}
        >
          ⬡ Wireframe
        </button>
        <button
          className={`${styles.controlBtn} ${autoRotate ? styles.on : ''}`}
          onClick={() => setAutoRotate(r => !r)}
        >
          ↺ Auto-rotate
        </button>
        <button
          className={styles.controlBtn}
          onClick={() => setResetTrigger(t => t + 1)}
        >
          ⌂ Reset camera
        </button>

        {clips.length > 1 && (
          <div className={styles.animControls}>
            <button
              className={styles.controlBtn}
              onClick={() => setAnimIndex(i => (i - 1 + clips.length) % clips.length)}
            >
              ◀
            </button>
            <span className={styles.animLabel}>{currentClipName}</span>
            <button
              className={styles.controlBtn}
              onClick={() => setAnimIndex(i => (i + 1) % clips.length)}
            >
              ▶
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
