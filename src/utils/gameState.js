import { atbashCipher, rot13Cipher, vigenereCipher, 
  morseCipher, DIFFICULTY } from './ciphers';
import { generateEquation } from './mathHints';

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

// Generate a random cipher with equal probability
export const generateCipher = () => {
  // All available ciphers with equal chance of selection
  const allCiphers = [
    atbashCipher,    // EASY difficulty - base score 100
    rot13Cipher,     // MEDIUM difficulty - base score 200
    vigenereCipher,  // HARD difficulty - base score 300
    morseCipher      // HARD difficulty - base score 300
  ];

  // Pick a random cipher
  const selectedCipher = getRandomItem(allCiphers);
  
  // Log selection
  console.log('Selected cipher:', selectedCipher.name, 'with difficulty:', selectedCipher.difficulty);

  return selectedCipher;
};

// Generate a new puzzle
export const generatePuzzle = (minDifficulty = DIFFICULTY.EASY) => {
  console.log('Generating puzzle with minimum difficulty:', minDifficulty);
  
  const phrase = getRandomItem(WORD_POOL);
  const cipher = generateCipher(minDifficulty);
  
  let key = null;
  let shiftHint = null;
  let encryptedPhrase = '';
  
  try {
    if (cipher.name === 'vigenere') {
      // Generate a random 3-letter key for Vigenère cipher
      const vigenereKeys = ['KEY', 'BOX', 'CAT', 'DOG', 'FOX', 'HAT', 'MAP', 'PEN', 'SUN', 'ZIP'];
      key = getRandomItem(vigenereKeys);
      console.log('Using Vigenère key:', key);
      
      // Generate the shift hint equation once and store it
      const shift = key.charAt(0).charCodeAt(0) - 65; // Use first letter's shift
      shiftHint = {
        type: 'math',
        equation: generateEquation(shift),
        answer: shift
      };
      encryptedPhrase = cipher.encrypt(phrase, key);
    } else {
      encryptedPhrase = cipher.encrypt(phrase);
    }

    console.log('Created puzzle:', {
      cipher: cipher.name,
      original: phrase,
      encrypted: encryptedPhrase,
      key: key
    });

    return {
      originalPhrase: phrase,
      encryptedPhrase,
      shiftHint,
      cipher,
      key,
      startTime: Date.now()
    };
  } catch (error) {
    console.error('Error generating puzzle:', error);
    // Fallback to atbash if there's an error
    return {
      originalPhrase: phrase,
      encryptedPhrase: atbashCipher.encrypt(phrase),
      cipher: atbashCipher,
      startTime: Date.now()
    };
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
