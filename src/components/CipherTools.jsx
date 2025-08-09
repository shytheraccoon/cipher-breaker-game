import { useState, useRef } from 'react';
import { morseCodeMap } from '../utils/ciphers';

const MorseCodeTool = () => {
  const [currentSequence, setCurrentSequence] = useState('');
  const [recognizedLetter, setRecognizedLetter] = useState('');
  const [startTime, setStartTime] = useState(null);
  
  // Reverse the morse code map to lookup letters by code
  const reverseMorseMap = Object.entries(morseCodeMap).reduce((acc, [char, code]) => {
    acc[code] = char;
    return acc;
  }, {});

  // Add timeout ref to handle sequence reset
  const resetTimeoutRef = useRef(null);

  const resetSequence = () => {
    setCurrentSequence('');
    setRecognizedLetter('');
  };

  const handleButtonDown = () => {
    setStartTime(Date.now());
    // Clear any pending reset
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }
  };

  const handleButtonUp = () => {
    if (!startTime) return;
    
    const duration = Date.now() - startTime;
    const newSymbol = duration > 250 ? '-' : '.';  // More than 250ms is a dash
    const newSequence = currentSequence + newSymbol;
    setCurrentSequence(newSequence);
    
    // Check if the sequence matches any letter
    const matchedLetter = reverseMorseMap[newSequence];
    if (matchedLetter) {
      setRecognizedLetter(matchedLetter);
      // Set a timeout to reset the sequence after showing the letter
      resetTimeoutRef.current = setTimeout(resetSequence, 1000);
    } else if (newSequence.length >= 6) {  // Max morse code length
      resetSequence();  // Reset if too long
    }
    
    setStartTime(null);
  };

  return (
    <div className="cipher-tool morse-tool">
      <div className="morse-display">
        <div className="morse-letter">{recognizedLetter || ' '}</div>
        <div className="morse-sequence">{currentSequence}</div>
      </div>
      <button 
        className="morse-button"
        onMouseDown={handleButtonDown}
        onMouseUp={handleButtonUp}
        onMouseLeave={() => setStartTime(null)}
      >
        Send
      </button>
      <div className="morse-instructions">
        <p>Instructions:</p>
        <p>Fast click: dot (.)</p>
        <p>Hold click: dash (-)</p>
        <p>Letter appears when sequence matches</p>
      </div>
    </div>
  );
};



const VigenereTool = () => {
  const [shift, setShift] = useState(0);
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
  const shiftedAlphabet = [...alphabet.slice(shift), ...alphabet.slice(0, shift)];

  const handleLeftClick = () => {
    setShift((prev) => (prev + 1) % alphabet.length);
  };

  const handleRightClick = () => {
    setShift((prev) => (prev - 1 + alphabet.length) % alphabet.length);
  };

  return (
    <div className="cipher-tool vigenere-tool">
      <div className="vigenere-rows">
        <div className="vigenere-row">
          {alphabet.map(char => (
            <span key={`top-${char}`} className="vigenere-char">{char}</span>
          ))}
        </div>
        <div className="vigenere-row">
          {shiftedAlphabet.map((char, index) => (
            <span key={`bottom-${index}`} className="vigenere-char shifted">{char}</span>
          ))}
        </div>
        <div className="vigenere-controls">
          <button onClick={handleLeftClick}>←</button>
          <button onClick={handleRightClick}>→</button>
        </div>
      </div>
    </div>
  );
};

const AtbashTool = () => (
  <div className="cipher-tool atbash-tool">
    <div className="atbash-rows">
      <div className="atbash-row forward">
        {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(char => (
          <span key={char} className="atbash-char">{char}</span>
        ))}
      </div>
      <div className="atbash-row reverse">
        {'ZYXWVUTSRQPONMLKJIHGFEDCBA'.split('').map(char => (
          <span key={char} className="atbash-char">{char}</span>
        ))}
      </div>
    </div>
  </div>
);

const ROT13Tool = () => (
  <div className="cipher-tool rot13-tool">
    <img 
      src="/caesar.png" 
      alt="Julius Caesar" 
      className="caesar-image" 
    />
    <div className="rot13-info">
      <span className="rot13-number">13</span>
      <p>Shift each letter 13 positions</p>
    </div>
  </div>
);

const CipherTools = ({ currentCipher }) => {
  return (
    <div className="cipher-tools">
      <h3>Decryption Tools</h3>
      {currentCipher.name === 'morse' && <MorseCodeTool />}
      {currentCipher.name === 'vigenere' && <VigenereTool />}
      {currentCipher.name === 'atbash' && <AtbashTool />}
      {currentCipher.name === 'rot13' && <ROT13Tool />}
    </div>
  );
};

export default CipherTools;
