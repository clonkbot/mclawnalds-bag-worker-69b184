export interface Fry {
  id: number
  x: number
  z: number
  grabbed: boolean
  spawnTime: number
}

export interface Upgrade {
  id: string
  name: string
  description: string
  cost: number
  multiplier: number
  purchased: number
  type: 'spawn' | 'idle' | 'combo' | 'passive'
}

export interface GameState {
  fryCount: number
  totalFriesBagged: number
  fryPerSecond: number
  idleMultiplier: number
  tapMultiplier: number
  comboMultiplier: number
  passiveMultiplier: number
  upgrades: Upgrade[]
  highScore: number
  currentQuote: string
}
