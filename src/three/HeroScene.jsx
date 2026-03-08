import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import FloatingOrbs from './FloatingOrbs'

export default function HeroScene() {
  // Swap to CSS gradient on mobile to save GPU
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return null
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: false }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.05} />
          <FloatingOrbs />
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={1.2}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
              height={300}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}
