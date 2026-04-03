import { useState, useEffect, useRef, useCallback } from 'react'
import { getRandomWords } from './data/wordBank'
import { useDeepgramSpeech } from './hooks/useDeepgramSpeech'
import { useAudioRecorder } from './hooks/useAudioRecorder'
import { useSounds } from './hooks/useSounds'
import BoldCharacter from './components/BoldCharacter'
import Obstacle from './components/Obstacle'
import Track from './components/Track'
import MicModal from './components/MicModal'
import WinScreen from './components/WinScreen'

const AVATAR_START = 76
const OBSTACLE_Y = 33
const AVATAR_STOP = OBSTACLE_Y + 11
const MOVE_SPEED = 0.7

function getCharScale(pos) {
  const t = Math.max(0, Math.min(1, (AVATAR_START - pos) / (AVATAR_START - AVATAR_STOP)))
  return 1.0 - t * 0.28
}

export default function App() {
  const [phase, setPhase] = useState('init')
  const [micError, setMicError] = useState(null)
  const [words, setWords] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [avatarPos, setAvatarPos] = useState(AVATAR_START)
  const [bouncing, setBouncing] = useState(false)
  const [exploding, setExploding] = useState(false)
  const [heardText, setHeardText] = useState('')
  const [results, setResults] = useState([])
  const [scoringStatus, setScoringStatus] = useState('')
  const [elapsedTime, setElapsedTime] = useState(0)

  const phaseRef = useRef('init')
  const avatarPosRef = useRef(AVATAR_START)
  const wordsRef = useRef([])
  const currentIdxRef = useRef(0)
  const animFrameRef = useRef(null)
  const resultsAccumRef = useRef([])
  const startTimeRef = useRef(null)

  useEffect(() => { phaseRef.current = phase }, [phase])
  useEffect(() => { wordsRef.current = words }, [words])
  useEffect(() => { currentIdxRef.current = currentIdx }, [currentIdx])

  const { startRecording, stopRecording, getRecordings, reset: resetRecordings, initStream } = useAudioRecorder()
  const sfx = useSounds()

  const { start: startSpeech, stop: stopSpeech } = useDeepgramSpeech({
    onResult: handleSpeechResult,
    onError: (msg) => setMicError(msg),
  })

  // All game logic reads from refs — no stale closures
  function enterListening() {
    setPhase('listening')
    phaseRef.current = 'listening'
    setHeardText('')
    sfx.listen()
    const word = wordsRef.current[currentIdxRef.current]?.word
    if (word) {
      startSpeech(word)
      startRecording(word)
    }
  }

  function handleSpeechResult({ matched, transcript }) {
    if (phaseRef.current !== 'listening') return
    setHeardText(transcript)
    if (matched) {
      onSuccess(transcript)
    } else {
      onFail()
    }
  }

  async function onSuccess(transcript) {
    stopSpeech()
    const idx = currentIdxRef.current
    const word = wordsRef.current[idx]
    await stopRecording(word.word)

    resultsAccumRef.current.push({
      word: word.word,
      emoji: word.emoji,
      transcript,
      correct: true,
    })

    setPhase('success')
    phaseRef.current = 'success'
    setExploding(true)
    sfx.success()
    sfx.explode()

    setTimeout(() => {
      setExploding(false)
      const nextIdx = idx + 1
      if (nextIdx >= wordsRef.current.length) {
        finishGame()
      } else {
        currentIdxRef.current = nextIdx
        setCurrentIdx(nextIdx)
        setAvatarPos(AVATAR_START)
        avatarPosRef.current = AVATAR_START
        setPhase('playing')
        phaseRef.current = 'playing'
      }
    }, 600)
  }

  function onFail() {
    sfx.fail()
    setBouncing(true)
    setTimeout(() => {
      setBouncing(false)
      setPhase('listening')
      phaseRef.current = 'listening'
      const word = wordsRef.current[currentIdxRef.current]?.word
      if (word) {
        startSpeech(word)
        startRecording(word)
      }
    }, 600)
  }

  function onSkip() {
    stopSpeech()
    const idx = currentIdxRef.current
    const word = wordsRef.current[idx]
    stopRecording(word.word)

    resultsAccumRef.current.push({
      word: word.word,
      emoji: word.emoji,
      transcript: '',
      correct: false,
    })

    setExploding(false)
    const nextIdx = idx + 1
    if (nextIdx >= wordsRef.current.length) {
      finishGame()
    } else {
      currentIdxRef.current = nextIdx
      setCurrentIdx(nextIdx)
      setAvatarPos(AVATAR_START)
      avatarPosRef.current = AVATAR_START
      setPhase('playing')
      phaseRef.current = 'playing'
    }
  }

  async function finishGame() {
    stopSpeech()
    const finalTime = Math.round((Date.now() - startTimeRef.current) / 1000)
    setElapsedTime(finalTime)
    setPhase('scoring')
    setScoringStatus('Analyzing your pronunciation...')
    const recordings = getRecordings()
    const accumulated = resultsAccumRef.current
    try {
      const scored = await scoreWithLLM(recordings, accumulated)
      setResults(scored)
    } catch {
      setResults(accumulated.map(r => ({
        word: r.word, emoji: r.emoji,
        score: r.correct ? 85 : 40,
        feedback: 'Scoring unavailable — showing estimate.',
      })))
    }
    sfx.complete()
    setPhase('finished')
  }

  useEffect(() => {
    if (phase !== 'playing') {
      cancelAnimationFrame(animFrameRef.current)
      return
    }
    const tick = () => {
      if (phaseRef.current !== 'playing') return
      const next = avatarPosRef.current - MOVE_SPEED
      if (next <= AVATAR_STOP) {
        avatarPosRef.current = AVATAR_STOP
        setAvatarPos(AVATAR_STOP)
        enterListening()
      } else {
        avatarPosRef.current = next
        setAvatarPos(next)
        animFrameRef.current = requestAnimationFrame(tick)
      }
    }
    animFrameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animFrameRef.current)
  }, [phase, currentIdx]) // eslint-disable-line

  const startGame = useCallback(() => {
    const selected = getRandomWords(5)
    wordsRef.current = selected
    currentIdxRef.current = 0
    avatarPosRef.current = AVATAR_START
    resultsAccumRef.current = []
    resetRecordings()
    setWords(selected)
    setCurrentIdx(0)
    setAvatarPos(AVATAR_START)
    setResults([])
    setHeardText('')
    setElapsedTime(0)
    startTimeRef.current = Date.now()
    setPhase('playing')
    phaseRef.current = 'playing'
  }, [resetRecordings])

  const handleGrantMic = async () => {
    try {
      await initStream()
      sfx.start()
      startGame()
    } catch {
      setMicError('Could not access microphone. Please allow access and try again.')
    }
  }

  const handleRestart = () => setPhase('init')

  const charState = phase === 'listening' ? 'listening'
    : phase === 'playing' ? 'moving'
    : phase === 'success' ? 'success'
    : 'idle'

  const currentWord = words[currentIdx]
  const progress = words.length > 0 ? (currentIdx / words.length) * 100 : 0
  const avatarScale = getCharScale(avatarPos)
  const isMoving = phase === 'playing'

  return (
    <div className="relative w-full max-w-[430px] h-full mx-auto overflow-hidden bg-[#0d0d1f] select-none">
      <Track moving={isMoving} />

      {/* HUD — step dots */}
      {phase !== 'init' && phase !== 'finished' && (
        <div className="absolute top-0 left-0 right-0 z-20 px-6 pt-5 pb-4"
          style={{ background: 'linear-gradient(180deg, rgba(13,13,31,0.95) 0%, rgba(13,13,31,0.6) 60%, transparent 100%)' }}>
          <div className="flex items-center justify-center gap-2.5">
            {words.map((_, i) => (
              <div
                key={i}
                className="transition-all duration-400"
                style={{
                  width: i === currentIdx ? 28 : 10,
                  height: 10,
                  borderRadius: 5,
                  background: i < currentIdx
                    ? 'linear-gradient(90deg, #ec4899, #f97316)'
                    : i === currentIdx
                    ? 'linear-gradient(90deg, #ec4899, #f97316)'
                    : 'rgba(255,255,255,0.08)',
                  boxShadow: i === currentIdx
                    ? '0 0 12px rgba(236, 72, 153, 0.5)'
                    : 'none',
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Obstacle */}
      {phase !== 'init' && phase !== 'finished' && phase !== 'scoring' && currentWord && (
        <div
          className="absolute left-1/2 z-10"
          style={{ top: `${OBSTACLE_Y}%`, transform: 'translate(-50%, -50%)' }}
        >
          <Obstacle
            word={currentWord.word}
            emoji={currentWord.emoji}
            exploding={exploding}
          />
        </div>
      )}

      {/* Character */}
      {phase !== 'init' && phase !== 'finished' && phase !== 'scoring' && (
        <div
          className={`absolute left-1/2 z-10 ${bouncing ? 'bounce-back' : ''}`}
          style={{ top: `${avatarPos}%`, transform: 'translate(-50%, -50%)' }}
        >
          <BoldCharacter state={charState} scale={avatarScale} />
        </div>
      )}

      {/* Listening indicator */}
      {phase === 'listening' && (
        <div className="absolute bottom-6 left-0 right-0 z-20 flex flex-col items-center gap-2.5 px-10">
          {heardText && (
            <div className="text-white/25 text-xs px-4 py-1.5 rounded-full mb-0.5"
              style={{ background: 'rgba(255,255,255,0.03)' }}>
              heard: "{heardText}"
            </div>
          )}
          <div
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl transition-all"
            style={{
              background: 'linear-gradient(90deg, #ec4899, #f97316)',
              boxShadow: '0 4px 24px rgba(236, 72, 153, 0.3)',
            }}
          >
            <span className="text-base" style={{ animation: 'mic-bounce 0.8s ease-in-out infinite' }}>🎤</span>
            <span className="text-white text-sm font-bold tracking-wide">
              Listening...
            </span>
          </div>
          <button
            onClick={onSkip}
            className="w-full py-2.5 rounded-2xl text-xs font-semibold tracking-wide transition-all active:scale-[0.97]"
            style={{
              background: 'linear-gradient(135deg, rgba(26,26,46,0.95) 0%, rgba(22,22,42,0.95) 100%)',
              border: '1px solid rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.3)',
            }}
          >
            Skip this word
          </button>
        </div>
      )}

      {/* Scoring overlay */}
      {phase === 'scoring' && (
        <div className="absolute inset-0 bg-[#0d0d1f]/92 flex flex-col items-center justify-center z-40 gap-5">
          <div
            className="w-12 h-12 rounded-full"
            style={{
              background: 'linear-gradient(90deg, #ec4899, #f97316)',
              animation: 'roll-bounce 0.6s ease-in-out infinite',
              opacity: 0.6,
            }}
          />
          <div className="text-white/50 text-sm font-semibold tracking-wide">
            {scoringStatus}
          </div>
        </div>
      )}

      {phase === 'init' && (
        <MicModal onGrant={handleGrantMic} onDeny={() => setMicError('Mic denied.')} error={micError} />
      )}
      {phase === 'finished' && (
        <WinScreen results={results} onRestart={handleRestart} elapsedTime={elapsedTime} />
      )}
    </div>
  )
}

function blobToBase64(blob) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    reader.readAsDataURL(blob)
  })
}

async function scoreWithLLM(recordings, accumulated) {
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY

  if (!geminiKey) {
    return accumulated.map(r => ({
      word: r.word, emoji: r.emoji,
      score: r.correct ? 80 : 40,
      feedback: 'Add VITE_GEMINI_API_KEY to .env for LLM scoring.',
    }))
  }

  const audioParts = []
  const wordOrder = []

  for (const acc of accumulated) {
    const rec = recordings.find(r => r.word === acc.word)
    wordOrder.push({ word: acc.word, emoji: acc.emoji })
    if (rec?.blob?.size > 0) {
      const base64 = await blobToBase64(rec.blob)
      const mimeType = rec.blob.type || 'audio/webm'
      audioParts.push({
        inlineData: { mimeType, data: base64 },
      })
      audioParts.push({
        text: `[Audio above is the user saying "${acc.word}"]`,
      })
    } else {
      audioParts.push({
        text: `[No audio recorded for "${acc.word}"]`,
      })
    }
  }

  const prompt = `You are an American English pronunciation coach. I am sending you audio recordings of a non-native speaker pronouncing English words. For each word, listen carefully to the actual audio and rate pronunciation accuracy compared to a native American English speaker on a scale from 0 to 100:
- 95-100: Indistinguishable from a native speaker
- 80-94: Very good, minor accent but clearly understandable
- 60-79: Understandable but noticeable pronunciation issues
- 40-59: Difficult to understand, significant issues
- 0-39: Very hard to understand

The target words in order are: ${wordOrder.map(w => `"${w.word}"`).join(', ')}

Be honest and critical — do not just give 100 to everything. Listen for vowel quality, consonant clarity, stress patterns, and naturalness. Reply with JSON only — an array in the same order:
[{"word": "...", "score": <0-100>, "feedback": "<one specific actionable tip about their pronunciation>"}]`

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [...audioParts, { text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 4096,
          },
        }),
      }
    )
    const geminiData = await geminiRes.json()
    if (!geminiRes.ok) throw new Error(geminiData?.error?.message || `Gemini ${geminiRes.status}`)

    const parts = geminiData.candidates?.[0]?.content?.parts || []
    const textParts = parts.filter(p => p.text && !p.thought)
    const rawText = textParts.map(p => p.text).join('\n')

    const stripped = rawText
      .replace(/```json\s*/gi, '')
      .replace(/```/g, '')
      .trim()

    const parsed = JSON.parse(stripped)
    const results = Array.isArray(parsed) ? parsed : [parsed]

    return wordOrder.map((w, i) => {
      const r = results[i] || {}
      return {
        word: w.word,
        emoji: w.emoji || '?',
        score: Math.max(0, Math.min(100, r.score ?? 0)),
        feedback: r.feedback || '',
      }
    })
  } catch (err) {
    return accumulated.map(r => ({
      word: r.word, emoji: r.emoji || '?',
      score: r.correct ? 85 : 40,
      feedback: `Error: ${err.message}`,
    }))
  }
}
