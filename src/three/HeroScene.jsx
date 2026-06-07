import { Canvas } from '@react-three/fiber'
import { Suspense, useState, useEffect } from 'react'
import FloatingOrbs from './FloatingOrbs'
import styles from './HeroScene.module.css'

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
      <div className={styles.canvasLayer}>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 60 }}
          dpr={isMobile ? [1, 1] : [1, 1.5]}
          gl={{ alpha: true, antialias: false }}
        >
          <Suspense fallback={null}>
            <FloatingOrbs
              mobile={isMobile}
              gyroEnabled={gyroEnabled}
              xScale={isMobile ? 2.2 : 8}
              yScale={isMobile ? 1.925 : 7}
              pathY={isMobile ? 2 : 0}
            />
          </Suspense>
        </Canvas>
      </div>

      {needsPermission && (
        <button onClick={requestGyro} className={styles.gyroBtn}>
          Enable Motion
        </button>
      )}
    </>
  )
}
