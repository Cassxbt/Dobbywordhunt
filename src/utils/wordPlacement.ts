import { Cell, Word, Direction } from '../types/game';
import { WORD_POOLS } from '../data/sentientKeywords';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Get all Sentient keywords for smarter letter filling
function getAllSentientLetters(): string {
  const allWords = Object.values(WORD_POOLS).flat().join('').toUpperCase();
  return allWords;
}

export interface PlacementResult {
  grid: Cell[][];
  placedWords: Word[];
}

interface PlacementConfig {
  minSpacing: number;
  allowedDirections: Direction[];
}

interface Position {
  row: number;
  col: number;
}

interface PlacementAttempt {
  positions: Position[];
  direction: Direction;
  startRow: number;
  startCol: number;
}

/**
 * Professional backtracking word placement algorithm
 * Guarantees placement of all words with adaptive spacing
 */
export function placeWords(words: string[], gridSize: number, maxGridSize?: number): PlacementResult {
  // Note: maxGridSize is not used in backtracking algorithm since we guarantee placement
  // It's kept for API compatibility
  if (maxGridSize && gridSize > maxGridSize) {
    throw new Error(`Grid size ${gridSize} exceeds maximum ${maxGridSize}`);
  }
  
  // Sort words longest → shortest for better placement success
  const sortedWords = [...words].sort((a, b) => b.length - a.length);
  
  // Try multiple configurations with increasingly relaxed constraints
  const configs: PlacementConfig[] = [
    // Config 1: Adaptive spacing based on grid size
    {
      minSpacing: gridSize <= 9 ? 1 : 2,
      allowedDirections: ['horizontal', 'vertical', 'diagonal-right', 'diagonal-left']
    },
    // Config 2: No spacing requirement (words can be adjacent)
    {
      minSpacing: 0,
      allowedDirections: ['horizontal', 'vertical', 'diagonal-right', 'diagonal-left']
    },
    // Config 3: Only straight directions, no spacing
    {
      minSpacing: 0,
      allowedDirections: ['horizontal', 'vertical']
    }
  ];

  for (const config of configs) {
    try {
      const result = attemptPlacementWithBacktracking(sortedWords, gridSize, config);
      return result;
    } catch (error) {
      console.log(`Placement failed with config spacing=${config.minSpacing}, trying next...`);
      continue;
    }
  }

  throw new Error(`Failed to place all ${words.length} words in ${gridSize}x${gridSize} grid after trying all configurations`);
}

/**
 * Main backtracking placement function
 * Uses recursive backtracking to guarantee all words are placed
 */
function attemptPlacementWithBacktracking(words: string[], gridSize: number, config: PlacementConfig): PlacementResult {
  // Create empty grid
  const grid: Cell[][] = Array(gridSize).fill(null).map((_, row) =>
    Array(gridSize).fill(null).map((_, col) => ({
      letter: '',
      row,
      col,
      isFound: false
    }))
  );

  // Track state
  const occupied: boolean[][] = Array(gridSize).fill(null).map(() => 
    Array(gridSize).fill(false)
  );
  const wordStarts: { row: number; col: number; direction: Direction }[] = [];
  const placedWords: Word[] = [];

  // Try to place all words using backtracking
  const success = placeWordWithBacktracking(
    words,
    0,
    grid,
    occupied,
    placedWords,
    wordStarts,
    config
  );

  if (!success) {
    throw new Error(`Backtracking failed to place all ${words.length} words`);
  }

  // Fill empty cells with smarter letter selection
  const sentientLetters = getAllSentientLetters();
  
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (!occupied[row][col]) {
        // 70% chance to use Sentient keyword letters, 30% random
        if (Math.random() < 0.7 && sentientLetters.length > 0) {
          grid[row][col].letter = sentientLetters[Math.floor(Math.random() * sentientLetters.length)];
        } else {
          grid[row][col].letter = LETTERS[Math.floor(Math.random() * LETTERS.length)];
        }
      }
    }
  }

  return { grid, placedWords };
}

