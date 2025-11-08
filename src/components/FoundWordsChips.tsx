import { Word } from '../types/game';

interface FoundWordsChipsProps {
  foundWords: Word[];
  totalWords: number;
  onWordClick: (word: Word) => void;
  onQuit?: () => void;
}

export function FoundWordsChips({ foundWords, totalWords, onWordClick, onQuit }: FoundWordsChipsProps) {
  if (foundWords.length === 0) {
    return (
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-center">
          <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
            <span className="text-lg">🎯</span>
            <span>Found: 0 / {totalWords}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-sm">
          <span className="text-lg">🎯</span>
          <span>Found: {foundWords.length} / {totalWords}</span>
        </div>
        
        {onQuit && (
          <button
            onClick={onQuit}
            onTouchEnd={(e) => { e.preventDefault(); onQuit(); }}
            className="w-11 h-11 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 rounded-full shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center touch-target"
            style={{ 
              WebkitTapHighlightColor: 'rgba(0,0,0,0.1)', 
              touchAction: 'manipulation'
            }}
            aria-label="Quit game"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-1">
        {foundWords.map((word) => (
          <button
            key={word.id}
            onClick={() => onWordClick(word)}
            className="flex-shrink-0 bg-primary-100 hover:bg-primary-200 text-primary-800 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:shadow-md hover:scale-105"
          >
            {word.text}
          </button>
        ))}
      </div>
    </div>
  );
}
