import { useState, useEffect, useCallback } from 'react';
import { GameState, Level, Word, GameStats, LevelStats } from '../types/game';
import { placeWords } from '../utils/wordPlacement';
import { calculateGridSize } from '../utils/resizeGrid';

const STORAGE_KEY = 'wordhunt-game-stats';

export interface UseGameProps {
  level: Level;
  onLevelComplete: (stats: { timeLeft: number; wordsFound: number }) => void;
  onLevelFailed: () => void;
}

export function useGame({ level, onLevelComplete, onLevelFailed }: UseGameProps) {
  const [gameState, setGameState] = useState<GameState>(() => {
    const gridSize = calculateGridSize(level, window.innerWidth, window.innerHeight);
    const placement = placeWords(level.words, gridSize.rows, gridSize.rows); // Pass maxGridSize
    
    return {
      level,
      grid: placement.grid,
      words: placement.placedWords,
      foundWords: [],
      remainingTime: level.timeLimit,
      hintsLeft: level.hintsCount,
      isTimerPaused: false,
      isGameStarted: true, // Auto-start game
      isGameComplete: false,
      isGameFailed: false
    };
  });

  const [showConfetti, setShowConfetti] = useState(false);
  const [hintHighlight, setHintHighlight] = useState<{ row: number; col: number } | null>(null);

  // Reset game state when level changes
  useEffect(() => {
    const gridSize = calculateGridSize(level, window.innerWidth, window.innerHeight);
    const placement = placeWords(level.words, gridSize.rows, gridSize.rows); // Pass maxGridSize
    
    setGameState({
      level,
      grid: placement.grid,
      words: placement.placedWords,
      foundWords: [],
      remainingTime: level.timeLimit,
      hintsLeft: level.hintsCount,
      isTimerPaused: false,
      isGameStarted: true,
      isGameComplete: false,
      isGameFailed: false
    });
    
    // Reset confetti and hint highlight
    setShowConfetti(false);
    setHintHighlight(null);
  }, [level.id]);

  // Timer effect - auto-starts when component mounts
  useEffect(() => {
    if (gameState.isTimerPaused || gameState.isGameComplete || gameState.isGameFailed) {
      return;
    }

    const timer = setInterval(() => {
      setGameState(prev => {
        const newTime = prev.remainingTime - 1;
        
        if (newTime <= 0) {
          clearInterval(timer);
          return { ...prev, remainingTime: 0, isGameFailed: true };
        }
        
        return { ...prev, remainingTime: newTime };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.isTimerPaused, gameState.isGameComplete, gameState.isGameFailed]);

  // Check for level completion
  useEffect(() => {
    // Only trigger completion if:
    // 1. We have actually found words (not empty)
    // 2. Found count matches total count
    // 3. Game state level ID matches current level ID (prevents race condition)
    if (gameState.foundWords.length > 0 && 
        gameState.foundWords.length === level.words.length &&
        gameState.level.id === level.id) {
      setGameState(prev => ({ ...prev, isGameComplete: true }));
      onLevelComplete({
        timeLeft: gameState.remainingTime,
        wordsFound: gameState.foundWords.length
      });
    }
  }, [gameState.foundWords.length, level.words.length, gameState.level.id, level.id, gameState.remainingTime, onLevelComplete]);

  // Handle level failure
  useEffect(() => {
    if (gameState.isGameFailed) {
      onLevelFailed();
    }
  }, [gameState.isGameFailed, onLevelFailed]);

  const startGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isGameStarted: true }));
  }, []);

  const pauseTimer = useCallback(() => {
    setGameState(prev => ({ ...prev, isTimerPaused: true }));
  }, []);

  const resumeTimer = useCallback(() => {
    setGameState(prev => ({ ...prev, isTimerPaused: false }));
  }, []);

  const checkWordMatch = useCallback((selectedCells: { row: number; col: number }[]) => {
    if (selectedCells.length === 0) return false;

    // Convert selected cells to string
    const selectedWord = selectedCells
      .map(cell => gameState.grid[cell.row][cell.col].letter)
      .join('')
      .toLowerCase();

    // Check against remaining words (forward and reverse)
    const remainingWords = gameState.words.filter(word => !word.isFound);
    
    for (const word of remainingWords) {
      const wordText = word.text.toLowerCase();
      if (selectedWord === wordText || selectedWord === wordText.split('').reverse().join('')) {
        return word;
      }
    }

    return false;
  }, [gameState.grid, gameState.words]);

  const onWordFound = useCallback((word: Word) => {
    setGameState(prev => {
      const updatedWords = prev.words.map(w => 
        w.id === word.id ? { ...w, isFound: true } : w
      );
      
      const updatedGrid = prev.grid.map(row => 
        row.map(cell => 
          cell.wordId === word.id ? { ...cell, isFound: true } : cell
        )
      );

      return {
        ...prev,
        words: updatedWords,
        grid: updatedGrid,
        foundWords: [...prev.foundWords, word.text]
      };
    });

    // Show confetti animation
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  }, []);

  const useHint = useCallback(() => {
    if (gameState.hintsLeft <= 0) return;

    const remainingWords = gameState.words.filter(word => !word.isFound);
    if (remainingWords.length === 0) return;

    const randomWord = remainingWords[Math.floor(Math.random() * remainingWords.length)];
    const firstPosition = randomWord.positions[0];

    // Set temporary highlight
    setHintHighlight({ row: firstPosition.row, col: firstPosition.col });
    
    // Remove highlight after 3 seconds
    setTimeout(() => {
      setHintHighlight(null);
    }, 3000);

    setGameState(prev => ({
      ...prev,
      hintsLeft: prev.hintsLeft - 1
    }));
  }, [gameState.hintsLeft, gameState.words]);

  const handleSelection = useCallback((selectedCells: { row: number; col: number }[]) => {
    const matchedWord = checkWordMatch(selectedCells);
    if (matchedWord) {
      onWordFound(matchedWord);
    }
  }, [checkWordMatch, onWordFound]);

  // LocalStorage functions
  const saveGameStats = useCallback((levelId: number, stats: LevelStats) => {
    try {
      const existingStats = getGameStats();
      const updatedStats: GameStats = {
        ...existingStats,
        unlockedLevels: [...new Set([...existingStats.unlockedLevels, levelId])],
        levelStats: {
          ...existingStats.levelStats,
          [levelId]: stats
        }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStats));
    } catch (error) {
      console.error('Failed to save game stats:', error);
    }
  }, []);

  const getGameStats = useCallback((): GameStats => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load game stats:', error);
    }
    
    return {
      unlockedLevels: [1], // Level 1 is always unlocked
      levelStats: {}
    };
  }, []);

  const unlockNextLevel = useCallback((completedLevelId: number) => {
    const nextLevelId = completedLevelId + 1;
    if (nextLevelId <= 5) {
      const stats = getGameStats();
      const updatedStats: GameStats = {
        ...stats,
        unlockedLevels: [...new Set([...stats.unlockedLevels, nextLevelId])]
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStats));
    }
  }, [getGameStats]);

  return {
    gameState,
    showConfetti,
    hintHighlight,
    startGame,
    pauseTimer,
    resumeTimer,
    handleSelection,
    useHint,
    saveGameStats,
    getGameStats,
    unlockNextLevel
  };
}
