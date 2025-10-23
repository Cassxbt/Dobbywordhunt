import React from 'react';
import { Link } from 'react-router-dom';
import { LEVELS } from '../data/sentientKeywords';
import { GameStats } from '../types/game';

export function Stats() {
  const [gameStats] = React.useState<GameStats>(() => {
    try {
      const stored = localStorage.getItem('wordhunt-game-stats');
      return stored ? JSON.parse(stored) : { unlockedLevels: [1], levelStats: {} };
    } catch {
      return { unlockedLevels: [1], levelStats: {} };
    }
  });

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getLevelStatus = (levelId: number) => {
    const isUnlocked = gameStats.unlockedLevels.includes(levelId);
    const stats = gameStats.levelStats[levelId];
    const isCompleted = stats?.completed || false;
    
    return { isUnlocked, isCompleted, stats };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800">Game Stats</h1>
            <Link
              to="/"
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Back to Menu
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-primary-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-primary-600">
                {gameStats.unlockedLevels.length - 1}
              </div>
              <div className="text-sm text-gray-600">Levels Unlocked</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                {Object.values(gameStats.levelStats).filter(s => s.completed).length}
              </div>
              <div className="text-sm text-gray-600">Levels Completed</div>
            </div>
          </div>
        </div>

        {/* Level List */}
        <div className="space-y-4">
          {LEVELS.map((level) => {
            const { isUnlocked, isCompleted, stats } = getLevelStatus(level.id);
            
            return (
              <div
                key={level.id}
                className={`
                  bg-white rounded-xl shadow-lg p-6 transition-all duration-200
                  ${isUnlocked ? 'hover:shadow-xl' : 'opacity-60'}
                `}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Level {level.id}: {level.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {level.words.length} words • {Math.floor(level.timeLimit / 60)} min • {level.hintsCount} hints
                    </p>
                  </div>
                  
                  <div className="text-right">
                    {isCompleted ? (
                      <div className="text-green-600 font-semibold">
                        ✅ Completed
                      </div>
                    ) : isUnlocked ? (
                      <div className="text-blue-600 font-semibold">
                        🔓 Available
                      </div>
                    ) : (
                      <div className="text-gray-400 font-semibold">
                        🔒 Locked
                      </div>
                    )}
                  </div>
                </div>

                {isCompleted && stats && (
                  <div className="bg-green-50 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Best Time:</span>
                        <span className="font-semibold text-green-600 ml-2">
                          {stats.bestTime ? formatTime(stats.bestTime) : 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Completed:</span>
                        <span className="font-semibold text-green-600 ml-2">
                          {stats.completionDate ? new Date(stats.completionDate).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {level.words.map((word, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                    >
                      {word}
                    </span>
                  ))}
                </div>

                {isUnlocked ? (
                  <Link
                    to={`/game/${level.id}`}
                    className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    {isCompleted ? 'Play Again' : 'Start Level'}
                  </Link>
                ) : (
                  <button
                    disabled
                    className="inline-block bg-gray-300 text-gray-500 font-semibold py-2 px-4 rounded-lg cursor-not-allowed"
                  >
                    Complete Previous Level
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
