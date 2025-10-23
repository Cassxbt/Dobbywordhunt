
interface ConfettiProps {
  isVisible: boolean;
}

export function Confetti({ isVisible }: ConfettiProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Confetti particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-bounce-subtle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${1 + Math.random() * 0.5}s`
          }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: ['#8B5CF6', '#a78bfa', '#c4b5fd', '#ddd6fe'][Math.floor(Math.random() * 4)]
            }}
          />
        </div>
      ))}
      
      {/* Pulse effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-pulse-slow">
          <div className="w-32 h-32 bg-primary-200 rounded-full opacity-30" />
        </div>
      </div>
    </div>
  );
}
