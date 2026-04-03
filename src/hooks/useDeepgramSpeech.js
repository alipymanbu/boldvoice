import { useRef, useCallback } from 'react'

/**
 * Real-time speech recognition via Deepgram WebSocket API.
 * Same { start, stop } interface as useSpeech so they're interchangeable.
 * Works in all browsers (Safari, Firefox, Chrome, Edge).
 */
export function useDeepgramSpeech({ onResult, onError }) {
  const wsRef = useRef(null)
  const recorderRef = useRef(null)
  const streamRef = useRef(null)
  const activeRef = useRef(false)
  const targetWordRef = useRef('')

  const cleanup = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop()
    }
    recorderRef.current = null
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
  }, [])

  const start = useCallback((targetWord) => {
    const apiKey = import.meta.env.VITE_DEEPGRAM_API_KEY
    if (!apiKey) {
      onError('Deepgram API key not found. Add VITE_DEEPGRAM_API_KEY to .env')
      return
    }

    cleanup()

    targetWordRef.current = targetWord.toLowerCase()
    activeRef.current = true

    const ws = new WebSocket(
      'wss://api.deepgram.com/v1/listen?model=nova-2&language=en&punctuate=false&interim_results=true',
      ['token', apiKey]
    )
    wsRef.current = ws

    ws.onopen = async () => {
      try {
        if (!streamRef.current) {
          streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true })
        }

        const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : MediaRecorder.isTypeSupported('audio/webm')
            ? 'audio/webm'
            : 'audio/mp4'

        const recorder = new MediaRecorder(streamRef.current, { mimeType })
        recorderRef.current = recorder

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0 && ws.readyState === WebSocket.OPEN) {
            ws.send(e.data)
          }
        }

        recorder.start(250)
      } catch {
        onError('Could not access microphone for Deepgram.')
      }
    }

    ws.onmessage = (event) => {
      if (!activeRef.current) return
      try {
        const data = JSON.parse(event.data)
        const alt = data.channel?.alternatives?.[0]
        const transcript = alt?.transcript?.trim().toLowerCase()
        if (!transcript) return

        const target = targetWordRef.current
        const words = transcript.split(/\s+/)
        const isFinal = data.is_final

        if (words.includes(target) || transcript === target) {
          activeRef.current = false
          cleanup()
          onResult({ matched: true, transcript, targetWord })
          return
        }

        if (isFinal && transcript.length > 0) {
          activeRef.current = false
          cleanup()
          onResult({ matched: false, transcript, targetWord })
        }
      } catch {
        // ignore parse errors on incoming messages
      }
    }

    ws.onerror = () => {
      if (activeRef.current) {
        onError('Deepgram connection error. Check your API key and network.')
      }
    }

    ws.onclose = () => {
      if (activeRef.current) {
        setTimeout(() => {
          if (activeRef.current) start(targetWord)
        }, 300)
      }
    }
  }, [onResult, onError, cleanup])

  const stop = useCallback(() => {
    activeRef.current = false
    cleanup()
  }, [cleanup])

  return { start, stop }
}
