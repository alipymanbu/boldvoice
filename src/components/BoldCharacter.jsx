export default function BoldCharacter({ state = 'idle', scale = 1 }) {
  const isMoving = state === 'moving'
  const isListening = state === 'listening'
  const size = 52 * scale

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {isListening && (
        <div
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: size * 1.8,
            height: size * 1.8,
            border: `2px solid rgba(236, 72, 153, 0.4)`,
            animation: 'pulse-ring 1.4s ease-out infinite',
          }}
        />
      )}

      <div
        className={`
          rounded-full flex items-center justify-center font-black text-white
          ${isMoving ? 'roll-bounce' : ''}
          ${isListening ? 'listening-glow' : ''}
        `}
        style={{
          width: size,
          height: size,
          background: 'linear-gradient(135deg, #f472b6 0%, #ec4899 40%, #db2777 100%)',
          boxShadow: `
            inset -${2 * scale}px -${3 * scale}px ${6 * scale}px rgba(0,0,0,0.3),
            inset ${2 * scale}px ${2 * scale}px ${4 * scale}px rgba(255,255,255,0.25),
            0 ${3 * scale}px ${10 * scale}px rgba(219, 39, 119, 0.5)
          `,
          fontSize: size * 0.48,
          letterSpacing: -1,
          textShadow: `0 ${1 * scale}px ${3 * scale}px rgba(0,0,0,0.4)`,
        }}
      >
        B
      </div>

      {isListening && (
        <div
          className="absolute text-sm"
          style={{
            top: -20 * scale,
            animation: 'mic-bounce 0.8s ease-in-out infinite',
          }}
        >
          🎤
        </div>
      )}
    </div>
  )
}
