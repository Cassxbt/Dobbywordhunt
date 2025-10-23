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

export function placeWords(words: string[], gridSize: number): PlacementResult {
  let currentGridSize = gridSize;
  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    try {
      const result = attemptPlacement(words, currentGridSize);
      return result;
    } catch (error) {
      attempts++;
      currentGridSize++;
      if (attempts >= maxAttempts) {
        throw new Error('Failed to place words after maximum attempts');
      }
    }
  }

  throw new Error('Placement failed');
}

function attemptPlacement(words: string[], gridSize: number): PlacementResult {
  // Create empty grid
  const grid: Cell[][] = Array(gridSize).fill(null).map((_, row) =>
    Array(gridSize).fill(null).map((_, col) => ({
      letter: '',
      row,
      col,
      isFound: false
    }))
  );

  // Track occupied cells and word start positions
  const occupied: boolean[][] = Array(gridSize).fill(null).map(() => 
    Array(gridSize).fill(false)
  );
  const wordStarts: { row: number; col: number; direction: Direction }[] = [];

  const placedWords: Word[] = [];
  const directions: Direction[] = ['horizontal', 'vertical', 'diagonal-right', 'diagonal-left'];
  const MIN_SPACING = 2; // Minimum spacing between word starts

  for (const wordText of words) {
    const wordId = `word-${wordText.toLowerCase()}`;
    let placed = false;
    let placementAttempts = 0;
    const maxPlacementAttempts = 100;

    while (!placed && placementAttempts < maxPlacementAttempts) {
      const direction = directions[Math.floor(Math.random() * directions.length)];
      const positions = getRandomPositions(wordText, direction, gridSize);

      if (canPlaceWord(positions, occupied) && !tooCloseToOthers(positions[0], wordStarts, MIN_SPACING)) {
        // Place the word
        for (let i = 0; i < wordText.length; i++) {
          const pos = positions[i];
          grid[pos.row][pos.col].letter = wordText[i].toUpperCase();
          grid[pos.row][pos.col].wordId = wordId;
          occupied[pos.row][pos.col] = true;
        }

        placedWords.push({
          id: wordId,
          text: wordText,
          direction,
          positions,
          isFound: false
        });

        // Track word start position
        wordStarts.push({
          row: positions[0].row,
          col: positions[0].col,
          direction
        });

        placed = true;
      }

      placementAttempts++;
    }

    if (!placed) {
      throw new Error(`Failed to place word: ${wordText}`);
    }
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

function getRandomPositions(word: string, direction: Direction, gridSize: number): { row: number; col: number }[] {
  const positions: { row: number; col: number }[] = [];
  const wordLength = word.length;

  let startRow: number, startCol: number;

  switch (direction) {
    case 'horizontal':
      startRow = Math.floor(Math.random() * gridSize);
      startCol = Math.floor(Math.random() * (gridSize - wordLength + 1));
      for (let i = 0; i < wordLength; i++) {
        positions.push({ row: startRow, col: startCol + i });
      }
      break;

    case 'vertical':
      startRow = Math.floor(Math.random() * (gridSize - wordLength + 1));
      startCol = Math.floor(Math.random() * gridSize);
      for (let i = 0; i < wordLength; i++) {
        positions.push({ row: startRow + i, col: startCol });
      }
      break;

    case 'diagonal-right':
      startRow = Math.floor(Math.random() * (gridSize - wordLength + 1));
      startCol = Math.floor(Math.random() * (gridSize - wordLength + 1));
      for (let i = 0; i < wordLength; i++) {
        positions.push({ row: startRow + i, col: startCol + i });
      }
      break;

    case 'diagonal-left':
      startRow = Math.floor(Math.random() * (gridSize - wordLength + 1));
      startCol = Math.floor(Math.random() * (gridSize - wordLength + 1)) + wordLength - 1;
      for (let i = 0; i < wordLength; i++) {
        positions.push({ row: startRow + i, col: startCol - i });
      }
      break;
  }

  return positions;
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
