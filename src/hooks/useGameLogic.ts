import { useState, useEffect, useCallback, useRef } from 'react';
import { Block, GameMode, GRID_ROWS, GRID_COLS, INITIAL_ROWS, TARGET_MIN, TARGET_MAX, TIME_LIMIT } from '../types';
import confetti from 'canvas-confetti';

const generateId = () => Math.random().toString(36).substr(2, 9);
const getRandomValue = () => Math.floor(Math.random() * 9) + 1;

export function useGameLogic(mode: GameMode) {
  const [grid, setGrid] = useState<(Block | null)[][]>([]);
  const [target, setTarget] = useState(0);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateTarget = useCallback(() => {
    setTarget(Math.floor(Math.random() * (TARGET_MAX - TARGET_MIN + 1)) + TARGET_MIN);
  }, []);

  const initGame = useCallback(() => {
    const newGrid: (Block | null)[][] = Array(GRID_ROWS).fill(null).map(() => Array(GRID_COLS).fill(null));
    
    // Fill initial rows from bottom
    for (let r = GRID_ROWS - 1; r >= GRID_ROWS - INITIAL_ROWS; r--) {
      for (let c = 0; c < GRID_COLS; c++) {
        newGrid[r][c] = {
          id: generateId(),
          value: getRandomValue(),
          row: r,
          col: c,
          isSelected: false
        };
      }
    }
    
    setGrid(newGrid);
    setScore(0);
    setIsGameOver(false);
    setTimeLeft(TIME_LIMIT);
    setSelectedIds([]);
    generateTarget();
  }, [generateTarget]);

  const addNewRow = useCallback(() => {
    setGrid(prev => {
      // Check if top row is occupied
      if (prev[0].some(cell => cell !== null)) {
        setIsGameOver(true);
        return prev;
      }

      const newGrid = prev.map(row => [...row]);
      
      // Shift everything up
      for (let r = 0; r < GRID_ROWS - 1; r++) {
        for (let c = 0; c < GRID_COLS; c++) {
          const block = newGrid[r + 1][c];
          if (block) {
            newGrid[r][c] = { ...block, row: r };
          } else {
            newGrid[r][c] = null;
          }
        }
      }

      // Add new row at bottom
      for (let c = 0; c < GRID_COLS; c++) {
        newGrid[GRID_ROWS - 1][c] = {
          id: generateId(),
          value: getRandomValue(),
          row: GRID_ROWS - 1,
          col: c,
          isSelected: false
        };
      }

      return newGrid;
    });
    
    if (mode === 'time') setTimeLeft(TIME_LIMIT);
  }, [mode]);

  const applyGravity = useCallback((currentGrid: (Block | null)[][]) => {
    const newGrid = currentGrid.map(row => [...row]);
    
    for (let c = 0; c < GRID_COLS; c++) {
      let emptyRow = GRID_ROWS - 1;
      for (let r = GRID_ROWS - 1; r >= 0; r--) {
        if (newGrid[r][c] !== null) {
          const block = newGrid[r][c]!;
          newGrid[r][c] = null;
          newGrid[emptyRow][c] = { ...block, row: emptyRow };
          emptyRow--;
        }
      }
    }
    return newGrid;
  }, []);

  const toggleSelect = (id: string) => {
    if (isGameOver) return;

    setGrid(prev => {
      const newGrid = prev.map(row => 
        row.map(block => 
          block?.id === id ? { ...block, isSelected: !block.isSelected } : block
        )
      );
      
      const selectedBlocks = newGrid.flat().filter(b => b?.isSelected);
      const currentSum = selectedBlocks.reduce((sum, b) => sum + (b?.value || 0), 0);
      
      if (currentSum === target) {
        // Success!
        confetti({
          particleCount: 40,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#34d399', '#6ee7b7']
        });

        const updatedGrid = newGrid.map(row => 
          row.map(block => block?.isSelected ? null : block)
        );
        
        setScore(s => s + selectedBlocks.length * 10);
        generateTarget();
        
        if (mode === 'classic') {
          setTimeout(addNewRow, 300);
        }
        
        return applyGravity(updatedGrid);
      } else if (currentSum > target) {
        // Over target, deselect all
        return newGrid.map(row => 
          row.map(block => block ? { ...block, isSelected: false } : null)
        );
      }
      
      return newGrid;
    });
  };

  // Timer for Time Mode
  useEffect(() => {
    if (mode === 'time' && !isGameOver) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            addNewRow();
            return TIME_LIMIT;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mode, isGameOver, addNewRow]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  return {
    grid,
    target,
    score,
    isGameOver,
    timeLeft,
    toggleSelect,
    initGame,
    addNewRow
  };
}
