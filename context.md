# BoldVoice Game — Project Context

## What This Is
A browser-based 2D side-scrolling pronunciation game. The player controls a pixel-art avatar that moves right and encounters word obstacles. To clear each obstacle, the player must correctly pronounce the word shown. After all 10 words, audio recordings are sent to an LLM for detailed pronunciation scoring.

## Tech Stack
- **React 18 + Vite 5** — project structure
- **Tailwind CSS v3** — styling
- **Web Speech API** — real-time in-game word recognition (~100–300ms, Chrome/Edge only)
- **MediaRecorder API** — records audio per word in the background
- **OpenAI Whisper + GPT-4o-mini** — post-game pronunciation scoring (optional, requires API key)

## Game Flow
1. Mic permission modal appears on load
2. Player grants mic → game starts
3. Avatar moves right toward obstacle (word + emoji displayed)
4. Avatar stops → LISTENING... state activates
5. Player says the word:
   - **Correct** → obstacle explodes, avatar resets to left, next word loads
   - **Wrong** → avatar bounces back like hitting a wall, listens again
6. After all 10 words → scoring screen (LLM analyzes recordings) → win screen with player photo + per-word feedback

## Key Design Decisions
- **Hybrid speech approach**: Web Speech API handles real-time game mechanics (fast), MediaRecorder captures audio simultaneously for end-of-game LLM scoring
- **Randomized word bank**: 10 words picked randomly from a 30-word bank each session
- **No API key = graceful fallback**: game works without OpenAI key, win screen shows Web Speech results instead
- **Pixel art style** with CSS/SVG pixel character; real `character.jpeg` shown only on win screen

## File Structure
```
boldvoice/
├── public/
│   └── character.jpeg          # Player photo shown on win screen
├── src/
│   ├── App.jsx                 # Main game engine, all game state & phases
│   ├── index.css               # Global styles + pixel art animations
│   ├── main.jsx                # React entry point
│   ├── data/
│   │   └── wordBank.js         # 30-word bank + getRandomWords(10)
│   ├── hooks/
│   │   ├── useSpeech.js        # Web Speech API — real-time recognition
│   │   └── useAudioRecorder.js # MediaRecorder — per-word audio capture
│   └── components/
│       ├── PixelCharacter.jsx  # CSS/SVG pixel art avatar (6x10 grid)
│       ├── Obstacle.jsx        # Word obstacle block with emoji
│       ├── MicModal.jsx        # Mic permission modal
│       └── WinScreen.jsx       # End screen with photo + LLM results
├── .env.example                # VITE_OPENAI_API_KEY=sk-...
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## Game Phases (state machine in App.jsx)
| Phase | Description |
|-------|-------------|
| `init` | Mic permission modal |
| `playing` | Avatar animating toward obstacle |
| `listening` | Avatar stopped, speech recognition active |
| `success` | Correct word — obstacle explodes, brief pause |
| `fail` | Wrong word — bounce-back animation, re-enters listening |
| `scoring` | All 10 done — sending audio to LLM |
| `finished` | Win screen displayed |

## Environment Variables
```
VITE_OPENAI_API_KEY=sk-...   # Optional — enables LLM scoring at end
```

## Running Locally
```bash
npm install
npm run dev
# Open http://localhost:5173 (or next available port) in Chrome
```

## Deploying to Vercel
```bash
npx vercel --prod
# Add VITE_OPENAI_API_KEY in Vercel dashboard → Environment Variables
```

## Known Constraints
- Web Speech API only works in **Chrome and Edge** (not Safari, Firefox)
- Mic must be granted — game is non-functional without it
- LLM scoring adds ~2–5s delay after the last word (shows "Analyzing..." overlay)

## Bug Fixed
- **Speech restart loop**: `recognition.abort()` was triggering `onend` before `stopSpeech()` could set `activeRef = false`, causing infinite restart. Fixed by setting `activeRef.current = false` before calling `abort()` in both match and final-no-match cases.
