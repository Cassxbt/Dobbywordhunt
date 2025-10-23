
interface TimerProps {
  remainingTime: number;
  isPaused: boolean;
}

export function Timer({ remainingTime, isPaused }: TimerProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (remainingTime <= 30) return 'text-red-600';
    if (remainingTime <= 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`text-2xl font-bold ${getTimerColor()}`}>
        {formatTime(remainingTime)}
      </div>
      {isPaused && (
        <div className="text-sm text-gray-500 font-medium">
          PAUSED
        </div>
      )}
    </div>
  );
}
