export default function Obstacle({ word, emoji, exploding }) {
  return (
    <div
      className={`flex flex-col items-center ${exploding ? 'obstacle-explode' : ''}`}
    >
      <div
        className="relative flex flex-col items-center justify-center"
        style={{
          width: 130,
          height: 140,
          background: 'linear-gradient(135deg, rgba(26,26,46,0.9) 0%, rgba(18,18,38,0.9) 100%)',
          borderRadius: 22,
          border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(8px)',
          boxShadow: `
            0 0 40px rgba(236, 72, 153, 0.08),
            0 8px 32px rgba(0,0,0,0.4),
            inset 0 1px 0 rgba(255,255,255,0.05)
          `,
          gap: 6,
        }}
      >
        <span style={{ fontSize: 48, lineHeight: 1, marginTop: 4 }}>
          {emoji}
        </span>

        <span
          className="font-bold uppercase tracking-widest text-white"
          style={{ fontSize: 14, opacity: 0.85 }}
        >
          {word}
        </span>

        <div
          className="absolute -bottom-3 left-1/2 rounded-full"
          style={{
            width: 60,
            height: 6,
            transform: 'translateX(-50%)',
            background: 'radial-gradient(ellipse, rgba(236, 72, 153, 0.2) 0%, transparent 70%)',
            filter: 'blur(2px)',
          }}
        />
      </div>
    </div>
  )
}
