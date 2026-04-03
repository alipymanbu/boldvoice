export default function BoldCharacter({ state = 'idle', scale = 1 }) {
  const isMoving = state === 'moving'
  const isListening = state === 'listening'
  const size = 66 * scale

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {isListening && (
        <>
          <div
            className="absolute left-1/2 top-1/2 rounded-full"
            style={{
              width: size * 2,
              height: size * 2,
              border: '1.5px solid rgba(236, 72, 153, 0.2)',
              animation: 'pulse-ring 1.4s ease-out infinite',
            }}
          />
          <div
            className="absolute left-1/2 top-1/2 rounded-full"
            style={{
              width: size * 1.5,
              height: size * 1.5,
              border: '1px solid rgba(236, 72, 153, 0.1)',
              animation: 'pulse-ring 1.4s ease-out 0.3s infinite',
            }}
          />
        </>
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
          background: 'linear-gradient(135deg, #f472b6 0%, #ec4899 50%, #f97316 100%)',
          boxShadow: `
            0 0 ${20 * scale}px rgba(236, 72, 153, 0.35),
            0 ${4 * scale}px ${12 * scale}px rgba(0,0,0,0.3),
            inset 0 -${2 * scale}px ${4 * scale}px rgba(0,0,0,0.15),
            inset 0 ${2 * scale}px ${4 * scale}px rgba(255,255,255,0.15)
          `,
          fontSize: size * 0.44,
          letterSpacing: -1,
          textShadow: '0 1px 3px rgba(0,0,0,0.3)',
        }}
      >
        B
      </div>

      {isListening && (
        <div
          className="absolute"
          style={{
            top: -22 * scale,
            fontSize: 16 * scale,
            animation: 'mic-bounce 0.8s ease-in-out infinite',
          }}
        >
          🎤
        </div>
      )}
    </div>
  )
}
