// Cipher difficulty levels
export const DIFFICULTY = {
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD'
};

// Hints for each cipher type
export const CIPHER_HINTS = {
  atbash: {
    name: 'Atbash Cipher',
    hints: [
      'Letters are reversed in the alphabet',
      'A becomes Z, B becomes Y, C becomes X',
      'Use the alphabet reversal tool to decode'
    ]
  },
  rot13: {
    name: 'ROT13 Cipher',
    hints: [
      'Shift each letter 13 positions in the alphabet',
      'A becomes N, B becomes O, and so on',
      'Named after Julius Caesar\'s encryption method'
    ]
  },
  vigenere: {
    name: 'Vigenère Cipher',
    hints: [
      'Like multiple Caesar ciphers with different shifts',
      'The shift changes for each letter based on a keyword',
      'Try to guess the length of the keyword by looking for repeated patterns'
    ]
  },
  morse: {
    name: 'Morse Code',
    hints: [
      'Made up of dots (.) and dashes (-)',
      'Letters are separated by spaces',
      'Words are separated by forward slashes (/)',
      'E is . and T is - (most common letters)'
    ]
  }
};

// Helper function for ROT13
const shiftText = (text, shift) => {
  return text
    .toUpperCase()
    .split('')
    .map(char => {
      if (char.match(/[A-Z]/)) {
        const code = ((char.charCodeAt(0) - 65 + shift) % 26) + 65;
        return String.fromCharCode(code);
      }
      return char;
    })
    .join('');
};

// Atbash Cipher
export const atbashCipher = {
  name: 'atbash',
  encrypt: (text) => {
    return text
      .toUpperCase()
      .split('')
      .map(char => {
        if (char.match(/[A-Z]/)) {
          return String.fromCharCode(90 - (char.charCodeAt(0) - 65));
        }
        return char;
      })
      .join('');
  },
  decrypt: (text) => atbashCipher.encrypt(text), // Atbash is its own inverse
  difficulty: DIFFICULTY.EASY
};

// ROT13 Cipher
export const rot13Cipher = {
  name: 'rot13',
  encrypt: (text) => shiftText(text, 13),
  decrypt: (text) => shiftText(text, 13), // ROT13 is its own inverse
  difficulty: DIFFICULTY.MEDIUM
};

// Vigenère Cipher
export const vigenereCipher = {
  name: 'vigenere',
  currentShift: 0,
  encrypt: (text, key = 'KEY') => {
    // Each letter in the key determines the shift for corresponding positions in the text
    const textUpper = text.toUpperCase();
    const keyUpper = key.toUpperCase();
    const keyRepeated = keyUpper.repeat(Math.ceil(textUpper.length / keyUpper.length));
    
    return textUpper
      .split('')
      .map((char, i) => {
        if (char.match(/[A-Z]/)) {
          // Calculate shift based on the key letter's position in the alphabet (A=0, B=1, etc.)
          const shift = keyRepeated[i].charCodeAt(0) - 65;
          vigenereCipher.currentShift = shift; // Store for hint generation
          // Shift the current character by the calculated amount
          const code = ((char.charCodeAt(0) - 65 + shift) % 26) + 65;
          return String.fromCharCode(code);
        }
        return char;
      })
      .join('');
  },
  decrypt: (text, key = 'KEY') => {
    const textUpper = text.toUpperCase();
    const keyUpper = key.toUpperCase();
    const keyRepeated = keyUpper.repeat(Math.ceil(textUpper.length / keyUpper.length));
    
    return textUpper
      .split('')
      .map((char, i) => {
        if (char.match(/[A-Z]/)) {
          const shift = keyRepeated[i].charCodeAt(0) - 65;
          const code = ((char.charCodeAt(0) - 65 - shift + 26) % 26) + 65;
          return String.fromCharCode(code);
        }
        return char;
      })
      .join('');
  },
  difficulty: DIFFICULTY.HARD
};

// Morse Code
export const morseCodeMap = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
  '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.', ' ': '/'
};

const reverseMorseCodeMap = Object.fromEntries(
  Object.entries(morseCodeMap).map(([key, value]) => [value, key])
);

export const morseCipher = {
  name: 'morse',
  encrypt: (text) => {
    return text
      .toUpperCase()
      .split('')
      .map(char => morseCodeMap[char] || char)
      .join(' ');
  },
  decrypt: (text) => {
    return text
      .split(' ')
      .map(code => reverseMorseCodeMap[code] || code)
      .join('');
  },
  difficulty: DIFFICULTY.HARD
};


