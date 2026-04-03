# BoldVoice Game — Update Log

## Speech Engine: Deepgram Integration
- **Removed Web Speech API** as the sole speech engine (Chrome/Edge only)
- **Added Deepgram WebSocket API** (`useDeepgramSpeech.js`) for real-time speech-to-text
- Deepgram is now the **only speech engine** — works across all browsers (Chrome, Safari, Firefox, Edge)
- Uses `nova-2` model with interim results for fast word matching
- API key stored in `.env` as `VITE_DEEPGRAM_API_KEY`

## Post-Game Scoring: Gemini Integration
- **Replaced OpenAI (Whisper + GPT-4o-mini)** with **Google Gemini 2.5 Flash**
- Audio recordings are converted to base64 and sent directly to Gemini for pronunciation analysis
- Gemini listens to actual audio and scores each word 0–100 compared to native American English speakers
- Scoring rubric: 95–100 (native-like), 80–94 (good, minor accent), 60–79 (understandable), 40–59 (difficult), 0–39 (unintelligible)
- All 5 words scored in a **single API call** (avoids rate limiting)
- Handles Gemini 2.5 Flash thinking tokens — filters `thought: true` parts from response
- Strips markdown code block wrappers (` ```json `) from Gemini output before parsing
- Graceful fallback if API fails — shows estimated scores based on in-game results
- API key stored in `.env` as `VITE_GEMINI_API_KEY`

## Game Configuration
- Reduced from **10 words to 5 words** per session
- Increased avatar movement speed (2.5 → 8 for old horizontal, 0.7% per frame for new vertical)

## Bug Fixes
- **`onFail()` recording restart**: `startRecording(word)` now called on retry so audio is captured for every attempt (was missing before)
- **`character.jpeg` path**: Copied into `public/` directory so `WinScreen` image loads correctly via Vite's static file serving
- **`finishGame` catch block**: Added `score` field to fallback results (was missing, causing 0% display)
- **Deepgram REST CORS**: Wrapped Deepgram REST transcription in its own try/catch so failures don't block Gemini scoring
- **Gemini model**: Switched from `gemini-2.0-flash` (deprecated for new users) to `gemini-2.5-flash`

## UI/UX Overhaul
### Layout
- **Phone-first responsive design**: `max-w-[430px]` centered on desktop, full-width on mobile
- Uses `h-[100dvh]` for proper mobile viewport (handles address bar on phones)
- Switched from side-scrolling (left→right) to **forward-moving vertical** (bottom→top) animation

### 3D Perspective Track (`Track.jsx`)
- Trapezoid-shaped running lane (narrower at top = depth perspective)
- Red/white striped borders on both sides
- Dashed center lane marking
- Lane markings scroll downward when character is moving (motion effect)
- Dark blue gradient surface with atmospheric lighting

### Character (`BoldCharacter.jsx`)
- Replaced pixel-art character with a **pink gradient ball with bold "B" letter**
- Bouncing animation when moving forward
- Glowing pulse + expanding ring effect when in listening state
- **Scales down** as it moves forward (3D depth effect via `getScale()`)

### Obstacle (`Obstacle.jsx`)
- Warm wooden crate style with gradient and border
- **Arch-shaped opening** at the bottom (the B conceptually passes through)
- Emoji displayed on the crate, word label above
- Scales with perspective to match 3D depth

### Win Screen (`WinScreen.jsx`)
- Displays **percentage score (0–100%)** per word instead of correct/incorrect
- Color-coded: green (80+), yellow (50–79), red (below 50)
- Shows **average score** across all words
- Gemini feedback tip displayed below each score

### MicModal
- Updated to match new pink/modern design language
- Rounded corners, gradient buttons, subtle glow effects

### Styling (`index.css`)
- New animations: `roll-bounce`, `listening-glow`, `pulse-ring`, `lane-scroll`, `mic-bounce`
- Updated `bounce-back` for vertical movement
- Replaced pixel-art/monospace font with Inter/system-ui
- Pink/magenta color scheme replacing old yellow pixel-art look

## Files Added
- `src/hooks/useDeepgramSpeech.js` — Deepgram WebSocket speech recognition
- `src/components/BoldCharacter.jsx` — New "B" ball character
- `src/components/Track.jsx` — 3D perspective running track
- `update.md` — This file

## Files Removed (no longer imported, can be deleted)
- `src/hooks/useSpeech.js` — Old Web Speech API hook (superseded by Deepgram)
- `src/components/PixelCharacter.jsx` — Old pixel-art character (replaced by BoldCharacter)

## Environment Variables
```
VITE_DEEPGRAM_API_KEY=...   # Required — real-time speech recognition
VITE_GEMINI_API_KEY=...     # Required — post-game pronunciation scoring
```
