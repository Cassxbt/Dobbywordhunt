import { Link } from 'react-router-dom';
import { useState } from 'react';
import { HowToPlayModal } from '../components/HowToPlayModal';

export function MainMenu() {
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-purple-200 flex flex-col relative overflow-hidden">
        {/* Background particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-2 h-2 bg-purple-300 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-40 left-20 w-3 h-3 bg-purple-200 rounded-full animate-pulse delay-2000"></div>
          <div className="absolute bottom-20 right-10 w-2 h-2 bg-purple-300 rounded-full animate-pulse delay-500"></div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 max-w-md w-full text-center relative z-10 border border-white/20">
          <div className="mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Dobby🐾 WordHunt
            </h1>
            <p className="text-xl text-gray-700 mb-2 font-medium">
              A Sentient Keywords Challenge
            </p>
            <p className="text-sm text-gray-500">
              Find hidden keywords, learn meanings
            </p>
          </div>

          <div className="space-y-4">
            <Link
              to="/game/1"
              className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🎮 Start Game
            </Link>
            
            <button
              onClick={() => setShowHowToPlay(true)}
              className="block w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg border border-gray-200"
            >
              📖 How to Play
            </button>
            
            <Link
              to="/stats"
              className="block w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg border border-gray-200"
            >
              📊 View Stats
            </Link>
          </div>

          <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
            <div className="flex items-center justify-center gap-2 text-sm text-purple-700">
              <span className="text-lg">🤖</span>
              <span className="font-medium">Dobby AI Definitions</span>
            </div>
            <p className="text-xs text-purple-600 mt-1">
              Tap found words for AI-powered explanations
            </p>
          </div>
        </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 border-t border-purple-200/50 backdrop-blur-sm bg-white/30">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
              <p className="text-gray-600">
                Built with <span className="text-pink-500">💜</span> by{' '}
                <a 
                  href="https://x.com/cassxbt" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:underline"
                >
                  @cassxbt
                </a>
                {' '}for{' '}
                <a 
                  href="https://sentient.xyz" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:underline"
                >
                  Sentient.xyz
                </a>
              </p>
              <p className="text-gray-500 text-xs">© 2024 All rights reserved</p>
            </div>
          </div>
        </footer>
      </div>

      <HowToPlayModal 
        isOpen={showHowToPlay} 
        onClose={() => setShowHowToPlay(false)} 
      />
    </>
  );
}
