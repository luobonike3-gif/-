export type GameMode = 'classic' | 'time';

export interface Block {
  id: string;
  value: number;
  row: number;
  col: number;
  isSelected: boolean;
}

export interface GameState {
  grid: (Block | null)[][];
  target: number;
  score: number;
  mode: GameMode;
  isGameOver: boolean;
  timeLeft: number;
  selectedIds: string[];
}

export const GRID_ROWS = 10;
export const GRID_COLS = 6;
export const INITIAL_ROWS = 4;
export const TARGET_MIN = 10;
export const TARGET_MAX = 30;
export const TIME_LIMIT = 10; // Seconds for time mode
