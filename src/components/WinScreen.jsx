export default function WinScreen({ results, onRestart, elapsedTime = 0 }) {
  const total = results.length
  const avgScore = total > 0
    ? Math.round(results.reduce((sum, r) => sum + (r.score ?? 0), 0) / total)
    : 0

  const mins = Math.floor(elapsedTime / 60)
  const secs = elapsedTime % 60
  const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`

  return (
    <div className="absolute inset-0 bg-[#0d0d1f] z-50 overflow-y-auto">
      <div className="w-full max-w-[430px] mx-auto px-5 py-8">
        <div className="flex justify-center mb-5">
          <div className="relative">
            <img
              src="/character.jpeg"
              alt="You!"
              className="w-20 h-20 rounded-full object-cover"
              style={{
                border: '3px solid transparent',
                backgroundClip: 'padding-box',
                boxShadow: '0 0 0 3px #ec4899, 0 0 20px rgba(236, 72, 153, 0.3)',
              }}
            />
          </div>
        </div>

        <h2 className="text-white text-xl font-bold text-center mb-3">
          Game Complete!
        </h2>

        <div className="flex items-center justify-center gap-6 mb-6">
          <div className="flex flex-col items-center">
            <span className={`text-2xl font-bold ${scoreColor(avgScore)}`}>{avgScore}%</span>
            <span className="text-white/30 text-xs mt-0.5">Accuracy</span>
          </div>
          <div
            className="w-px h-8"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          />
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-white/80">
              {timeStr}
            </span>
            <span className="text-white/30 text-xs mt-0.5">Time</span>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {results.map((r, i) => {
            const s = r.score ?? 0
            return (
              <div
                key={i}
                className="rounded-2xl px-4 py-3"
                style={{
                  background: 'linear-gradient(135deg, #1a1a2e 0%, #16162a 100%)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{r.emoji}</span>
                    <span className="text-white font-semibold text-sm uppercase tracking-wide">
                      {r.word}
                    </span>
                  </div>
                  <span className={`font-bold text-base ${scoreColor(s)}`}>{s}%</span>
                </div>

                <div className="w-full h-1.5 rounded-full bg-white/5 mb-2">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${s}%`,
                      background: s >= 80
                        ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                        : s >= 50
                          ? 'linear-gradient(90deg, #eab308, #facc15)'
                          : 'linear-gradient(90deg, #ef4444, #f87171)',
                    }}
                  />
                </div>

                {r.feedback && (
                  <p className="text-white/35 text-xs leading-relaxed">{r.feedback}</p>
                )}
              </div>
            )
          })}
        </div>

        <div className="space-y-3">
          <button
            onClick={onRestart}
            className="w-full font-bold py-3.5 rounded-2xl text-white tracking-wide transition-all active:scale-[0.97]"
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #1e1e38 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            Play Again
          </button>

          <button
            onClick={() => {
              const url = window.location.href
              const text = `I scored ${avgScore}% in ${timeStr} on BoldVoice! Can you beat me? 🎤⏱️`
              if (navigator.share) {
                navigator.share({ title: 'BoldVoice Challenge', text, url })
              } else {
                navigator.clipboard.writeText(`${text}\n${url}`)
                alert('Link copied! Share it with your friend.')
              }
            }}
            className="w-full font-bold py-3.5 rounded-2xl text-white tracking-wide transition-all active:scale-[0.97]"
            style={{
              background: 'linear-gradient(90deg, #ec4899, #f97316)',
              boxShadow: '0 4px 24px rgba(236, 72, 153, 0.3)',
            }}
          >
            Challenge a Friend 🔥
          </button>
        </div>
      </div>
    </div>
  )
}

function scoreColor(score) {
  if (score >= 80) return 'text-green-400'
  if (score >= 50) return 'text-yellow-400'
  return 'text-red-400'
}
