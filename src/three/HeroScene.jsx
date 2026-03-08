import { Canvas } from '@react-three/fiber'
import { Suspense, useState, useEffect } from 'react'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import FloatingOrbs from './FloatingOrbs'

export default function HeroScene() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const [gyroEnabled, setGyroEnabled] = useState(false)
  const [needsPermission, setNeedsPermission] = useState(false)

  useEffect(() => {
    if (!isMobile) return
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      // iOS 13+ — must ask
      setNeedsPermission(true)
    } else {
      // Android / older iOS — fires without permission
      setGyroEnabled(true)
    }
  }, [isMobile])

  async function requestGyro() {
    try {
      const result = await DeviceOrientationEvent.requestPermission()
      if (result === 'granted') {
        setGyroEnabled(true)
        setNeedsPermission(false)
      }
    } catch (e) {
      console.warn('Gyro permission denied', e)
    }
  }

  return (
    <>
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
          dpr={isMobile ? [1, 1] : [1, 1.5]}
          gl={{ alpha: true, antialias: false }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.05} />
            <FloatingOrbs
            mobile={isMobile}
            gyroEnabled={gyroEnabled}
            xScale={isMobile ? 2.2 : 8}
            yScale={isMobile ? 1.925 : 7}
            pathY={isMobile ? 2 : 0}
          />
            {!isMobile && (
              <EffectComposer multisampling={0}>
                <Bloom
                  intensity={1.2}
                  luminanceThreshold={0.2}
                  luminanceSmoothing={0.9}
                  height={300}
                />
              </EffectComposer>
            )}
          </Suspense>
        </Canvas>
      </div>

      {needsPermission && (
        <button
          onClick={requestGyro}
          style={{
            position: 'absolute',
            bottom: 28,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            background: 'rgba(149, 255, 122, 0.1)',
            border: '1px solid rgba(149, 255, 122, 0.35)',
            color: '#95ff7a',
            borderRadius: 20,
            padding: '9px 22px',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            cursor: 'pointer',
            textTransform: 'uppercase',
          }}
        >
          Enable Motion
        </button>
      )}
    </>
  )
}
