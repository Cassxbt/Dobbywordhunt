import { Link } from 'react-router-dom';
import { useState } from 'react';
import { HowToPlayModal } from '../components/HowToPlayModal';

export function MainMenu() {
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 flex flex-col relative overflow-hidden">
        {/* Subtle background accent */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-50/30 rounded-full blur-3xl"></div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-8 max-w-md w-full text-center relative z-10 border border-gray-100/50">
            <div className="mb-10">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-3">
                Dobby WordHunt
              </h1>
              <p className="text-lg text-gray-700 mb-2 font-semibold">
                A Sentient Keywords Challenge
              </p>
              <p className="text-sm text-gray-500">
                Find hidden keywords, learn meanings
              </p>
            </div>

            <div className="space-y-3">
              <Link
                to="/game/1"
                className="block w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3.5 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] min-h-[52px] flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Start Game
              </Link>
              
              <button
                onClick={() => setShowHowToPlay(true)}
                className="block w-full bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 font-semibold py-3.5 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] min-h-[52px] flex items-center justify-center gap-2 border border-gray-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                How to Play
              </button>
              
              <Link
                to="/stats"
                className="block w-full bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 font-semibold py-3.5 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] min-h-[52px] flex items-center justify-center gap-2 border border-gray-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                View Stats
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 border-t border-gray-200/50 backdrop-blur-sm bg-white/50">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
              <p className="text-gray-600">
                Built with <span className="text-purple-600">💜</span> by{' '}
                <a 
                  href="https://x.com/cassxbt" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-semibold text-purple-600 hover:text-purple-700 hover:underline transition-colors"
                >
                  @cassxbt
                </a>
                {' '}for{' '}
                <a 
                  href="https://sentient.xyz" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-semibold text-purple-600 hover:text-purple-700 hover:underline transition-colors"
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
