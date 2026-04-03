// CSS pixel-art character — 48x64px grid drawn with box-shadow
// State: 'idle' | 'moving' | 'listening' | 'success'

const SKIN = '#f5c5a3'
const HAIR = '#3d2b1f'
const SHIRT = '#3b82f6'
const PANTS = '#1e3a5f'
const SHOE = '#2d2d2d'
const MOUTH = '#c0605a'
const EYE = '#1a1a2e'

// Each row is [x, y, color] in a 6x8 pixel grid (each pixel = 6px)
const PIXELS = [
  // Hair row 1
  [1,0,HAIR],[2,0,HAIR],[3,0,HAIR],[4,0,HAIR],
  // Hair/head row 2
  [0,1,HAIR],[1,1,SKIN],[2,1,SKIN],[3,1,SKIN],[4,1,SKIN],[5,1,HAIR],
  // Head row 3
  [0,2,SKIN],[1,2,SKIN],[2,2,SKIN],[3,2,SKIN],[4,2,SKIN],[5,2,SKIN],
  // Eyes + mouth row 4
  [0,3,SKIN],[1,3,EYE],[2,3,SKIN],[3,3,SKIN],[4,3,EYE],[5,3,SKIN],
  // Mouth row 5
  [0,4,SKIN],[1,4,SKIN],[2,4,MOUTH],[3,4,MOUTH],[4,4,SKIN],[5,4,SKIN],
  // Shirt row 6
  [0,5,SHIRT],[1,5,SHIRT],[2,5,SHIRT],[3,5,SHIRT],[4,5,SHIRT],[5,5,SHIRT],
  // Shirt row 7
  [0,6,SHIRT],[1,6,SHIRT],[2,6,SHIRT],[3,6,SHIRT],[4,6,SHIRT],[5,6,SHIRT],
  // Pants row 8
  [0,7,PANTS],[1,7,PANTS],[2,7,PANTS],[3,7,PANTS],[4,7,PANTS],[5,7,PANTS],
  // Pants row 9
  [0,8,PANTS],[1,8,PANTS],[2,8,PANTS],[3,8,PANTS],[4,8,PANTS],[5,8,PANTS],
  // Shoes row 10
  [0,9,SHOE],[1,9,SHOE],[2,9,PANTS],[3,9,PANTS],[4,9,SHOE],[5,9,SHOE],
]

const PX = 6 // pixel size in real px

export default function PixelCharacter({ state = 'idle' }) {
  const width = 6 * PX
  const height = 10 * PX

  const isListening = state === 'listening'
  const isMoving = state === 'moving'

  return (
    <div
      className={`relative ${isListening ? 'listening-pulse' : ''} ${isMoving ? 'float-anim' : ''}`}
      style={{ width, height }}
    >
      <svg
        width={width}
        height={height}
        style={{ imageRendering: 'pixelated' }}
      >
        {PIXELS.map(([x, y, color], i) => (
          <rect
            key={i}
            x={x * PX}
            y={y * PX}
            width={PX}
            height={PX}
            fill={color}
          />
        ))}
      </svg>
      {isListening && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-300 text-xs font-bold whitespace-nowrap animate-bounce">
          🎤
        </div>
      )}
    </div>
  )
}
