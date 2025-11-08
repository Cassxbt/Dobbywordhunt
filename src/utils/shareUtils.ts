import { Level } from '../types/game';

interface ShareData {
  level: Level;
  timeLeft: number;
  totalLevelsCompleted: number;
  bestTime: number;
}

export function generateTweetText(data: ShareData): string {
  const { level, timeLeft } = data;
  
  // Convert seconds to MM:SS format
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const timeTaken = formatTime(level.timeLimit - timeLeft);

  const tweetText = `🎮 Just crushed Level ${level.id}: ${level.name} in ${timeTaken}!

Think you're truly Sentient? Prove it!

Play #DobbyWordHunt
https://dobbywordhunt.vercel.app

@SentientAGI #SentientAGI`;

  return tweetText;
}

export function shareToTwitter(data: ShareData): void {
  const tweetText = generateTweetText(data);
  const encodedText = encodeURIComponent(tweetText);
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
  
  // Open in new window
  window.open(twitterUrl, '_blank', 'width=550,height=420');
}

// Helper to get best time from localStorage
export function getBestTime(levelId: number): number {
  const stats = localStorage.getItem('gameStats');
  if (!stats) return 0;
  
  try {
    const parsed = JSON.parse(stats);
    const levelStats = parsed.levels?.[levelId];
    if (levelStats?.bestTime !== undefined) {
      return levelStats.bestTime;
    }
  } catch (error) {
    console.error('Error parsing game stats:', error);
  }
  
  return 0;
}

// Helper to count completed levels
export function getTotalCompletedLevels(): number {
  const stats = localStorage.getItem('gameStats');
  if (!stats) return 0;
  
  try {
    const parsed = JSON.parse(stats);
    if (parsed.levels) {
      return Object.keys(parsed.levels).length;
    }
  } catch (error) {
    console.error('Error parsing game stats:', error);
  }
  
  return 0;
}

