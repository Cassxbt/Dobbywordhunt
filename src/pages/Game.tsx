import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid } from '../components/Grid';
import { FoundWordsChips } from '../components/FoundWordsChips';
import { Timer } from '../components/Timer';
import { SidePanel } from '../components/SidePanel';
import { Modal } from '../components/Modal';
import { Confetti } from '../components/Confetti';
import { HowToPlayModal } from '../components/HowToPlayModal';
import { useGame } from '../hooks/useGame';
import { getLevelById } from '../data/sentientKeywords';
import { calculateGridSize } from '../utils/resizeGrid';
import { Word } from '../types/game';
import { shareToTwitter, getBestTime, getTotalCompletedLevels } from '../utils/shareUtils';

export function Game() {
  const { levelId } = useParams<{ levelId: string }>();
  const navigate = useNavigate();
  const [gridDimensions, setGridDimensions] = useState(() => 
    calculateGridSize(getLevelById(1)!, window.innerWidth, window.innerHeight)
  );
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [showLevelFailed, setShowLevelFailed] = useState(false);
  const [showMissedWordsView, setShowMissedWordsView] = useState(false);
  const [showQuitConfirmation, setShowQuitConfirmation] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [levelCompleteStats, setLevelCompleteStats] = useState<{ timeLeft: number; wordsFound: number } | null>(null);

  const level = getLevelById(parseInt(levelId || '1'));
  
  if (!level) {
    navigate('/');
    return null;
  }

  // Reset all modal states when levelId changes
  useEffect(() => {
    setShowLevelComplete(false);
    setShowLevelFailed(false);
    setShowMissedWordsView(false);
    setShowQuitConfirmation(false);
    setShowHowToPlay(false);
    setLevelCompleteStats(null);
  }, [levelId]);

  const {
    gameState,
    showConfetti,
    hintHighlight,
    handleSelection,
    useHint,
    pauseTimer,
    resumeTimer,
    saveGameStats,
    unlockNextLevel
  } = useGame({
    level,
    onLevelComplete: (stats) => {
      setLevelCompleteStats(stats);
      setShowLevelComplete(true);
      saveGameStats(level.id, {
        completed: true,
        bestTime: stats.timeLeft,
        completionDate: new Date().toISOString()
      });
      unlockNextLevel(level.id);
    },
    onLevelFailed: () => {
      setShowLevelFailed(true);
    }
  });

  // Update grid dimensions on window resize
  useEffect(() => {
    const handleResize = () => {
      setGridDimensions(calculateGridSize(level, window.innerWidth, window.innerHeight));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [level]);

  const handleWordClick = (word: Word) => {
    if (word.isFound) {
      setSelectedWord(word);
      pauseTimer();
    }
  };

  const handleCloseSidePanel = () => {
    setSelectedWord(null);
    resumeTimer();
  };

  const handleNextLevel = () => {
    // Close modal first
    setShowLevelComplete(false);
    setLevelCompleteStats(null);
    
    const nextLevel = level.id + 1;
    if (nextLevel <= 5) {
      navigate(`/game/${nextLevel}`);
    } else {
      navigate('/stats');
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const handleQuit = () => {
    navigate('/');
  };

  const handleQuitCancel = () => {
    setShowQuitConfirmation(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold text-gray-800">
            Level {level.id}: {level.name}
          </h1>
          <Timer 
            remainingTime={gameState.remainingTime} 
            isPaused={gameState.isTimerPaused} 
          />
        </div>
        
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowHowToPlay(true)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            📖 Help
          </button>
          
          <button
            onClick={useHint}
            disabled={gameState.hintsLeft <= 0}
            className={`
              px-3 py-1 rounded text-sm font-medium transition-colors
              ${gameState.hintsLeft > 0 
                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            💡 Hints: {gameState.hintsLeft}
          </button>
        </div>
      </div>

      {/* Game Grid */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1">
          <Grid
            grid={gameState.grid}
            cellSize={gridDimensions.cellSize}
            hintHighlight={hintHighlight}
            onSelectionComplete={handleSelection}
          />
        </div>
        
        <FoundWordsChips
          foundWords={gameState.words.filter(word => word.isFound)}
          totalWords={level.words.length}
          onWordClick={handleWordClick}
        />
      </div>

      {/* Side Panel */}
      <SidePanel
        isOpen={selectedWord !== null}
        word={selectedWord}
        onClose={handleCloseSidePanel}
      />

      {/* Level Complete Modal */}
      <Modal
        isOpen={showLevelComplete}
        title="Level Complete!"
        onClose={() => setShowLevelComplete(false)}
      >
        {levelCompleteStats && (
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <p className="text-lg text-gray-600 mb-4">
              Congratulations! You found all {levelCompleteStats.wordsFound} words.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Time remaining: {Math.floor(levelCompleteStats.timeLeft / 60)}:{(levelCompleteStats.timeLeft % 60).toString().padStart(2, '0')}
            </p>
            
            <div className="space-y-3">
              {level.id < 5 ? (
                <button
                  onClick={handleNextLevel}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Next Level
                </button>
              ) : (
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">🏆</div>
                  <p className="text-lg font-semibold text-primary-600">
                    You are truly Sentient!
                  </p>
                </div>
              )}
              
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/stats')}
                className="flex-1 bg-primary-100 hover:bg-primary-200 text-primary-800 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                View Stats
              </button>
              
              <button
                onClick={() => {
                  const shareData = {
                    level,
                    timeLeft: levelCompleteStats.timeLeft,
                    totalLevelsCompleted: getTotalCompletedLevels(),
                    bestTime: getBestTime(level.id)
                  };
                  shareToTwitter(shareData);
                }}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Share
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Main Menu
              </button>
            </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Level Failed Modal */}
      <Modal
        isOpen={showLevelFailed}
        title={showMissedWordsView ? "Missed Words" : "Time's Up!"}
        onClose={() => {
          setShowLevelFailed(false);
          setShowMissedWordsView(false);
        }}
      >
        {!showMissedWordsView ? (
          // Initial Fail Modal
          <div className="text-center">
            <div className="text-6xl mb-4">⏰</div>
            <p className="text-lg text-gray-600 mb-4">
              Time's up! You found {gameState.foundWords.length} out of {level.words.length} words.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Try Again
              </button>
              
              <button
                onClick={() => setShowMissedWordsView(true)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                View Missed Words
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Main Menu
              </button>
            </div>
          </div>
        ) : (
          // Missed Words View
          <div>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setShowMissedWordsView(false)}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            </div>

            <div className="space-y-4">
              {/* Found Words */}
              <div>
                <h3 className="text-lg font-semibold text-green-600 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Found Words ({gameState.foundWords.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {gameState.words.filter(word => word.isFound).map((word) => (
                    <span
                      key={word.id}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {word.text}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missed Words */}
              <div>
                <h3 className="text-lg font-semibold text-red-600 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Missed Words ({level.words.length - gameState.foundWords.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {gameState.words.filter(word => !word.isFound).map((word) => (
                    <span
                      key={word.id}
                      className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {word.text}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Quit FAB Button */}
      <button
        onClick={() => setShowQuitConfirmation(true)}
        className="fixed bottom-4 right-4 w-12 h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-40"
        aria-label="Quit game"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Quit Confirmation Modal */}
      <Modal
        isOpen={showQuitConfirmation}
        title="Quit Game?"
        onClose={handleQuitCancel}
      >
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-lg text-gray-600 mb-2">
            Are you scared?
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Your progress will be lost.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={handleQuitCancel}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              No
            </button>
            <button
              onClick={handleQuit}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Quit
            </button>
          </div>
        </div>
      </Modal>

      {/* Confetti */}
      <Confetti isVisible={showConfetti} />
      
      <HowToPlayModal 
        isOpen={showHowToPlay} 
        onClose={() => setShowHowToPlay(false)} 
      />
    </div>
  );
}
