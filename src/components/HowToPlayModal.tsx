import { Modal } from './Modal';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HowToPlayModal({ isOpen, onClose }: HowToPlayModalProps) {
  return (
    <Modal isOpen={isOpen} title="📖 How to Play" onClose={onClose}>
      <div className="space-y-6">
        {/* Objective */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <span>🎯</span>
            <span>Objective</span>
          </h3>
          <p className="text-gray-600">
            Find all Sentient keywords hidden in the grid before time runs out!
          </p>
        </section>

        {/* Drag Patterns */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span>↔️</span>
            <span>Accepted Directions</span>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-2xl mb-1">→</div>
              <div className="text-sm font-medium text-gray-700">Horizontal</div>
              <div className="text-xs text-gray-500">Left to Right</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-2xl mb-1">↓</div>
              <div className="text-sm font-medium text-gray-700">Vertical</div>
              <div className="text-xs text-gray-500">Top to Bottom</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-2xl mb-1">↘</div>
              <div className="text-sm font-medium text-gray-700">Diagonal</div>
              <div className="text-xs text-gray-500">Down-Right</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-2xl mb-1">↙</div>
              <div className="text-sm font-medium text-gray-700">Diagonal</div>
              <div className="text-xs text-gray-500">Down-Left</div>
            </div>
          </div>
          <div className="mt-3 bg-primary-50 border border-primary-200 rounded-lg p-3">
            <p className="text-sm text-primary-800">
              <strong>Tip:</strong> Click or tap on the first letter, then drag to the last letter of the word. Release to submit!
            </p>
          </div>
        </section>

        {/* Important Warning */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <span>⚠️</span>
            <span>Important</span>
          </h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              This game focuses exclusively on <strong>Sentient AI terminologies</strong>. 
              To progress through all levels, you must learn about Sentient's key concepts and technologies!
            </p>
          </div>
        </section>

        {/* Features */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span>💡</span>
            <span>Game Features</span>
          </h3>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <div className="font-medium text-gray-800">Hints</div>
                <div className="text-sm text-gray-600">Reveal the first letter of a random word. Use them wisely!</div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-2xl">⏱️</div>
              <div>
                <div className="font-medium text-gray-800">Timer</div>
                <div className="text-sm text-gray-600">Complete each level before time expires. Timer pauses when viewing definitions.</div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-2xl">🐾</div>
              <div>
                <div className="font-medium text-gray-800">Dobby Dictionary</div>
                <div className="text-sm text-gray-600">Tap any found word to view its AI-powered definition from Dobby!</div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-2xl">🔓</div>
              <div>
                <div className="font-medium text-gray-800">Progressive Unlocking</div>
                <div className="text-sm text-gray-600">Complete each level to unlock the next. 5 challenging levels await!</div>
              </div>
            </div>
          </div>
        </section>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Got it!
        </button>
      </div>
    </Modal>
  );
}

