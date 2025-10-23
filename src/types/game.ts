export type Direction = 'horizontal' | 'vertical' | 'diagonal-right' | 'diagonal-left';

export interface Cell {
  letter: string;
  row: number;
  col: number;
  isFound: boolean;
  wordId?: string;
  isHinted?: boolean;
}

export interface Word {
  id: string;
  text: string;
  direction: Direction;
  positions: { row: number; col: number }[];
  isFound: boolean;
  isHinted?: boolean;
}

export interface Level {
  id: number;
  name: string;
  words: string[];
  wordCount?: number; // Number of words to select from pool
  gridSize: { min: number; max: number };
  timeLimit: number; // in seconds
  hintsCount: number;
}

export interface GameState {
  level: Level;
  grid: Cell[][];
  words: Word[];
  foundWords: string[];
  remainingTime: number;
  hintsLeft: number;
  isTimerPaused: boolean;
  isGameStarted: boolean;
  isGameComplete: boolean;
  isGameFailed: boolean;
}

export interface LevelStats {
  completed: boolean;
  bestTime?: number;
  completionDate?: string;
}

export interface GameStats {
  unlockedLevels: number[];
  levelStats: Record<number, LevelStats>;
}

export interface DragSelection {
  startCell: { row: number; col: number } | null;
  currentCell: { row: number; col: number } | null;
  selectedCells: { row: number; col: number }[];
  isSelecting: boolean;
}

export interface DefinitionResponse {
  term: string;
  definition: string;
}
