export const WORD_BANK = [
  { word: 'apple',    emoji: '🍎' },
  { word: 'bridge',   emoji: '🌉' },
  { word: 'cloud',    emoji: '☁️' },
  { word: 'dragon',   emoji: '🐉' },
  { word: 'earth',    emoji: '🌍' },
  { word: 'forest',   emoji: '🌲' },
  { word: 'guitar',   emoji: '🎸' },
  { word: 'house',    emoji: '🏠' },
  { word: 'island',   emoji: '🏝️' },
  { word: 'jungle',   emoji: '🌿' },
  { word: 'kitchen',  emoji: '🍳' },
  { word: 'lemon',    emoji: '🍋' },
  { word: 'mountain', emoji: '⛰️' },
  { word: 'night',    emoji: '🌙' },
  { word: 'ocean',    emoji: '🌊' },
  { word: 'penguin',  emoji: '🐧' },
  { word: 'queen',    emoji: '👑' },
  { word: 'river',    emoji: '🏞️' },
  { word: 'sunset',   emoji: '🌅' },
  { word: 'thunder',  emoji: '⚡' },
  { word: 'umbrella', emoji: '☂️' },
  { word: 'violin',   emoji: '🎻' },
  { word: 'water',    emoji: '💧' },
  { word: 'yellow',   emoji: '💛' },
  { word: 'zebra',    emoji: '🦓' },
  { word: 'through',  emoji: '🚪' },
  { word: 'thought',  emoji: '💭' },
  { word: 'world',    emoji: '🌐' },
  { word: 'strength', emoji: '💪' },
  { word: 'breath',   emoji: '💨' },
]

export function getRandomWords(count = 10) {
  const shuffled = [...WORD_BANK].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
