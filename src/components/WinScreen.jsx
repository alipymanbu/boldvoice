export default function WinScreen({ results, onRestart }) {
  const total = results.length
  const avgScore = total > 0
    ? Math.round(results.reduce((sum, r) => sum + (r.score ?? 0), 0) / total)
    : 0

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 overflow-y-auto py-8">
      <div
        className="bg-gray-900 border-4 border-yellow-400 p-8 max-w-lg w-full mx-4"
        style={{ boxShadow: '8px 8px 0px #854d0e' }}
      >
        <div className="flex justify-center mb-4">
          <img
            src="/character.jpeg"
            alt="You!"
            className="w-24 h-24 rounded-full border-4 border-yellow-400 object-cover pixel"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>

        <h2 className="text-yellow-300 text-2xl font-bold text-center mb-1 tracking-wider">
          GAME COMPLETE!
        </h2>
        <p className="text-gray-300 text-center text-sm mb-6">
          Average Score: <span className={`font-bold ${scoreColor(avgScore)}`}>{avgScore}%</span>
        </p>

        <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
          {results.map((r, i) => {
            const s = r.score ?? 0
            return (
              <div
                key={i}
                className={`flex items-center justify-between px-4 py-2 border ${scoreBorder(s)}`}
              >
                <span className="font-bold uppercase tracking-wider text-sm">
                  {r.emoji} {r.word}
                </span>
                <div className="text-right text-xs">
                  <span className={`font-bold text-sm ${scoreColor(s)}`}>{s}%</span>
                  {r.feedback && (
                    <div className="text-gray-400 mt-1 max-w-[180px]">{r.feedback}</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <button
          onClick={onRestart}
          className="w-full bg-yellow-400 text-black font-bold py-3 hover:bg-yellow-300 transition-colors tracking-wider"
          style={{ boxShadow: '4px 4px 0px #78350f' }}
        >
          PLAY AGAIN
        </button>
      </div>
    </div>
  )
}

function scoreColor(score) {
  if (score >= 80) return 'text-green-400'
  if (score >= 50) return 'text-yellow-300'
  return 'text-red-400'
}

function scoreBorder(score) {
  if (score >= 80) return 'border-green-500 bg-green-900/30 text-green-300'
  if (score >= 50) return 'border-yellow-500 bg-yellow-900/30 text-yellow-200'
  return 'border-red-500 bg-red-900/30 text-red-300'
}
