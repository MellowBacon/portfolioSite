import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const ORB_COUNT = 60
const ACCENT = new THREE.Color('#95ff7a')
const GOLD = new THREE.Color('#ffcc00')

function Orb({ position, phase, radius, color }) {
  const ref = useRef()
  const baseX = position[0]
  const baseY = position[1]

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime
    ref.current.position.y = baseY + Math.sin(t * 0.6 + phase) * 0.4
    ref.current.position.x = baseX + Math.cos(t * 0.4 + phase) * 0.15
  })

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[radius, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.4}
        roughness={0.1}
        metalness={0.05}
      />
    </mesh>
  )
}

export default function FloatingOrbs() {
  const groupRef = useRef()
  const { pointer } = useThree()
  const targetRot = useRef({ x: 0, y: 0 })

  const orbs = useMemo(() => (
    Array.from({ length: ORB_COUNT }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6 - 2,
      ],
      phase: Math.random() * Math.PI * 2,
      radius: 0.04 + Math.random() * 0.18,
      color: i < 6 ? GOLD : ACCENT,
    }))
  ), [])

  useFrame(() => {
    if (!groupRef.current) return
    targetRot.current.x = pointer.y * 0.15
    targetRot.current.y = pointer.x * 0.25
    groupRef.current.rotation.x +=
      (targetRot.current.x - groupRef.current.rotation.x) * 0.05
    groupRef.current.rotation.y +=
      (targetRot.current.y - groupRef.current.rotation.y) * 0.05
  })

  return (
    <group ref={groupRef}>
      {orbs.map(orb => (
        <Orb key={orb.id} {...orb} />
      ))}
    </group>
  )
}
