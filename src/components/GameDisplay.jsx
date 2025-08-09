import { useState } from 'react';
import { CIPHER_HINTS } from '../utils/ciphers';
import CipherTools from './CipherTools';
import './CipherTools.css';

const GameDisplay = ({ 
  encryptedMessage, 
  onSubmit, 
  score, 
  streak,
  remainingTime,
  currentCipher 
}) => {
  const [guess, setGuess] = useState('');
  const [showHints, setShowHints] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(guess);
    setGuess('');
  };

  const hints = CIPHER_HINTS[currentCipher.name];

  return (
    <div className="game-display">
      <div className="stats">
        <div className="score">Score: {score}</div>
        <div className="streak">Streak: {streak}</div>
        <div className="timer">Time: {remainingTime}s</div>
      </div>

      <div className="encrypted-message">
        <h2>Decrypt this {hints.name}:</h2>
        <div className="message">{encryptedMessage}</div>
        
        {currentCipher.name === 'vigenere' && currentCipher.shiftHint && (
          <div className="math-hint">
            <p>Solve this equation to find the shift amount:</p>
            <div className="equation">{currentCipher.shiftHint.equation}</div>
          </div>
        )}
        
        <button 
          className="hint-toggle"
          onClick={() => setShowHints(!showHints)}
        >
          {showHints ? 'Hide Hints' : 'Show Hints'}
        </button>

        {showHints && (
          <div className="hints">
            <h3>Hints:</h3>
            <ul>
              {hints.hints.map((hint, index) => (
                <li key={index}>{hint}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="answer-form">
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Enter your solution..."
          className="answer-input"
        />
        <button type="submit" className="submit-btn">
          Submit Answer
        </button>
      </form>
      
      <CipherTools currentCipher={currentCipher} />
    </div>
  );
};

export default GameDisplay;
