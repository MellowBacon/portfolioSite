import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const ORB_COUNT = 80
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

export default function FloatingOrbs() {
  const meshRef = useRef()
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    function onMove(e) {
      const ndcX = (e.clientX / window.innerWidth) * 2 - 1
      const ndcY = -((e.clientY / window.innerHeight) * 2 - 1)
      const halfH = Math.tan((60 * Math.PI) / 180 / 2) * 8
      const halfW = halfH * (window.innerWidth / window.innerHeight)
      mouse.current.x = ndcX * halfW
      mouse.current.y = ndcY * halfH
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

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
  ), [])

  const physState = useRef(
    orbs.map(orb => {
      const { x, y } = lemniscatePoint(orb.tOffset)
      return {
        pos: new THREE.Vector3(x, y, orb.z),
        vel: new THREE.Vector3(),
      }
    })
  )

  // Set per-instance colors once on mount
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
    const { x: mouseX, y: mouseY } = mouse.current

    orbs.forEach((orb, i) => {
      const { pos, vel } = physState.current[i]

      const param = t * orb.speed + orb.tOffset
      const { x: tx, y: ty } = lemniscatePoint(param)
      const targetX = tx + Math.sin(t * 1.1 + orb.wobblePhase) * orb.wobbleAmp
      const targetY = ty + Math.cos(t * 0.8 + orb.wobblePhase) * orb.wobbleAmp * 0.5

      const k = 6, damp = 7
      vel.x += ((targetX - pos.x) * k - vel.x * damp) * dt
      vel.y += ((targetY - pos.y) * k - vel.y * damp) * dt
      vel.z += ((orb.z - pos.z) * k - vel.z * damp) * dt

      const dx = pos.x - mouseX
      const dy = pos.y - mouseY
      const dist = Math.sqrt(dx * dx + dy * dy)
      const repelRadius = 3.5
      if (dist < repelRadius && dist > 0.001) {
        const strength = (1 - dist / repelRadius) * 12
        vel.x += (dx / dist) * strength * dt
        vel.y += (dy / dist) * strength * dt
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
