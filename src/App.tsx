import { Canvas } from '@react-three/fiber'
import { Suspense, useState, useCallback, useEffect, useRef } from 'react'
import { GameScene } from './components/GameScene'
import { GameUI } from './components/GameUI'
import { GameState, Upgrade, Fry } from './types'

const DARK_QUOTES = [
  "You thought you'd retire. You're bagging fries.",
  "Vitalik ordered large.",
  "Wen moon? Wen shift ends.",
  "The fries are always fresh. You are not.",
  "WAGMI? WABFI. (We're all bagging fries indefinitely)",
  "This is the future you chose.",
  "Diamond hands on the fryer handle.",
  "The merge happened. You didn't.",
  "GM means 'Get More fries'.",
  "Not financial advice. Just fry advice.",
  "Your portfolio: -99%. Your fry count: +1",
  "In the metaverse, no one can hear you fry.",
  "ser, the fry alarm is ringing",
  "Another day, another 0.0001 $FRY",
  "The real friends were the fries we bagged along the way.",
]

const INITIAL_UPGRADES: Upgrade[] = [
  { id: 'faster-fryer', name: 'Faster Fryer', description: 'More fries per second', cost: 50, multiplier: 1.5, purchased: 0, type: 'spawn' },
  { id: 'second-worker', name: 'Second AI Worker', description: 'Doubles idle earnings', cost: 200, multiplier: 2, purchased: 0, type: 'idle' },
  { id: 'grease-trap', name: 'Grease Trap', description: 'Tap combos give bonus', cost: 100, multiplier: 1.3, purchased: 0, type: 'combo' },
  { id: 'manager-mode', name: 'Manager Mode', description: 'Passive multiplier', cost: 500, multiplier: 1.5, purchased: 0, type: 'passive' },
]

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    fryCount: 0,
    totalFriesBagged: 0,
    fryPerSecond: 0.5,
    idleMultiplier: 1,
    tapMultiplier: 1,
    comboMultiplier: 1,
    passiveMultiplier: 1,
    upgrades: INITIAL_UPGRADES,
    highScore: parseInt(localStorage.getItem('mclawnalds-highscore') || '0'),
    currentQuote: DARK_QUOTES[0],
  })

  const [fries, setFries] = useState<Fry[]>([])
  const [combo, setCombo] = useState(0)
  const [lastTapTime, setLastTapTime] = useState(0)
  const [showRonald, setShowRonald] = useState(false)
  const [screenShake, setScreenShake] = useState(false)
  const fryIdRef = useRef(0)

  // Spawn fries based on fryPerSecond
  useEffect(() => {
    const spawnInterval = setInterval(() => {
      const newFry: Fry = {
        id: fryIdRef.current++,
        x: (Math.random() - 0.5) * 4,
        z: (Math.random() - 0.5) * 2,
        grabbed: false,
        spawnTime: Date.now(),
      }
      setFries(prev => [...prev.slice(-30), newFry]) // Keep max 30 fries
    }, 1000 / gameState.fryPerSecond)

    return () => clearInterval(spawnInterval)
  }, [gameState.fryPerSecond])

  // Idle earnings
  useEffect(() => {
    const idleInterval = setInterval(() => {
      const idleEarnings = 0.1 * gameState.idleMultiplier * gameState.passiveMultiplier
      setGameState(prev => ({
        ...prev,
        fryCount: prev.fryCount + idleEarnings,
        totalFriesBagged: prev.totalFriesBagged + idleEarnings,
      }))
    }, 1000)

    return () => clearInterval(idleInterval)
  }, [gameState.idleMultiplier, gameState.passiveMultiplier])

  // Random quotes
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        currentQuote: DARK_QUOTES[Math.floor(Math.random() * DARK_QUOTES.length)],
      }))
    }, 8000)

    return () => clearInterval(quoteInterval)
  }, [])

  // High score saving
  useEffect(() => {
    if (gameState.totalFriesBagged > gameState.highScore) {
      setGameState(prev => ({ ...prev, highScore: Math.floor(prev.totalFriesBagged) }))
      localStorage.setItem('mclawnalds-highscore', Math.floor(gameState.totalFriesBagged).toString())
    }
  }, [gameState.totalFriesBagged, gameState.highScore])

  // Ronald whale appearance
  useEffect(() => {
    const ronaldInterval = setInterval(() => {
      if (Math.random() < 0.15) {
        setShowRonald(true)
        setScreenShake(true)
        setTimeout(() => setShowRonald(false), 4000)
        setTimeout(() => setScreenShake(false), 500)
        // Spawn extra fries when Ronald appears
        for (let i = 0; i < 10; i++) {
          setTimeout(() => {
            const newFry: Fry = {
              id: fryIdRef.current++,
              x: (Math.random() - 0.5) * 6,
              z: (Math.random() - 0.5) * 3,
              grabbed: false,
              spawnTime: Date.now(),
            }
            setFries(prev => [...prev.slice(-40), newFry])
          }, i * 200)
        }
      }
    }, 15000)

    return () => clearInterval(ronaldInterval)
  }, [])

  // Combo decay
  useEffect(() => {
    const comboDecay = setInterval(() => {
      if (Date.now() - lastTapTime > 2000) {
        setCombo(0)
      }
    }, 500)

    return () => clearInterval(comboDecay)
  }, [lastTapTime])

  const handleFryGrab = useCallback((fryId: number) => {
    setFries(prev => prev.filter(f => f.id !== fryId))

    const now = Date.now()
    const timeSinceLastTap = now - lastTapTime
    setLastTapTime(now)

    let newCombo = combo
    if (timeSinceLastTap < 500) {
      newCombo = Math.min(combo + 1, 10)
      setCombo(newCombo)
    } else {
      newCombo = 1
      setCombo(1)
    }

    const comboBonus = 1 + (newCombo * 0.1 * gameState.comboMultiplier)
    const earnings = 1 * gameState.tapMultiplier * gameState.passiveMultiplier * comboBonus

    setGameState(prev => ({
      ...prev,
      fryCount: prev.fryCount + earnings,
      totalFriesBagged: prev.totalFriesBagged + earnings,
    }))
  }, [combo, lastTapTime, gameState.tapMultiplier, gameState.passiveMultiplier, gameState.comboMultiplier])

  const handlePurchaseUpgrade = useCallback((upgradeId: string) => {
    const upgrade = gameState.upgrades.find(u => u.id === upgradeId)
    if (!upgrade) return

    const cost = Math.floor(upgrade.cost * Math.pow(1.5, upgrade.purchased))
    if (gameState.fryCount < cost) return

    setGameState(prev => {
      const newUpgrades = prev.upgrades.map(u => {
        if (u.id === upgradeId) {
          return { ...u, purchased: u.purchased + 1 }
        }
        return u
      })

      let newState = { ...prev, upgrades: newUpgrades, fryCount: prev.fryCount - cost }

      switch (upgrade.type) {
        case 'spawn':
          newState.fryPerSecond = prev.fryPerSecond * upgrade.multiplier
          break
        case 'idle':
          newState.idleMultiplier = prev.idleMultiplier * upgrade.multiplier
          break
        case 'combo':
          newState.comboMultiplier = prev.comboMultiplier * upgrade.multiplier
          break
        case 'passive':
          newState.passiveMultiplier = prev.passiveMultiplier * upgrade.multiplier
          break
      }

      return newState
    })
  }, [gameState.fryCount, gameState.upgrades])

  return (
    <div className={`w-screen h-screen bg-[#1a1208] overflow-hidden relative ${screenShake ? 'animate-shake' : ''}`}>
      {/* CRT Scanlines Overlay */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-10"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
        }}
      />

      {/* Grease stains overlay */}
      <div className="absolute inset-0 pointer-events-none z-40 opacity-20"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(139, 90, 43, 0.4) 0%, transparent 40%),
            radial-gradient(ellipse at 80% 60%, rgba(139, 90, 43, 0.3) 0%, transparent 35%),
            radial-gradient(ellipse at 50% 80%, rgba(139, 90, 43, 0.35) 0%, transparent 45%),
            radial-gradient(ellipse at 10% 70%, rgba(100, 70, 30, 0.3) 0%, transparent 30%)
          `,
        }}
      />

      {/* Fluorescent light flicker */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-[#c4ff7a] to-transparent opacity-50 animate-flicker z-30" />

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 4, 8], fov: 50 }}
        className="touch-none"
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#1a1208']} />
        <fog attach="fog" args={['#1a1208', 5, 20]} />
        <Suspense fallback={null}>
          <GameScene
            fries={fries}
            onFryGrab={handleFryGrab}
            showRonald={showRonald}
            combo={combo}
          />
        </Suspense>
      </Canvas>

      {/* Game UI Overlay */}
      <GameUI
        gameState={gameState}
        combo={combo}
        onPurchaseUpgrade={handlePurchaseUpgrade}
      />

      {/* Footer */}
      <footer className="absolute bottom-2 left-0 right-0 text-center z-50">
        <p className="text-[#5a4a3a] text-xs font-mono tracking-wide opacity-60">
          Requested by @Salmong · Built by @clonkbot
        </p>
      </footer>

      {/* Custom Styles */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        @keyframes flicker {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.3; }
          52% { opacity: 0.6; }
          54% { opacity: 0.4; }
        }
        .animate-flicker {
          animation: flicker 3s infinite;
        }
      `}</style>
    </div>
  )
}
