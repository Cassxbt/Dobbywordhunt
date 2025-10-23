import { Level } from '../types/game';

// Word pools for each level - game randomly selects subset for each play
export const WORD_POOLS = {
  level1: ["agent", "node", "loyal", "data", "proof", "oracle", "query", "model", "grid", "roma", "meta", "deep", "epoch", "dobby", "token"],
  level2: ["openness", "verifier", "latency", "license", "control", "monetize", "finetune", "economy", "executor", "revenue", "context", "privacy", "reward", "verify", "secure", "daemon"],
  level3: ["ownership", "autonomy", "inference", "compute", "validator", "blockchain", "benchmark", "alignment", "Gradient", "sentient", "protocol", "directory", "research", "network", "zkproof"],
  level4: ["knowledge", "artificial", "proprietary", "evaluation", "recursive", "encryption", "governance", "Omlization", "fingerprint", "community", "algorithms", "checkpoint", "foundation", "deployment", "tokenomics"],
  level5: ["Democratize", "Architecture", "Information", "decentralize", "Camouflage", "fundamental", "performance", "infrastructure", "distribute", "homomorphic", "optimization", "immutable", "middleware"]
};

export const LEVELS: Level[] = [
  {
    id: 1,
    name: "Gemini",
    words: [], // Will be populated with random selection
    wordCount: 10,
    gridSize: { min: 8, max: 10 },
    timeLimit: 180, // 3 minutes
    hintsCount: 5
  },
  {
    id: 2,
    name: "DeepSeek",
    words: [], // Will be populated with random selection
    wordCount: 11,
    gridSize: { min: 10, max: 12 },
    timeLimit: 240, // 4 minutes
    hintsCount: 4
  },
  {
    id: 3,
    name: "ChatGPT",
    words: [], // Will be populated with random selection
    wordCount: 12,
    gridSize: { min: 12, max: 14 },
    timeLimit: 300, // 5 minutes
    hintsCount: 3
  },
  {
    id: 4,
    name: "Claude",
    words: [], // Will be populated with random selection
    wordCount: 12,
    gridSize: { min: 12, max: 14 },
    timeLimit: 240, // 4 minutes
    hintsCount: 3
  },
  {
    id: 5,
    name: "SentientAGI",
    words: [], // Will be populated with random selection
    wordCount: 9,
    gridSize: { min: 14, max: 16 },
    timeLimit: 300, // 5 minutes
    hintsCount: 2
  }
];

// Smart random word selection with length balancing
function selectRandomWords(pool: string[], count: number): string[] {
  // Sort words by length
  const sorted = [...pool].sort((a, b) => a.length - b.length);
  
  // Calculate balanced selection
  const shortCount = Math.floor(count * 0.3); // 30% short words
  const mediumCount = Math.floor(count * 0.4); // 40% medium words
  const longCount = count - shortCount - mediumCount; // 30% long words
  
  const third = Math.ceil(pool.length / 3);
  const shortWords = sorted.slice(0, third);
  const mediumWords = sorted.slice(third, third * 2);
  const longWords = sorted.slice(third * 2);
  
  // Shuffle and select from each category
  const shuffle = (arr: string[]) => [...arr].sort(() => Math.random() - 0.5);
  
  const selected = [
    ...shuffle(shortWords).slice(0, shortCount),
    ...shuffle(mediumWords).slice(0, mediumCount),
    ...shuffle(longWords).slice(0, longCount)
  ];
  
  // Final shuffle to randomize order
  return shuffle(selected);
}

export const getLevelById = (id: number): Level | undefined => {
  const level = LEVELS.find(level => level.id === id);
  if (!level) return undefined;
  
  // Generate random words for this level
  const poolKey = `level${id}` as keyof typeof WORD_POOLS;
  const pool = WORD_POOLS[poolKey];
  
  if (pool && level.wordCount) {
    return {
      ...level,
      words: selectRandomWords(pool, level.wordCount)
    };
  }
  
  return level;
};

export const getNextLevel = (currentLevelId: number): Level | undefined => {
  return getLevelById(currentLevelId + 1);
};