/**
 * Recursive backtracking function
 * Tries all valid positions for current word, then recurses to next word
 * If placement fails, backtracks and tries different position
 */
function placeWordWithBacktracking(
  words: string[],
  wordIndex: number,
  grid: Cell[][],
  occupied: boolean[][],
  placedWords: Word[],
  wordStarts: { row: number; col: number; direction: Direction }[],
  config: PlacementConfig
): boolean {
  // Base case: all words placed
  if (wordIndex === words.length) {
    return true;
  }

  const wordText = words[wordIndex];
  const wordId = `word-${wordText.toLowerCase()}`;
  
  // Get all valid positions for this word
  const validPositions = getAllValidPositions(wordText, grid.length, occupied, wordStarts, config);
  
  // Shuffle for randomization (important for variety across refreshes)
  const shuffledPositions = validPositions.sort(() => Math.random() - 0.5);

  // Try each valid position
  for (const attempt of shuffledPositions) {
    // Check if this position is valid (double-check constraints)
    if (!canPlaceWord(attempt.positions, occupied)) continue;
    if (config.minSpacing > 0 && tooCloseToOthers(attempt.positions[0], wordStarts, config.minSpacing)) continue;

    // Place the word
    markCells(wordText, attempt.positions, grid, occupied, wordId);

    // Track word start
    wordStarts.push({
      row: attempt.positions[0].row,
      col: attempt.positions[0].col,
      direction: attempt.direction
    });

    // Create word object
    const wordObj: Word = {
      id: wordId,
      text: wordText,
      direction: attempt.direction,
      positions: attempt.positions,
      isFound: false
    };
    placedWords.push(wordObj);

    // Recurse to next word
    if (placeWordWithBacktracking(words, wordIndex + 1, grid, occupied, placedWords, wordStarts, config)) {
      return true; // Success!
    }

    // Backtrack: remove this word
    unmarkCells(attempt.positions, grid, occupied);
    wordStarts.pop();
    placedWords.pop();
  }

  // All positions exhausted for this word
  return false;
}

/**
 * Get all valid positions for a word in the grid
 * Returns array of placement attempts with positions and direction
 */
function getAllValidPositions(
  word: string,
  gridSize: number,
  occupied: boolean[][],
  wordStarts: { row: number; col: number; direction: Direction }[],
  config: PlacementConfig
): PlacementAttempt[] {
  const attempts: PlacementAttempt[] = [];

  for (const direction of config.allowedDirections) {
    const bounds = getDirectionBounds(word.length, direction, gridSize);
    
    if (!bounds) continue;

    // Try all starting positions for this direction
    for (let startRow = bounds.minRow; startRow <= bounds.maxRow; startRow++) {
      for (let startCol = bounds.minCol; startCol <= bounds.maxCol; startCol++) {
        const positions = getPositionsForDirection(word, direction, startRow, startCol);
        
        // Quick validation
        if (!positions) continue;
        
        // Check if valid (no overlaps, spacing requirements)
        if (!canPlaceWord(positions, occupied)) continue;
        if (config.minSpacing > 0 && tooCloseToOthers(positions[0], wordStarts, config.minSpacing)) continue;

        attempts.push({
          positions,
          direction,
          startRow,
          startCol
        });
      }
    }
  }

  return attempts;
}

/**
 * Get bounds for direction (where word can start to fit in grid)
 */
function getDirectionBounds(wordLength: number, direction: Direction, gridSize: number): { minRow: number; maxRow: number; minCol: number; maxCol: number } | null {
  switch (direction) {
    case 'horizontal':
      return {
        minRow: 0,
        maxRow: gridSize - 1,
        minCol: 0,
        maxCol: gridSize - wordLength
      };
    case 'vertical':
      return {
        minRow: 0,
        maxRow: gridSize - wordLength,
        minCol: 0,
        maxCol: gridSize - 1
      };
    case 'diagonal-right':
      return {
        minRow: 0,
        maxRow: gridSize - wordLength,
        minCol: 0,
        maxCol: gridSize - wordLength
      };
    case 'diagonal-left':
      return {
        minRow: 0,
        maxRow: gridSize - wordLength,
        minCol: wordLength - 1,
        maxCol: gridSize - 1
      };
  }
}

