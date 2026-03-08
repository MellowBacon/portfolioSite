import { Suspense, useState, useEffect, useRef, useCallback } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { useGLTF, useAnimations, OrbitControls, ContactShadows, Html } from '@react-three/drei'
import styles from './ModelViewer.module.css'

const MODELS = [
  { name: 'Les Paul',  file: '/assets/models/les paul.glb' },
  { name: 'Robot',     file: '/assets/models/Robot_Split.glb' },
  { name: 'Submarine', file: '/assets/models/Submarine.glb' },
]

// Preload all models
MODELS.forEach(m => useGLTF.preload(m.file))

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

function ModelScene({ modelFile, wireframe, autoRotate, animIndex, onClipsReady }) {
  const { scene, animations } = useGLTF(modelFile)
  const { actions, clips } = useAnimations(animations, scene)
  const controlsRef = useRef()

  // Report clip count to parent
  useEffect(() => {
    onClipsReady(clips)
  }, [clips, onClipsReady])

  // Play selected animation
  useEffect(() => {
    if (!clips.length) return
    Object.values(actions).forEach(a => a.stop())
    const clip = clips[animIndex % clips.length]
    if (clip) actions[clip.name]?.reset().play()
  }, [actions, clips, animIndex, modelFile])

  // Toggle wireframe
  useEffect(() => {
    scene.traverse(obj => {
      if (obj.isMesh) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(m => { m.wireframe = wireframe })
        } else if (obj.material) {
          obj.material.wireframe = wireframe
        }
      }
    })
  }, [wireframe, scene])

  return (
    <>
      <primitive object={scene} />
      <OrbitControls
        ref={controlsRef}
        autoRotate={autoRotate}
        autoRotateSpeed={1.2}
        makeDefault
        enableDamping
        dampingFactor={0.08}
      />
      <ContactShadows
        position={[0, -0.01, 0]}
        opacity={0.4}
        scale={10}
        blur={2}
        far={4}
      />
    </>
  )
}

export default function ModelViewer() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [wireframe, setWireframe] = useState(false)
  const [autoRotate, setAutoRotate] = useState(true)
  const [animIndex, setAnimIndex] = useState(0)
  const [clips, setClips] = useState([])
  const [resetTrigger, setResetTrigger] = useState(0)

  const handleModelSwitch = (i) => {
    setActiveIndex(i)
    setAnimIndex(0)
    setClips([])
  }

  const handleClipsReady = useCallback((c) => {
    setClips(c)
    setAnimIndex(0)
  }, [])

  const currentClipName = clips[animIndex % (clips.length || 1)]?.name ?? null

  return (
    <div className={styles.viewer}>
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

      <div className={styles.canvasWrap}>
        <Canvas
          shadows
          dpr={[1, 1.5]}
          camera={{ position: [0, 1.5, 4], fov: 45 }}
          gl={{ antialias: true }}
          style={{ background: '#1a1a1a' }}
        >
          <color attach="background" args={['#1a1a1a']} />
          <ambientLight intensity={0.15} />
          <directionalLight position={[5, 5, 3]} intensity={1.8} castShadow />
          <directionalLight position={[-4, 2, -3]} intensity={0.6} color="#8ab4f8" />

          <Suspense fallback={
            <Html center>
              <span className={styles.loading}>Loading…</span>
            </Html>
          }>
            <ModelScene
              key={MODELS[activeIndex].file}
              modelFile={MODELS[activeIndex].file}
              wireframe={wireframe}
              autoRotate={autoRotate}
              animIndex={animIndex}
              onClipsReady={handleClipsReady}
            />
          </Suspense>

          <CameraReset trigger={resetTrigger} />
        </Canvas>
      </div>

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
