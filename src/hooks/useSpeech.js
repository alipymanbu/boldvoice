import { useRef, useCallback } from 'react'

/**
 * Manages Web Speech API recognition for real-time word detection.
 * Returns a start/stop interface.
 */
export function useSpeech({ onResult, onError }) {
  const recognitionRef = useRef(null)
  const activeRef = useRef(false)

  const start = useCallback((targetWord) => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      onError('Speech recognition not supported in this browser. Use Chrome or Edge.')
      return
    }

    // Stop any previous instance
    if (recognitionRef.current) {
      recognitionRef.current.abort()
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = true
    recognition.maxAlternatives = 5
    recognition.continuous = false

    recognitionRef.current = recognition
    activeRef.current = true

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        // Check all alternatives
        for (let j = 0; j < result.length; j++) {
          const transcript = result[j].transcript.trim().toLowerCase()
          const words = transcript.split(/\s+/)
          const target = targetWord.toLowerCase()
          if (words.includes(target) || transcript === target) {
            activeRef.current = false  // prevent onend from restarting
            recognition.abort()
            onResult({ matched: true, transcript, targetWord })
            return
          }
        }
        // Final result with no match
        if (result.isFinal) {
          const transcript = result[0].transcript.trim().toLowerCase()
          activeRef.current = false  // prevent onend from restarting; App will re-start after bounce
          recognition.abort()
          onResult({ matched: false, transcript, targetWord })
          return
        }
      }
    }

    recognition.onerror = (event) => {
      if (event.error === 'no-speech') {
        // Restart silently
        if (activeRef.current) start(targetWord)
        return
      }
      onError(`Speech error: ${event.error}`)
    }

    recognition.onend = () => {
      // Auto-restart if still in listening state
      if (activeRef.current) {
        setTimeout(() => {
          if (activeRef.current) start(targetWord)
        }, 100)
      }
    }

    recognition.start()
  }, [onResult, onError])

  const stop = useCallback(() => {
    activeRef.current = false
    if (recognitionRef.current) {
      recognitionRef.current.abort()
      recognitionRef.current = null
    }
  }, [])

  return { start, stop }
}
