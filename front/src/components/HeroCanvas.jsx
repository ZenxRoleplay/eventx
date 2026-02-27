import { Canvas } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'

function Orb({ position, color, scale = 1, distort = 0.35, speed = 1.5 }) {
  return (
    <Float speed={speed} rotationIntensity={0.3} floatIntensity={0.6}>
      <mesh position={position} scale={scale}>
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial
          color={color}
          distort={distort}
          speed={2.5}
          roughness={0.05}
          metalness={0.1}
          opacity={0.72}
          transparent
        />
      </mesh>
    </Float>
  )
}

function SmallOrb({ position, color, scale = 0.4 }) {
  return (
    <Float speed={2.5} rotationIntensity={0.6} floatIntensity={1}>
      <mesh position={position} scale={scale}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.2} opacity={0.6} transparent />
      </mesh>
    </Float>
  )
}

export default function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 50 }}
      gl={{ alpha: true, antialias: false, powerPreference: 'default' }}
      dpr={[1, 1]}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault()
        })
      }}
    >
      <ambientLight intensity={2.5} />
      <directionalLight position={[5, 8, 5]} intensity={2} color="#fff8f0" />
      <pointLight position={[-6, 4, 2]} intensity={2} color="#fca882" />
      <pointLight position={[6, -4, 2]} intensity={1.5} color="#c4b5fd" />

      <Orb position={[3.8, 0.6, -1]}  color="#fca882" scale={1.6} distort={0.4}  speed={1.2} />
      <Orb position={[-1.5, 2.5, -3]} color="#c4b5fd" scale={1.1} distort={0.3}  speed={0.9} />
      <Orb position={[1.2, -2.4, -2]} color="#93c5fd" scale={0.9} distort={0.45} speed={1.5} />
      <Orb position={[-3.5, -0.8, -2]}color="#6ee7b7" scale={0.8} distort={0.25} speed={1.1} />
      <Orb position={[2.5, 3, -4]}    color="#fde68a" scale={1.3} distort={0.2}  speed={0.8} />

      <SmallOrb position={[0.5, 1.5, 1]}  color="#fb923c" />
      <SmallOrb position={[-2, -2, 0]}    color="#a78bfa" />
      <SmallOrb position={[4.5, -1, -1]}  color="#34d399" />
    </Canvas>
  )
}
