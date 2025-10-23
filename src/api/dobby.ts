import { DefinitionResponse } from '../types/game';

const FIREWORKS_API_URL = 'https://api.fireworks.ai/inference/v1/completions';
const DOBBY_MODEL = 'accounts/sentientfoundation/models/dobby-unhinged-llama-3-3-70b-new';
const FIREWORKS_API_KEY = (import.meta as any).env?.VITE_FIREWORKS_API_KEY || '';

// Cache for definitions
const CACHE_KEY = 'dobby-definitions';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

interface CachedDefinition {
  text: string;
  timestamp: number;
}

interface CacheStore {
  [word: string]: CachedDefinition;
}

function getCachedDefinition(term: string): string | null {
  try {
    const cache = localStorage.getItem(CACHE_KEY);
    if (!cache) return null;

    const parsed: CacheStore = JSON.parse(cache);
    const cached = parsed[term.toLowerCase()];

    if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
      return cached.text;
    }
  } catch (error) {
    console.error('Error reading cache:', error);
  }
  return null;
}

function setCachedDefinition(term: string, definition: string): void {
  try {
    const cache = localStorage.getItem(CACHE_KEY);
    const parsed: CacheStore = cache ? JSON.parse(cache) : {};

    parsed[term.toLowerCase()] = {
      text: definition,
      timestamp: Date.now()
    };

    localStorage.setItem(CACHE_KEY, JSON.stringify(parsed));
  } catch (error) {
    console.error('Error writing cache:', error);
  }
}

// Fun opening messages for Dobby
const DOBBY_OPENINGS = [
  "Dobby's here to school you!",
  "Let me break this down for you!",
  "Time for a knowledge drop!",
  "Dobby's got the scoop!",
  "Here's what you need to know!",
  "Knowledge incoming!",
  "Let's decode this!",
  "Dobby to the rescue!",
  "Make I update you this parole.",
  "Calm down, I go explain"
];

function getRandomOpening(): string {
  return DOBBY_OPENINGS[Math.floor(Math.random() * DOBBY_OPENINGS.length)];
}

export async function getDefinition(term: string): Promise<DefinitionResponse> {
  // Check cache first
  const cached = getCachedDefinition(term);
  if (cached) {
    return {
      term,
      definition: cached
    };
  }

  // Make API call
  try {
    const opening = getRandomOpening();
    const prompt = `${opening} Explain the term '${term}' in the context of AI, blockchain, and decentralized systems. If it relates to Sentient's ecosystem, highlight that connection. Otherwise, explain its general meaning in tech/AI. Be precise, technical, and informative. Max 2-3 sentences.`;

    const response = await fetch(FIREWORKS_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FIREWORKS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: DOBBY_MODEL,
        prompt: prompt,
        max_tokens: 300,
        temperature: 0.7,
        top_p: 0.9,
        stop: ['\n\n', '\n']
      })
    });

    if (!response.ok) {
      console.error(`API Error for term "${term}":`, response.status, response.statusText);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Definition received for "${term}":`, data);
    
    if (data.choices && data.choices[0] && data.choices[0].text) {
      const definition = data.choices[0].text.trim();
      
      // Cache the result
      setCachedDefinition(term, definition);
      
      return {
        term,
        definition
      };
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('Error fetching definition:', error);
    throw new Error('Dobby🐾 is currently unavailable. retry again later.');
  }
}

export function isApiConfigured(): boolean {
  return FIREWORKS_API_KEY.length > 0 && FIREWORKS_API_KEY !== 'your_fireworks_api_key_here';
}
