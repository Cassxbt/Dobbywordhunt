import { useState, useEffect } from 'react';
import { Word } from '../types/game';
import { getDefinition } from '../api/dobby';

interface SidePanelProps {
  isOpen: boolean;
  word: Word | null;
  onClose: () => void;
}

export function SidePanel({ isOpen, word, onClose }: SidePanelProps) {
  const [definition, setDefinition] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen && word) {
      fetchDefinition(word.text);
    }
  }, [isOpen, word]);

  const fetchDefinition = async (term: string) => {
    setIsLoading(true);
    setError('');
    setDefinition('');

    try {
      const result = await getDefinition(term);
      setDefinition(result.definition);
    } catch (err) {
      setError('Definition not found.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              {word?.text}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close panel"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <span className="mt-3 text-gray-600 flex items-center gap-1">
                  Asking Dobby<span className="text-lg">🐾</span>...
                </span>
              </div>
            )}

            {error && (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🐾</div>
                <p className="text-gray-700 font-medium">{error}</p>
              </div>
            )}

            {definition && !isLoading && (
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {definition}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
