import { Level } from '../types/game';

// Word pools for each level - game randomly selects subset for each play
export const WORD_POOLS = {
  level1: ["agent", "node", "loyal", "data", "proof", "oracle", "query", "model", "grid", "roma", "meta", "deep", "epoch", "dobby", "token"],
  
  level2: ["openness", "verifier", "latency", "license", "control", "monetize", "finetune", "economy", "executor", "revenue", "context", "privacy", "reward", "verify", "secure", "daemon"],
  
  level3: [
    // Existing (keep ≤10 letter words)
    "autonomy", "inference", "compute", "validator", "blockchain", "benchmark", "alignment", "Gradient", "sentient", "protocol", "directory", "research", "network", "zkproof",
    // NEW mobile-friendly words (≤10 letters)
    "layer", "shard", "wallet", "subnet", "rollup", "staking", "slashing", "merkle", "nonce", "gas", "proof", "consensus", "fork", "finality"
  ],
  
  level4: [
    // Existing (keep ≤10 letter words)
    "knowledge", "artificial", "evaluation", "recursive", "encryption", "governance", "Omlization", "fingerprint", "community", "algorithms", "checkpoint", "foundation",
    // NEW mobile-friendly words (≤10 letters)
    "backprop", "dropout", "tensor", "gradient", "kernel", "pipeline", "feature", "embedding", "softmax", "neuron", "weight", "bias", "pooling", "sigmoid", "relu", "adam"
  ],
  
  level5: [
    // Existing (keep ≤10 letter words)
    "Camouflage", "fundamental", "distribute", "immutable", "middleware",
    // NEW mobile-friendly words (≤10 letters)
    "consensus", "byzantine", "sybil", "fork", "finality", "sharding", "plasma", "zksync", "rollups", "bridges", "indexer", "validator", "sequencer", "arbitrum", "polygon"
  ]
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
  
  // Mobile detection
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 480;
  
  // DEBUG: Log mobile detection
  console.log('📱 getLevelById DEBUG:', {
    levelId: id,
    windowInnerWidth: typeof window !== 'undefined' ? window.innerWidth : 'N/A',
    isMobile,
    'level.gridSize (original)': level.gridSize
  });
  
  const poolKey = `level${id}` as keyof typeof WORD_POOLS;
  let pool = WORD_POOLS[poolKey];
  
  let adjustedWordCount = level.wordCount || 10;
  let adjustedGridSize = level.gridSize;
  
  if (isMobile) {
    // 1. Filter words to max 10 letters
    const MAX_MOBILE_WORD_LENGTH = 10;
    pool = pool.filter(word => word.length <= MAX_MOBILE_WORD_LENGTH);
    
    // 2. Reduce word count by 20%
    adjustedWordCount = Math.max(6, Math.floor(level.wordCount! * 0.8));
    
    // 3. Force grid sizes based on level
    if (id <= 2) {
      // Levels 1-2: 8x8 (optimal for small screens)
      adjustedGridSize = { min: 8, max: 8 };
    } else {
      // Levels 3-5: 10x10 (manageable challenge)
      adjustedGridSize = { min: 10, max: 10 };
    }
    
    console.log('✅ MOBILE ADJUSTMENTS:', {
      adjustedGridSize,
      adjustedWordCount,
      poolSize: pool.length
    });
  }
  
  // Select random words from (possibly filtered) pool
  if (pool && level.wordCount) {
    return {
      ...level,
      wordCount: adjustedWordCount,
      gridSize: adjustedGridSize,
      words: selectRandomWords(pool, adjustedWordCount)
    };
  }
  
  return level;
};

export const getNextLevel = (currentLevelId: number): Level | undefined => {
  return getLevelById(currentLevelId + 1);
};
