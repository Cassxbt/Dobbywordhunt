import { Word } from '../types/game';

interface FoundWordsChipsProps {
  foundWords: Word[];
  totalWords: number;
  onWordClick: (word: Word) => void;
}

export function FoundWordsChips({ foundWords, totalWords, onWordClick }: FoundWordsChipsProps) {
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
        
        <div className="text-xs text-gray-500">
          {Math.round((foundWords.length / totalWords) * 100)}% complete
        </div>
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
