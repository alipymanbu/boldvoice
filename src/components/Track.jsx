export default function Track({ moving }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #080820 0%, #0f0f3a 35%, #161650 100%)',
        }}
      />

      <div
        className="absolute bottom-0 left-1/2"
        style={{
          width: '100%',
          height: '78%',
          transform: 'translateX(-50%)',
          clipPath: 'polygon(36% 0%, 64% 0%, 100% 100%, 0% 100%)',
          background: 'linear-gradient(180deg, #1a2a4a, #1e3455, #223d60)',
        }}
      >
        <div
          className="absolute left-1/2 top-0 bottom-0"
          style={{
            width: 2,
            transform: 'translateX(-50%)',
            opacity: 0.2,
            background: 'repeating-linear-gradient(to bottom, white 0px, white 14px, transparent 14px, transparent 32px)',
            backgroundSize: '2px 32px',
            animation: moving ? 'lane-scroll 0.4s linear infinite' : undefined,
          }}
        />
      </div>

      <div
        className="absolute bottom-0"
        style={{
          height: '78%',
          left: '0%',
          width: '8%',
          clipPath: 'polygon(62% 0%, 100% 0%, 100% 100%, 0% 100%)',
          background: 'repeating-linear-gradient(to bottom, #dc2626 0px, #dc2626 18px, white 18px, white 36px)',
          backgroundSize: '100% 36px',
          animation: moving ? 'lane-scroll 0.4s linear infinite' : undefined,
          opacity: 0.85,
        }}
      />

      <div
        className="absolute bottom-0"
        style={{
          height: '78%',
          right: '0%',
          width: '8%',
          clipPath: 'polygon(0% 0%, 38% 0%, 100% 100%, 0% 100%)',
          background: 'repeating-linear-gradient(to bottom, #dc2626 0px, #dc2626 18px, white 18px, white 36px)',
          backgroundSize: '100% 36px',
          animation: moving ? 'lane-scroll 0.4s linear infinite' : undefined,
          opacity: 0.85,
        }}
      />

      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '78%',
          background: 'linear-gradient(180deg, transparent 0%, transparent 70%, rgba(0,0,0,0.3) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
