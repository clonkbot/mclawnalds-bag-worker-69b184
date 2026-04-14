import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Float, Text, OrbitControls } from '@react-three/drei'
import { Fry } from '../types'

interface GameSceneProps {
  fries: Fry[]
  onFryGrab: (id: number) => void
  showRonald: boolean
  combo: number
}

// AI Robot Claw Worker - Pixelart inspired 3D
function AIClawRobot({ combo }: { combo: number }) {
  const groupRef = useRef<THREE.Group>(null!)
  const clawRef = useRef<THREE.Group>(null!)
  const eyeLeftRef = useRef<THREE.Mesh>(null!)
  const eyeRightRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    // Subtle idle bob
    groupRef.current.position.y = Math.sin(t * 2) * 0.05
    // Claw opens and closes based on combo
    const clawAngle = 0.2 + (combo * 0.03)
    clawRef.current.children[0].rotation.z = clawAngle
    clawRef.current.children[1].rotation.z = -clawAngle
    // Glitchy eye movement
    if (Math.random() < 0.02) {
      eyeLeftRef.current.position.x = -0.15 + (Math.random() - 0.5) * 0.05
      eyeRightRef.current.position.x = 0.15 + (Math.random() - 0.5) * 0.05
    }
  })

  return (
    <group ref={groupRef} position={[0, -0.5, 2]}>
      {/* Robot body - blocky pixel style */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 0.8, 0.6]} />
        <meshStandardMaterial color="#3d3d3d" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Face screen */}
      <mesh position={[0, 0.1, 0.31]}>
        <planeGeometry args={[0.7, 0.5]} />
        <meshBasicMaterial color="#0a0a0a" />
      </mesh>

      {/* Dead eyes */}
      <mesh ref={eyeLeftRef} position={[-0.15, 0.15, 0.32]}>
        <circleGeometry args={[0.08, 6]} />
        <meshBasicMaterial color="#ff3333" />
      </mesh>
      <mesh ref={eyeRightRef} position={[0.15, 0.15, 0.32]}>
        <circleGeometry args={[0.08, 6]} />
        <meshBasicMaterial color="#ff3333" />
      </mesh>
      {/* X eyes for dead look */}
      <Text position={[-0.15, 0.15, 0.33]} fontSize={0.1} color="#330000">
        X
      </Text>
      <Text position={[0.15, 0.15, 0.33]} fontSize={0.1} color="#330000">
        X
      </Text>

      {/* Arm/Claw mechanism */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.15, 0.5, 0.15]} />
        <meshStandardMaterial color="#555555" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Claw */}
      <group ref={clawRef} position={[0, 0.8, 0]}>
        <mesh position={[-0.1, 0.15, 0]} rotation={[0, 0, 0.3]}>
          <boxGeometry args={[0.05, 0.25, 0.08]} />
          <meshStandardMaterial color="#777777" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0.1, 0.15, 0]} rotation={[0, 0, -0.3]}>
          <boxGeometry args={[0.05, 0.25, 0.08]} />
          <meshStandardMaterial color="#777777" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Static/glitch effect */}
      <mesh position={[0, 0, 0.35]}>
        <planeGeometry args={[1, 0.8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.02} />
      </mesh>
    </group>
  )
}

// Ronald McDonald as a whale in a suit
function RonaldWhale({ visible }: { visible: boolean }) {
  const ref = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (!visible) return
    const t = state.clock.elapsedTime
    ref.current.position.x = Math.sin(t * 0.5) * 3
    ref.current.position.y = 4 + Math.sin(t * 2) * 0.3
    ref.current.rotation.y = Math.sin(t * 0.5) * 0.3
  })

  if (!visible) return null

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={ref} position={[0, 4, -2]} scale={0.8}>
        {/* Whale body */}
        <mesh>
          <capsuleGeometry args={[0.8, 2, 8, 16]} />
          <meshStandardMaterial color="#2a4a6a" metalness={0.3} roughness={0.7} />
        </mesh>

        {/* Suit jacket */}
        <mesh position={[0, -0.3, 0.4]}>
          <boxGeometry args={[1.4, 1.5, 0.4]} />
          <meshStandardMaterial color="#1a1a2a" metalness={0.5} roughness={0.5} />
        </mesh>

        {/* Red tie (McDonald's red) */}
        <mesh position={[0, -0.3, 0.65]}>
          <boxGeometry args={[0.2, 1, 0.1]} />
          <meshStandardMaterial color="#cc0000" />
        </mesh>

        {/* Ronald's signature red hair/wig */}
        <mesh position={[0, 0.9, 0]}>
          <sphereGeometry args={[0.5, 8, 8]} />
          <meshStandardMaterial color="#ff2200" roughness={1} />
        </mesh>

        {/* Evil eyes */}
        <mesh position={[-0.25, 0.5, 0.75]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshBasicMaterial color="#ffff00" />
        </mesh>
        <mesh position={[0.25, 0.5, 0.75]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshBasicMaterial color="#ffff00" />
        </mesh>

        {/* Top hat (whale in suit) */}
        <mesh position={[0, 1.3, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.5, 8]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
        <mesh position={[0, 1.05, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.1, 8]} />
          <meshStandardMaterial color="#111111" />
        </mesh>

        {/* Whale tail fin */}
        <mesh position={[0, 0, -1.5]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.5, 1, 4]} />
          <meshStandardMaterial color="#2a4a6a" metalness={0.3} roughness={0.7} />
        </mesh>

        {/* Text label */}
        <Text position={[0, -1.5, 0.5]} fontSize={0.2} color="#ffcc00" anchorX="center">
          WHALE ALERT
        </Text>
      </group>
    </Float>
  )
}

