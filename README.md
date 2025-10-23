# Dobby🐾 WordHunt

A Sentient Keywords Challenge - An interactive word search game featuring AI model progression and Dobby AI-powered definitions.

## ⭐ Star this repository if you enjoyed the game!

---

## 🎮 Game Features

- **Progressive Levels**: Travel through AI models (Gemini → DeepSeek → ChatGPT → Claude → SentientAGI)
- **Random Words**: Each playthrough features a unique selection of words from extensive keyword pools
- **Dobby-Powered explanations**: Dobby AI gives technical explanations of Sentient terminologies
- **Smart Grid Puzzles**: Anti-pattern algorithms ensure realistic word-finding challenges
- **Mobile-First Design**: Optimized for mobile and desktop interactions
- **Progress Tracking**: LocalStorage-based level unlocking and statistics
- **Social Sharing**: Tweet your achievements with one click

## 🛠️ Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Fireworks AI** - Dobby dictionary engine
- **React Router** - Navigation

## 🎯 Game Mechanics

### Level Progression
- **5 difficulty levels** with sequential unlocking
- **Word pools**: 13-17 words per level, randomly selected each game
- **Time limits**: Balanced per difficulty (3-5 minutes)
- **Hints system**: Limited hints reveal first letters

### Word Discovery
- **4 directions**: Horizontal, Vertical, Diagonal (down-right, down-left)
- **Drag selection**: Touch and mouse support
- **Visual feedback**: Real-time selection overlay
- **Smart validation**: Case-insensitive matching with reverse support

### Dobby Dictionary
- **AI definitions**: Context-aware explanations of Sentient terms
- **Caching**: 7-day definition cache for performance
- **Personality**: fun opening messages including Nigerian Pidgin
- **Fallback**: Graceful error handling

## 📁 Project Structure

```
src/
├── api/          # Dobby AI integration
├── components/   # Reusable UI components
├── data/         # Word pools and level configs
├── hooks/        # Custom React hooks
├── pages/        # Route components
├── types/        # TypeScript definitions
└── utils/        # Helper functions
```

## 🎨 Key Features Implementation

### Random Word Selection
Each level has 15+ keywords. The game randomly selects a balanced subset (30% short, 40% medium, 30% long words) for each level.

### Smart Grid Generation
- Anti-pattern placement algorithm
- Sentient keyword-based letter filling
- Prevents obvious visual patterns
- Ensures genuine search challenge

### Dobby AI Integration
- Fireworks AI completions API
- Custom Dobby model: `dobby-unhinged-llama-3-3-70b-new`
- Technical accuracy with unhinged personality
- Automated caching system

## 🔒 Security

- Dobby AI integration with intelligent caching
- Optimized for mobile and desktop gameplay
- No hardcoded credentials
- Client-side caching minimizes API calls

## 📱 Responsive Design

- Mobile-first approach
- Touch-optimized grid cells (36-44px minimum)
- Viewport-adaptive grid sizing
- Glass-morphism UI elements

## 📄 License

**Built with 🩷 by [cassxbt](https://x.com/cassxbt) for [Sentient.xyz](https://sentient.xyz)**

### Links
- 🎮 [Play Game](https://dobby-wordhunt.vercel.app) *(Deploy link here)*
- 🐛 [Report Bug](https://github.com/cassxbt/dobby-wordhunt/issues)
- ✨ [Request Feature](https://github.com/cassxbt/dobby-wordhunt/issues)

---

© 0x. All rights reserved
