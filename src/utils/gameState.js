import { atbashCipher, rot13Cipher, vigenereCipher, 
  morseCipher, DIFFICULTY } from './ciphers';

// Pool of words and phrases for the game
const WORD_POOL = [
  'HELLO WORLD',
  'CIPHER BREAKER',
  'SECRET MESSAGE',
  'CRYPTOGRAPHY',
  'DECODE THIS',
  'PUZZLE SOLVER',
  'ENCRYPTION KEY',
  'TOP SECRET',
  'HIRE ME',
  'MISSION COMPLETE'
];

// Points configuration
const POINTS = {
  EASY: 100,
  MEDIUM: 200,
  HARD: 300,
  TIME_BONUS_MULTIPLIER: 10,
  STREAK_MULTIPLIER: 0.1
};

// Get a random item from an array
const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

// Generate a random cipher based on difficulty
export const generateCipher = (minDifficulty = DIFFICULTY.EASY) => {
  console.log('Generating cipher with difficulty:', minDifficulty);
  
  // Force equal distribution of ciphers
  const allCiphers = [
    atbashCipher,
    rot13Cipher,
    vigenereCipher,
    morseCipher
  ];

  // Simply pick a random cipher from all available ones
  const selectedCipher = getRandomItem(allCiphers);
  console.log('Selected cipher:', selectedCipher.name);

  return selectedCipher;
};

// Generate a new puzzle
export const generatePuzzle = (minDifficulty = DIFFICULTY.EASY) => {
  const phrase = getRandomItem(WORD_POOL);
  const cipher = generateCipher(minDifficulty);
  
  let key = null;
  if (cipher.name === 'vigenere') {
    // Generate a random 3-letter key for Vigenère cipher
    const vigenereKeys = ['KEY', 'BOX', 'CAT', 'DOG', 'FOX', 'HAT', 'MAP', 'PEN', 'SUN', 'ZIP'];
    key = getRandomItem(vigenereKeys);
    console.log('Using Vigenère cipher with key:', key);
  }

  return {
    originalPhrase: phrase,
    encryptedPhrase: cipher.encrypt(phrase, key),
    cipher,
    key,
    startTime: Date.now()
  };
};

// Calculate score for a solved puzzle
export const calculateScore = (puzzle, streak) => {
  const timeTaken = (Date.now() - puzzle.startTime) / 1000; // in seconds
  const basePoints = POINTS[puzzle.cipher.difficulty];
  const timeBonus = Math.max(0, Math.floor((60 - timeTaken) * POINTS.TIME_BONUS_MULTIPLIER));
  const streakBonus = Math.floor(basePoints * (streak * POINTS.STREAK_MULTIPLIER));

  return {
    basePoints,
    timeBonus,
    streakBonus,
    total: basePoints + timeBonus + streakBonus
  };
};

// Check if the answer is correct
export const checkAnswer = (puzzle, answer) => {
  const normalizedAnswer = answer.toUpperCase().trim();
  const normalizedOriginal = puzzle.originalPhrase.toUpperCase().trim();
  return normalizedAnswer === normalizedOriginal;
};
