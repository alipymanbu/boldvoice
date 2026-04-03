export default function Obstacle({ word, emoji, exploding, scale = 1 }) {
  const boxW = 76 * scale
  const boxH = 84 * scale
  const archW = boxW * 0.48
  const archH = boxH * 0.42

  return (
    <div
      className={`flex flex-col items-center ${exploding ? 'obstacle-explode' : ''}`}
      style={{ gap: 6 * scale }}
    >
      <span
        className="font-black tracking-widest uppercase text-white"
        style={{
          fontSize: 13 * scale,
          textShadow: '0 2px 10px rgba(0,0,0,0.9)',
        }}
      >
        {word}
      </span>

      <div
        className="relative flex items-start justify-center overflow-hidden"
        style={{
          width: boxW,
          height: boxH,
          background: 'linear-gradient(180deg, #dbb878 0%, #c4994c 50%, #a67c3a 100%)',
          borderRadius: 6 * scale,
          border: `${2.5 * scale}px solid #8B6914`,
          boxShadow: `
            inset 0 ${2 * scale}px ${4 * scale}px rgba(255,255,255,0.15),
            inset 0 -${2 * scale}px ${4 * scale}px rgba(0,0,0,0.2),
            0 ${4 * scale}px ${20 * scale}px rgba(0,0,0,0.5)
          `,
        }}
      >
        <span style={{ fontSize: boxW * 0.42, marginTop: boxH * 0.06, position: 'relative', zIndex: 2 }}>
          {emoji}
        </span>

        <div
          className="absolute bottom-0 left-1/2"
          style={{
            width: archW,
            height: archH,
            transform: 'translateX(-50%)',
            background: 'radial-gradient(ellipse at center bottom, #1a1a3e 60%, #0d0d24 100%)',
            borderRadius: `${archW / 2}px ${archW / 2}px 0 0`,
            boxShadow: `inset 0 ${2 * scale}px ${6 * scale}px rgba(0,0,0,0.5)`,
          }}
        />
      </div>
    </div>
  )
}
