import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const ACCENT = new THREE.Color('#95ff7a')
const GOLD = new THREE.Color('#ffcc00')

function lemniscatePoint(t, xScale = 8, yScale = 7) {
  const s = Math.sin(t)
  const c = Math.cos(t)
  const denom = 1 + s * s
  return { x: xScale * c / denom, y: yScale * s * c / denom }
}

const _matrix = new THREE.Matrix4()
const _pos = new THREE.Vector3()
const _scale = new THREE.Vector3()
const _quat = new THREE.Quaternion()

function toWorld(clientX, clientY) {
  const ndcX = (clientX / window.innerWidth) * 2 - 1
  const ndcY = -((clientY / window.innerHeight) * 2 - 1)
  const halfH = Math.tan((60 * Math.PI) / 180 / 2) * 8
  const halfW = halfH * (window.innerWidth / window.innerHeight)
  return { x: ndcX * halfW, y: ndcY * halfH }
}

export default function FloatingOrbs({ mobile = false }) {
  const ORB_COUNT = mobile ? 40 : 80
  const meshRef = useRef()

  // Desktop: mouse position for repel
  const mouse = useRef({ x: 0, y: 0 })

  // Mobile: smoothed gyro offset applied to all orb targets
  const gyroSmooth = useRef({ x: 0, y: 0 })
  const gyroRaw = useRef({ x: 0, y: 0 })

  // Mobile: tap burst — decays to 0 after firing
  const burst = useRef({ x: 0, y: 0, strength: 0 })

  // Desktop mouse parallax
  useEffect(() => {
    if (mobile) return
    function onMove(e) {
      const { x, y } = toWorld(e.clientX, e.clientY)
      mouse.current.x = x
      mouse.current.y = y
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [mobile])

  // Mobile gyroscope
  useEffect(() => {
    if (!mobile) return
    function onOrientation(e) {
      // gamma: left/right tilt (-90..90), beta: front/back (~0..90 when held upright)
      const gx = (e.gamma ?? 0) * 0.09
      const gy = ((e.beta ?? 45) - 45) * -0.07
      gyroRaw.current.x = Math.max(-5, Math.min(5, gx))
      gyroRaw.current.y = Math.max(-4, Math.min(4, gy))
    }
    window.addEventListener('deviceorientation', onOrientation)
    return () => window.removeEventListener('deviceorientation', onOrientation)
  }, [mobile])

  // Mobile tap burst
  useEffect(() => {
    if (!mobile) return
    function onTouch(e) {
      const touch = e.touches[0]
      if (!touch) return
      const { x, y } = toWorld(touch.clientX, touch.clientY)
      burst.current.x = x
      burst.current.y = y
      burst.current.strength = 22
    }
    window.addEventListener('touchstart', onTouch, { passive: true })
    return () => window.removeEventListener('touchstart', onTouch)
  }, [mobile])

  const orbs = useMemo(() => (
    Array.from({ length: ORB_COUNT }, (_, i) => ({
      tOffset: (i / ORB_COUNT) * Math.PI * 2,
      speed: 0.15 + Math.random() * 0.07,
      wobblePhase: Math.random() * Math.PI * 2,
      wobbleAmp: 0.05 + Math.random() * 0.12,
      z: (Math.random() - 0.5) * 3 - 1,
      radius: 0.04 + Math.random() * 0.18,
      color: i < 8 ? GOLD : ACCENT,
    }))
  ), [ORB_COUNT])

  const physState = useRef(
    orbs.map(orb => {
      const { x, y } = lemniscatePoint(orb.tOffset)
      return {
        pos: new THREE.Vector3(x, y, orb.z),
        vel: new THREE.Vector3(),
      }
    })
  )

  useEffect(() => {
    if (!meshRef.current) return
    orbs.forEach((orb, i) => {
      meshRef.current.setColorAt(i, orb.color)
    })
    meshRef.current.instanceColor.needsUpdate = true
  }, [orbs])

  useFrame(({ clock }, delta) => {
    if (!meshRef.current) return
    const t = clock.elapsedTime
    const dt = Math.min(delta, 0.05)

    // Lerp gyro toward raw reading
    if (mobile) {
      const a = 1 - Math.pow(0.04, dt)
      gyroSmooth.current.x += (gyroRaw.current.x - gyroSmooth.current.x) * a
      gyroSmooth.current.y += (gyroRaw.current.y - gyroSmooth.current.y) * a
    }

    // Capture + decay burst this frame
    const burstStr = burst.current.strength
    burst.current.strength = Math.max(0, burstStr - burstStr * 9 * dt)

    orbs.forEach((orb, i) => {
      const { pos, vel } = physState.current[i]

      const param = t * orb.speed + orb.tOffset
      const { x: tx, y: ty } = lemniscatePoint(param)

      // Gyro shifts the lemniscate target on mobile
      const offX = mobile ? gyroSmooth.current.x : 0
      const offY = mobile ? gyroSmooth.current.y : 0
      const targetX = tx + Math.sin(t * 1.1 + orb.wobblePhase) * orb.wobbleAmp + offX
      const targetY = ty + Math.cos(t * 0.8 + orb.wobblePhase) * orb.wobbleAmp * 0.5 + offY

      const k = 6, damp = 7
      vel.x += ((targetX - pos.x) * k - vel.x * damp) * dt
      vel.y += ((targetY - pos.y) * k - vel.y * damp) * dt
      vel.z += ((orb.z - pos.z) * k - vel.z * damp) * dt

      if (!mobile) {
        // Desktop: smooth repel from mouse cursor
        const dx = pos.x - mouse.current.x
        const dy = pos.y - mouse.current.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const repelRadius = 3.5
        if (dist < repelRadius && dist > 0.001) {
          const strength = (1 - dist / repelRadius) * 12
          vel.x += (dx / dist) * strength * dt
          vel.y += (dy / dist) * strength * dt
        }
      } else if (burstStr > 0.2) {
        // Mobile: burst all orbs outward from tap point
        const dx = pos.x - burst.current.x
        const dy = pos.y - burst.current.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist > 0.001) {
          const strength = burstStr / (1 + dist * 0.3)
          vel.x += (dx / dist) * strength * dt
          vel.y += (dy / dist) * strength * dt
        }
      }

      pos.addScaledVector(vel, dt)

      _pos.set(pos.x, pos.y, pos.z)
      _scale.setScalar(orb.radius)
      _matrix.compose(_pos, _quat, _scale)
      meshRef.current.setMatrixAt(i, _matrix)
    })

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[null, null, ORB_COUNT]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        emissive={ACCENT}
        emissiveIntensity={1.4}
        roughness={0.1}
        metalness={0.05}
      />
    </instancedMesh>
  )
}