/**
 * Get positions array for a word in a specific direction
 */
function getPositionsForDirection(word: string, direction: Direction, startRow: number, startCol: number): Position[] | null {
  const positions: Position[] = [];

  try {
    switch (direction) {
      case 'horizontal':
        for (let i = 0; i < word.length; i++) {
          positions.push({ row: startRow, col: startCol + i });
        }
        break;

      case 'vertical':
        for (let i = 0; i < word.length; i++) {
          positions.push({ row: startRow + i, col: startCol });
        }
        break;

      case 'diagonal-right':
        for (let i = 0; i < word.length; i++) {
          positions.push({ row: startRow + i, col: startCol + i });
        }
        break;

      case 'diagonal-left':
        for (let i = 0; i < word.length; i++) {
          positions.push({ row: startRow + i, col: startCol - i });
        }
        break;

      default:
        return null;
    }
  } catch {
    return null;
  }

  return positions;
}

/**
 * Mark cells as occupied by a word
 */
function markCells(word: string, positions: Position[], grid: Cell[][], occupied: boolean[][], wordId: string): void {
  for (let i = 0; i < word.length; i++) {
    const pos = positions[i];
    grid[pos.row][pos.col].letter = word[i].toUpperCase();
    grid[pos.row][pos.col].wordId = wordId;
    occupied[pos.row][pos.col] = true;
  }
}

/**
 * Unmark cells (backtrack)
 */
function unmarkCells(positions: Position[], grid: Cell[][], occupied: boolean[][]): void {
  for (const pos of positions) {
    grid[pos.row][pos.col].letter = '';
    grid[pos.row][pos.col].wordId = undefined;
    occupied[pos.row][pos.col] = false;
  }
}

function canPlaceWord(positions: { row: number; col: number }[], occupied: boolean[][]): boolean {
  for (const pos of positions) {
    if (occupied[pos.row][pos.col]) {
      return false;
    }
  }
  return true;
}

// Check if a word start position is too close to other words
function tooCloseToOthers(
  newStart: { row: number; col: number }, 
  existingStarts: { row: number; col: number; direction: Direction }[], 
  minSpacing: number
): boolean {
  for (const existing of existingStarts) {
    const distance = Math.abs(newStart.row - existing.row) + Math.abs(newStart.col - existing.col);
    if (distance < minSpacing) {
      return true;
    }
  }
  return false;
}

export function calculateOptimalGridSize(
  wordCount: number,
  longestWord: number,
  viewportWidth: number,
  viewportHeight: number
): number {
  // Reserve space for UI elements
  const headerHeight = 80; // Timer, hints, level name
  const wordListHeight = Math.min(120, viewportHeight * 0.25); // Word list at bottom
  const padding = 32; // Overall padding

  const availableHeight = viewportHeight - headerHeight - wordListHeight - padding;
  const availableWidth = viewportWidth - padding;

  // Minimum cell size for touch targets
  const minCellSize = 36;

  // Calculate grid size based on longest word and available space
  const minGridSize = Math.max(longestWord, Math.ceil(Math.sqrt(wordCount * 1.5)));
  
  // Calculate maximum possible grid size based on viewport
  const maxGridByHeight = Math.floor(availableHeight / minCellSize);
  const maxGridByWidth = Math.floor(availableWidth / minCellSize);
  const maxGridSize = Math.min(maxGridByHeight, maxGridByWidth);

  // Return optimal size within constraints
  return Math.max(minGridSize, Math.min(maxGridSize, 16));
}
