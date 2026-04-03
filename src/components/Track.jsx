export default function Track({ moving }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0"
        style={{ background: '#0d0d1f' }}
      />

      <div
        className="absolute bottom-0 left-1/2"
        style={{
          width: '100%',
          height: '82%',
          transform: 'translateX(-50%)',
          clipPath: 'polygon(34% 0%, 66% 0%, 100% 100%, 0% 100%)',
          background: 'linear-gradient(180deg, #111128 0%, #14142e 40%, #181838 100%)',
        }}
      >
        <div
          className="absolute left-1/2 top-0 bottom-0"
          style={{
            width: 1,
            transform: 'translateX(-50%)',
            opacity: 0.1,
            background: 'repeating-linear-gradient(to bottom, white 0px, white 8px, transparent 8px, transparent 28px)',
            backgroundSize: '1px 28px',
            animation: moving ? 'lane-scroll 0.45s linear infinite' : undefined,
          }}
        />
      </div>

      <div
        className="absolute bottom-0"
        style={{
          height: '82%',
          width: 2,
          left: 'calc(17%)',
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          background: 'linear-gradient(180deg, transparent 0%, rgba(236, 72, 153, 0.08) 30%, rgba(236, 72, 153, 0.25) 100%)',
        }}
      />

      <div
        className="absolute bottom-0"
        style={{
          height: '82%',
          width: 2,
          right: 'calc(17%)',
          background: 'linear-gradient(180deg, transparent 0%, rgba(236, 72, 153, 0.08) 30%, rgba(236, 72, 153, 0.25) 100%)',
        }}
      />

      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '25%',
          background: 'linear-gradient(180deg, transparent 0%, rgba(13,13,31,0.5) 100%)',
        }}
      />
    </div>
  )
}
