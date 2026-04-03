import { useRef, useCallback } from 'react'

export function useSounds() {
  const ctxRef = useRef(null)

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume()
    }
    return ctxRef.current
  }, [])

  const playTone = useCallback((freq, duration, type = 'sine', volume = 0.15, startDelay = 0) => {
    const ctx = getCtx()
    const t = ctx.currentTime + startDelay
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, t)
    gain.gain.setValueAtTime(volume, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t)
    osc.stop(t + duration)
  }, [getCtx])

  const playNoise = useCallback((duration, volume = 0.08, startDelay = 0) => {
    const ctx = getCtx()
    const t = ctx.currentTime + startDelay
    const bufferSize = ctx.sampleRate * duration
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize)
    }
    const source = ctx.createBufferSource()
    source.buffer = buffer
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(volume, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration)
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 1200
    source.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    source.start(t)
  }, [getCtx])

  const success = useCallback(() => {
    playTone(523, 0.12, 'sine', 0.12, 0)
    playTone(659, 0.12, 'sine', 0.12, 0.08)
    playTone(784, 0.2, 'sine', 0.14, 0.16)
  }, [playTone])

  const fail = useCallback(() => {
    playTone(300, 0.15, 'square', 0.06, 0)
    playTone(220, 0.2, 'square', 0.05, 0.1)
  }, [playTone])

  const explode = useCallback(() => {
    playNoise(0.2, 0.1)
    playTone(200, 0.15, 'sine', 0.1, 0)
    playTone(120, 0.1, 'sine', 0.06, 0.05)
  }, [playNoise, playTone])

  const start = useCallback(() => {
    playTone(440, 0.1, 'sine', 0.08, 0)
    playTone(554, 0.1, 'sine', 0.08, 0.12)
    playTone(659, 0.15, 'sine', 0.1, 0.24)
  }, [playTone])

  const complete = useCallback(() => {
    const notes = [523, 659, 784, 1047]
    notes.forEach((freq, i) => {
      playTone(freq, 0.2, 'sine', 0.1, i * 0.1)
    })
    playTone(1047, 0.5, 'triangle', 0.06, 0.4)
  }, [playTone])

  const listen = useCallback(() => {
    playTone(880, 0.08, 'sine', 0.06, 0)
  }, [playTone])

  return { success, fail, explode, start, complete, listen }
}
