export default function MicModal({ onGrant, onDeny, error }) {
  return (
    <div className="absolute inset-0 bg-black/85 flex items-center justify-center z-50 px-6">
      <div
        className="w-full max-w-sm rounded-2xl p-8 text-center"
        style={{
          background: 'linear-gradient(180deg, #1a1a3e 0%, #0f0f2a 100%)',
          border: '1px solid rgba(236, 72, 153, 0.3)',
          boxShadow: '0 0 40px rgba(236, 72, 153, 0.15)',
        }}
      >
        <div className="text-5xl mb-5">🎤</div>
        <h2 className="text-pink-300 text-xl font-bold mb-2 tracking-wide">
          Microphone Access
        </h2>
        <p className="text-white/50 text-sm mb-6 leading-relaxed">
          This game listens to your pronunciation. No audio is stored without your consent.
        </p>

        {error && (
          <div className="bg-red-900/40 border border-red-400/40 text-red-300 text-xs p-3 mb-4 rounded-lg">
            {error}
          </div>
        )}

        <button
          onClick={onGrant}
          className="w-full font-bold py-3 mb-3 rounded-xl text-white tracking-wide transition-all active:scale-95"
          style={{
            background: 'linear-gradient(90deg, #ec4899, #db2777)',
            boxShadow: '0 4px 20px rgba(236, 72, 153, 0.4)',
          }}
        >
          Allow Microphone
        </button>
        <button
          onClick={onDeny}
          className="w-full border border-white/10 text-white/40 py-2 text-sm rounded-xl transition-colors active:bg-white/5"
        >
          Deny (game won't work)
        </button>
      </div>
    </div>
  )
}
