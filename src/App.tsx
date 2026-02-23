import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  RotateCcw, 
  Timer, 
  Plus, 
  Play, 
  Pause, 
  ChevronRight,
  Brain,
  Zap,
  Gamepad2
} from 'lucide-react';
import { useGameLogic } from './hooks/useGameLogic';
import { GameMode, GRID_COLS, GRID_ROWS } from './types';
import { cn } from './lib/utils';

export default function App() {
  const [mode, setMode] = useState<GameMode>('classic');
  const [gameStarted, setGameStarted] = useState(false);
  
  const {
    grid,
    target,
    score,
    isGameOver,
    timeLeft,
    toggleSelect,
    initGame,
    addNewRow
  } = useGameLogic(mode);

  const handleStartGame = (selectedMode: GameMode) => {
    setMode(selectedMode);
    setGameStarted(true);
    initGame();
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-[#E4E3E0] flex items-center justify-center p-4 font-sans">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-black/5"
        >
          <div className="p-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 rotate-3">
                <Brain className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-4xl font-black tracking-tighter text-zinc-900 uppercase italic">
                Sum Blast
              </h1>
              <p className="text-zinc-500 font-medium">Master the art of mental math</p>
            </div>

            <div className="grid gap-4 pt-4">
              <button 
                onClick={() => handleStartGame('classic')}
                className="group relative flex items-center justify-between p-6 bg-zinc-900 text-white rounded-2xl hover:bg-zinc-800 transition-all active:scale-95"
              >
                <div className="flex items-center gap-4">
                  <Gamepad2 className="w-6 h-6 text-emerald-400" />
                  <div className="text-left">
                    <div className="font-bold text-lg">Classic Mode</div>
                    <div className="text-xs text-zinc-400">Survival • Strategic • Endless</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button 
                onClick={() => handleStartGame('time')}
                className="group relative flex items-center justify-between p-6 bg-white border-2 border-zinc-900 text-zinc-900 rounded-2xl hover:bg-zinc-50 transition-all active:scale-95"
              >
                <div className="flex items-center gap-4">
                  <Zap className="w-6 h-6 text-amber-500" />
                  <div className="text-left">
                    <div className="font-bold text-lg">Time Rush</div>
                    <div className="text-xs text-zinc-500">Fast • Intense • High Pressure</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>
          
          <div className="bg-zinc-50 p-6 border-t border-zinc-100">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">How to play</h3>
            <ul className="text-sm text-zinc-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-zinc-200 flex-shrink-0 flex items-center justify-center text-[10px] font-bold">1</span>
                <span>Select numbers that add up to the <strong>Target Sum</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-zinc-200 flex-shrink-0 flex items-center justify-center text-[10px] font-bold">2</span>
                <span>Don't let the blocks reach the top row!</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E4E3E0] flex flex-col items-center justify-center p-4 font-sans select-none overflow-hidden">
      {/* Game Header */}
      <div className="w-full max-w-[400px] mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setGameStarted(false)}
              className="p-2 hover:bg-black/5 rounded-lg transition-colors"
            >
              <RotateCcw className="w-5 h-5 text-zinc-500" />
            </button>
            <div className="bg-white px-4 py-2 rounded-xl border border-black/5 shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Score</div>
              <div className="text-xl font-black text-zinc-900 tabular-nums">{score}</div>
            </div>
          </div>

          {mode === 'time' && (
            <div className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors",
              timeLeft <= 3 ? "bg-red-50 border-red-200 text-red-600" : "bg-white border-black/5 text-zinc-900"
            )}>
              <Timer className={cn("w-5 h-5", timeLeft <= 3 && "animate-pulse")} />
              <span className="text-xl font-black tabular-nums">{timeLeft}s</span>
            </div>
          )}
        </div>

        <div className="bg-zinc-900 text-white rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/20" />
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-400/80 mb-1">Target Sum</div>
          <motion.div 
            key={target}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-6xl font-black italic tracking-tighter"
          >
            {target}
          </motion.div>
        </div>
      </div>

      {/* Game Grid */}
      <div className="relative bg-white p-2 rounded-3xl shadow-2xl border border-black/10">
        <div 
          className="grid gap-1.5"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
            width: 'min(90vw, 360px)',
            height: 'min(130vw, 520px)'
          }}
        >
          {grid.map((row, r) => (
            row.map((block, c) => (
              <div key={`${r}-${c}`} className="relative">
                <AnimatePresence mode="popLayout">
                  {block && (
                    <motion.button
                      layoutId={block.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: 1, 
                        opacity: 1,
                        y: 0 
                      }}
                      exit={{ scale: 0, opacity: 0 }}
                      onClick={() => toggleSelect(block.id)}
                      className={cn(
                        "w-full h-full rounded-lg flex items-center justify-center text-xl font-black transition-all duration-200 border-b-4 active:border-b-0 active:translate-y-1",
                        block.isSelected 
                          ? "bg-emerald-500 text-white border-emerald-700 shadow-inner" 
                          : "bg-zinc-100 text-zinc-800 border-zinc-300 hover:bg-zinc-200"
                      )}
                    >
                      {block.value}
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            ))
          ))}
        </div>

        {/* Game Over Overlay */}
        <AnimatePresence>
          {isGameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-50 bg-zinc-900/90 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center p-8 text-center"
            >
              <Trophy className="w-16 h-16 text-amber-400 mb-4" />
              <h2 className="text-4xl font-black text-white italic tracking-tighter mb-2 uppercase">Game Over</h2>
              <p className="text-zinc-400 mb-8 font-medium">You scored <span className="text-white font-bold">{score}</span> points!</p>
              <button 
                onClick={initGame}
                className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-colors active:scale-95 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Controls */}
      <div className="w-full max-w-[400px] mt-6 flex gap-3">
        <button 
          onClick={addNewRow}
          disabled={isGameOver}
          className="flex-1 py-4 bg-white border border-black/5 rounded-2xl font-bold text-zinc-600 shadow-sm hover:bg-zinc-50 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Plus className="w-5 h-5" />
          Add Row
        </button>
        <button 
          onClick={initGame}
          className="px-6 py-4 bg-zinc-900 text-white rounded-2xl font-bold shadow-lg hover:bg-zinc-800 transition-all active:scale-95 flex items-center justify-center"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
