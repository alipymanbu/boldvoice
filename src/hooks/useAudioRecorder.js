import { useRef, useCallback } from 'react'

/**
 * Records audio per word using MediaRecorder.
 * Provides start/stop per word, and getRecordings() to retrieve all blobs.
 */
export function useAudioRecorder() {
  const streamRef = useRef(null)
  const recorderRef = useRef(null)
  const chunksRef = useRef([])
  const recordingsRef = useRef([]) // array of { word, blob }

  const initStream = useCallback(async () => {
    if (!streamRef.current) {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true })
    }
  }, [])

  const startRecording = useCallback(async (word) => {
    await initStream()
    chunksRef.current = []
    const recorder = new MediaRecorder(streamRef.current)
    recorderRef.current = recorder
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data)
    }
    recorder.start()
  }, [initStream])

  const stopRecording = useCallback((word) => {
    return new Promise((resolve) => {
      const recorder = recorderRef.current
      if (!recorder || recorder.state === 'inactive') {
        resolve(null)
        return
      }
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        recordingsRef.current.push({ word, blob })
        resolve(blob)
      }
      recorder.stop()
    })
  }, [])

  const getRecordings = useCallback(() => recordingsRef.current, [])

  const reset = useCallback(() => {
    recordingsRef.current = []
    chunksRef.current = []
  }, [])

  const releaseStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
  }, [])

  return { startRecording, stopRecording, getRecordings, reset, releaseStream, initStream }
}
