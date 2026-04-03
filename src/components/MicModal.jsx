export default function MicModal({ onGrant, onDeny, error }) {
  return (
    <div className="absolute inset-0 bg-[#0d0d1f]/95 flex items-center justify-center z-50 px-6">
      <div
        className="w-full max-w-sm rounded-2xl p-8 text-center"
        style={{
          background: 'linear-gradient(180deg, #1a1a2e 0%, #13132a 100%)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="text-5xl mb-5">🎤</div>
        <h2 className="text-white text-xl font-bold mb-2">
          Microphone Access
        </h2>
        <p className="text-white/40 text-sm mb-6 leading-relaxed">
          This game listens to your pronunciation. No audio is stored without your consent.
        </p>

        {error && (
          <div className="bg-red-900/30 border border-red-500/20 text-red-300 text-xs p-3 mb-4 rounded-xl">
            {error}
          </div>
        )}

        <button
          onClick={onGrant}
          className="w-full font-bold py-3.5 mb-3 rounded-2xl text-white tracking-wide transition-all active:scale-[0.97]"
          style={{
            background: 'linear-gradient(90deg, #ec4899, #f97316)',
            boxShadow: '0 4px 24px rgba(236, 72, 153, 0.3)',
          }}
        >
          Allow Microphone
        </button>
        <button
          onClick={onDeny}
          className="w-full py-2.5 text-sm rounded-2xl text-white/30 transition-colors active:bg-white/5"
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16162a 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          Deny (game won't work)
        </button>
      </div>
    </div>
  )
}