// Individual Fry component
function FryObject({ fry, onGrab }: { fry: Fry; onGrab: () => void }) {
  const ref = useRef<THREE.Group>(null!)
  const fallSpeed = useRef(Math.random() * 0.5 + 0.5)
  const rotationSpeed = useRef((Math.random() - 0.5) * 2)
  const wobble = useRef(Math.random() * Math.PI * 2)

  useFrame((state, delta) => {
    if (!ref.current) return
    // Fall down
    ref.current.position.y -= delta * fallSpeed.current
    // Wobble
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 3 + wobble.current) * 0.3
    ref.current.rotation.x += delta * rotationSpeed.current
    // Remove if too low
    if (ref.current.position.y < -2) {
      ref.current.visible = false
    }
  })

  return (
    <group
      ref={ref}
      position={[fry.x, 5, fry.z]}
      onClick={(e) => {
        e.stopPropagation()
        onGrab()
      }}
      onPointerDown={(e) => {
        e.stopPropagation()
        onGrab()
      }}
    >
      {/* Fry body - golden crispy */}
      <mesh castShadow>
        <boxGeometry args={[0.08, 0.6, 0.08]} />
        <meshStandardMaterial
          color="#f4b942"
          roughness={0.6}
          metalness={0.1}
          emissive="#4a3510"
          emissiveIntensity={0.1}
        />
      </mesh>
      {/* Slightly darker tips */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.085, 0.15, 0.085]} />
        <meshStandardMaterial color="#c4891f" roughness={0.7} />
      </mesh>
      {/* Hit area (invisible, larger) */}
      <mesh visible={false}>
        <boxGeometry args={[0.5, 1, 0.5]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  )
}

// Fryer machine
function Fryer() {
  return (
    <group position={[0, 0.5, -1]}>
      {/* Fryer base */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[3, 1, 2]} />
        <meshStandardMaterial color="#777777" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Oil basin */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[2.5, 0.4, 1.5]} />
        <meshStandardMaterial color="#3a2a1a" metalness={0.2} roughness={0.8} />
      </mesh>

      {/* Bubbling oil surface */}
      <mesh position={[0, 0.55, 0]}>
        <planeGeometry args={[2.4, 1.4]} />
        <meshStandardMaterial
          color="#5a4020"
          metalness={0.3}
          roughness={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Heat lamps */}
      {[-1, 0, 1].map((x, i) => (
        <group key={i} position={[x, 2, 0]}>
          <mesh>
            <cylinderGeometry args={[0.15, 0.2, 0.3, 8]} />
            <meshStandardMaterial color="#333333" metalness={0.9} />
          </mesh>
          <pointLight color="#ff6600" intensity={0.5} distance={3} />
        </group>
      ))}

      {/* Control panel */}
      <mesh position={[1.3, 0.8, 0.5]}>
        <boxGeometry args={[0.3, 0.4, 0.3]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      {/* Buttons */}
      {[0.1, 0, -0.1].map((y, i) => (
        <mesh key={i} position={[1.45, 0.8 + y, 0.5]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color={['#ff0000', '#00ff00', '#ffff00'][i]} />
        </mesh>
      ))}
    </group>
  )
}

// Counter/workspace
function Counter() {
  return (
    <group position={[0, -0.5, 1]}>
      {/* Counter surface - greasy stainless steel look */}
      <mesh receiveShadow>
        <boxGeometry args={[6, 0.2, 3]} />
        <meshStandardMaterial
          color="#888888"
          metalness={0.9}
          roughness={0.4}
        />
      </mesh>

      {/* Paper bag */}
      <group position={[1.5, 0.4, 0.5]}>
        <mesh>
          <boxGeometry args={[0.5, 0.7, 0.3]} />
          <meshStandardMaterial color="#b5842a" roughness={1} />
        </mesh>
        {/* McLawnald's logo (simple M) */}
        <Text position={[0, 0.1, 0.16]} fontSize={0.25} color="#cc0000" anchorX="center">
          M
        </Text>
      </group>

      {/* Salt shaker */}
      <mesh position={[-1.5, 0.3, 0.5]}>
        <cylinderGeometry args={[0.08, 0.1, 0.3, 8]} />
        <meshStandardMaterial color="#eeeeee" />
      </mesh>
    </group>
  )
}

// Floor
function Floor() {
  const floorRef = useRef<THREE.Mesh>(null!)

  // Create checkered texture
  const floorTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')!
    const tileSize = 32

    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        ctx.fillStyle = (x + y) % 2 === 0 ? '#4a3a2a' : '#3a2a1a'
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize)
      }
    }

    // Add grease stains
    ctx.fillStyle = 'rgba(60, 40, 20, 0.3)'
    for (let i = 0; i < 5; i++) {
      ctx.beginPath()
      ctx.ellipse(
        Math.random() * 256,
        Math.random() * 256,
        Math.random() * 30 + 10,
        Math.random() * 20 + 5,
        Math.random() * Math.PI,
        0,
        Math.PI * 2
      )
      ctx.fill()
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(4, 4)
    return texture
  }, [])

  return (
    <mesh ref={floorRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial map={floorTexture} roughness={0.8} />
    </mesh>
  )
}

