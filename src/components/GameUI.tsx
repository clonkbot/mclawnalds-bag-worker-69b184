import { useState } from 'react'
import { GameState } from '../types'

interface GameUIProps {
  gameState: GameState
  combo: number
  onPurchaseUpgrade: (id: string) => void
}

export function GameUI({ gameState, combo, onPurchaseUpgrade }: GameUIProps) {
  const [showUpgrades, setShowUpgrades] = useState(false)

  return (
    <>
      {/* Top HUD - Fry Counter */}
      <div className="absolute top-0 left-0 right-0 z-40 p-3 md:p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-0">
          {/* Logo and Counter */}
          <div className="flex items-center gap-3 md:gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 blur-md opacity-50" />
              <div className="relative bg-gradient-to-br from-red-600 to-red-800 px-3 md:px-4 py-1.5 md:py-2 border-2 border-yellow-500 shadow-lg"
                style={{ clipPath: 'polygon(0 0, 100% 0, 95% 100%, 5% 100%)' }}>
                <span className="font-pixel text-yellow-400 text-lg md:text-2xl tracking-wider">McLAWNALD'S</span>
              </div>
            </div>

            <div className="bg-black/80 border border-yellow-600/50 px-3 md:px-4 py-1.5 md:py-2 shadow-inner"
              style={{ boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.8)' }}>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 text-2xl md:text-3xl">🍟</span>
                <div className="flex flex-col">
                  <span className="font-mono text-yellow-400 text-xl md:text-2xl font-bold tracking-wide">
                    {Math.floor(gameState.fryCount).toLocaleString()}
                  </span>
                  <span className="text-yellow-600 text-[10px] md:text-xs font-mono">$FRY</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Combo */}
            {combo > 1 && (
              <div className="bg-orange-600/80 border-2 border-orange-400 px-2 md:px-3 py-1 animate-pulse">
                <span className="font-pixel text-white text-sm md:text-lg">COMBO x{combo}</span>
              </div>
            )}

            {/* Per second */}
            <div className="bg-black/60 border border-green-600/50 px-2 md:px-3 py-1">
              <span className="text-green-400 font-mono text-xs md:text-sm">
                {gameState.fryPerSecond.toFixed(1)}/s
              </span>
            </div>

            {/* High score */}
            <div className="bg-black/60 border border-purple-600/50 px-2 md:px-3 py-1 hidden sm:block">
              <span className="text-purple-400 font-mono text-xs md:text-sm">
                HI: {gameState.highScore.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Quote ticker */}
        <div className="mt-2 md:mt-3 overflow-hidden">
          <div className="bg-black/70 border-t border-b border-red-900/50 py-1 px-2 md:px-4">
            <p className="font-mono text-red-400 text-xs md:text-sm italic whitespace-nowrap animate-marquee">
              {gameState.currentQuote}
            </p>
          </div>
        </div>
      </div>

      {/* Upgrade Button (Mobile-friendly) */}
      <button
        onClick={() => setShowUpgrades(!showUpgrades)}
        className="absolute bottom-16 md:bottom-20 right-3 md:right-4 z-40 bg-gradient-to-br from-yellow-600 to-yellow-800 border-2 border-yellow-400 px-4 md:px-6 py-2 md:py-3 shadow-lg active:scale-95 transition-transform touch-manipulation min-h-[44px] min-w-[44px]"
        style={{
          clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)',
          boxShadow: '0 4px 20px rgba(200, 150, 0, 0.4)',
        }}
      >
        <span className="font-pixel text-black text-sm md:text-base">UPGRADES</span>
      </button>

      {/* Tap instruction on mobile */}
      <div className="absolute bottom-28 md:bottom-32 left-1/2 -translate-x-1/2 z-30 pointer-events-none sm:hidden">
        <div className="bg-black/60 border border-yellow-600/30 px-3 py-1 animate-pulse">
          <span className="text-yellow-500 font-mono text-xs">TAP FRIES TO BAG</span>
        </div>
      </div>

      {/* Upgrades Panel */}
      {showUpgrades && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowUpgrades(false)}>
          <div
            className="bg-gradient-to-br from-[#2a1a0a] to-[#1a0a00] border-2 border-yellow-700 p-4 md:p-6 max-w-md w-full shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{
              boxShadow: '0 0 50px rgba(200, 100, 0, 0.3), inset 0 0 30px rgba(0,0,0,0.5)',
            }}
          >
            {/* Grease stain decoration */}
            <div className="absolute top-0 right-0 w-20 h-20 md:w-32 md:h-32 rounded-full bg-yellow-900/20 blur-xl" />
            <div className="absolute bottom-0 left-0 w-16 h-16 md:w-24 md:h-24 rounded-full bg-yellow-900/15 blur-xl" />

            <div className="relative z-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-pixel text-yellow-500 text-xl md:text-2xl">UPGRADES</h2>
                <button
                  onClick={() => setShowUpgrades(false)}
                  className="text-red-500 hover:text-red-400 text-2xl font-bold w-10 h-10 flex items-center justify-center"
                >
                  X
                </button>
              </div>

              <div className="space-y-3">
                {gameState.upgrades.map((upgrade) => {
                  const cost = Math.floor(upgrade.cost * Math.pow(1.5, upgrade.purchased))
                  const canAfford = gameState.fryCount >= cost

                  return (
                    <button
                      key={upgrade.id}
                      onClick={() => onPurchaseUpgrade(upgrade.id)}
                      disabled={!canAfford}
                      className={`w-full p-3 md:p-4 border-2 transition-all text-left touch-manipulation min-h-[70px] ${canAfford
                          ? 'bg-gradient-to-r from-yellow-900/50 to-yellow-800/30 border-yellow-600 hover:border-yellow-400 hover:bg-yellow-800/40 active:scale-98'
                          : 'bg-gray-900/50 border-gray-700 opacity-50 cursor-not-allowed'
                        }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-pixel text-yellow-400 text-sm md:text-base">{upgrade.name}</span>
                            {upgrade.purchased > 0 && (
                              <span className="bg-green-600 text-white text-xs px-1.5 py-0.5 font-mono">
                                Lv.{upgrade.purchased}
                              </span>
                            )}
                          </div>
                          <p className="text-yellow-600/80 text-xs md:text-sm mt-1">{upgrade.description}</p>
                        </div>
                        <div className="text-right ml-2 flex-shrink-0">
                          <div className={`font-mono text-sm md:text-base ${canAfford ? 'text-green-400' : 'text-red-400'}`}>
                            {cost.toLocaleString()}
                          </div>
                          <div className="text-yellow-600 text-xs">$FRY</div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Stats summary */}
              <div className="mt-4 pt-4 border-t border-yellow-900/50 grid grid-cols-2 gap-2 text-xs md:text-sm">
                <div className="text-yellow-600">
                  <span className="text-yellow-400">Fry Rate:</span> {gameState.fryPerSecond.toFixed(1)}/s
                </div>
                <div className="text-yellow-600">
                  <span className="text-yellow-400">Idle Mult:</span> x{gameState.idleMultiplier.toFixed(1)}
                </div>
                <div className="text-yellow-600">
                  <span className="text-yellow-400">Combo Mult:</span> x{gameState.comboMultiplier.toFixed(1)}
                </div>
                <div className="text-yellow-600">
                  <span className="text-yellow-400">Passive:</span> x{gameState.passiveMultiplier.toFixed(1)}
                </div>
              </div>

              {/* Dystopian flavor text */}
              <div className="mt-4 text-center">
                <p className="text-red-500/60 text-[10px] md:text-xs font-mono italic">
                  "Every upgrade brings you closer to nothing."
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=VT323&family=Space+Mono:wght@400;700&display=swap');

        .font-pixel {
          font-family: 'VT323', monospace;
        }

        .font-mono {
          font-family: 'Space Mono', monospace;
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .animate-marquee {
          animation: marquee 20s linear infinite;
        }

        .active\\:scale-98:active {
          transform: scale(0.98);
        }
      `}</style>
    </>
  )
}