// Walls
function Walls() {
  const wallTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')!

    // Grimy yellow wall
    ctx.fillStyle = '#c4a035'
    ctx.fillRect(0, 0, 256, 256)

    // Tile lines
    ctx.strokeStyle = '#9a8025'
    ctx.lineWidth = 2
    for (let i = 0; i < 8; i++) {
      ctx.beginPath()
      ctx.moveTo(0, i * 32)
      ctx.lineTo(256, i * 32)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(i * 32, 0)
      ctx.lineTo(i * 32, 256)
      ctx.stroke()
    }

    // Grease drips
    ctx.fillStyle = 'rgba(100, 70, 30, 0.3)'
    for (let i = 0; i < 3; i++) {
      const x = Math.random() * 256
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.quadraticCurveTo(x + 10, 128, x - 5, 256)
      ctx.lineTo(x + 15, 256)
      ctx.quadraticCurveTo(x + 20, 128, x + 10, 0)
      ctx.fill()
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(2, 1)
    return texture
  }, [])

  return (
    <>
      {/* Back wall */}
      <mesh position={[0, 2, -4]}>
        <planeGeometry args={[20, 8]} />
        <meshStandardMaterial map={wallTexture} roughness={0.9} />
      </mesh>
    </>
  )
}

export function GameScene({ fries, onFryGrab, showRonald, combo }: GameSceneProps) {
  return (
    <>
      {/* Camera Controls - limited for gameplay */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        maxPolarAngle={Math.PI / 2.2}
        minPolarAngle={Math.PI / 4}
        maxDistance={12}
        minDistance={5}
        enablePan={false}
      />

      {/* Lighting - fluorescent fast food */}
      <ambientLight intensity={0.3} color="#c4ff7a" />
      <directionalLight
        position={[5, 10, 5]}
        intensity={0.5}
        color="#ffe4b5"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[0, 3, 2]} intensity={0.8} color="#ffeedd" />
      <pointLight position={[-2, 2, 0]} intensity={0.3} color="#c4ff7a" />
      <pointLight position={[2, 2, 0]} intensity={0.3} color="#c4ff7a" />

      {/* Scene elements */}
      <Floor />
      <Walls />
      <Counter />
      <Fryer />
      <AIClawRobot combo={combo} />
      <RonaldWhale visible={showRonald} />

      {/* Falling fries */}
      {fries.map((fry) => (
        <FryObject
          key={fry.id}
          fry={fry}
          onGrab={() => onFryGrab(fry.id)}
        />
      ))}

      {/* Menu board */}
      <group position={[0, 3.5, -3.8]}>
        <mesh>
          <boxGeometry args={[4, 1.5, 0.1]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <Text position={[0, 0.3, 0.06]} fontSize={0.3} color="#ff0000" anchorX="center">
          McLAWNALD'S
        </Text>
        <Text position={[0, -0.1, 0.06]} fontSize={0.15} color="#ffcc00" anchorX="center">
          "I'm lovin' the grind"
        </Text>
        <Text position={[0, -0.4, 0.06]} fontSize={0.1} color="#888888" anchorX="center">
          Over 99 Billion Fries Bagged
        </Text>
      </group>
    </>
  )
}
