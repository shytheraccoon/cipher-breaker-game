const ScoreModal = ({ 
  show, 
  score, 
  isCorrect, 
  onNextPuzzle 
}) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{isCorrect ? 'Correct!' : 'Incorrect!'}</h2>
        
        {isCorrect && (
          <div className="score-breakdown">
            <p>Base Points: {score.basePoints}</p>
            <p>Time Bonus: {score.timeBonus}</p>
            <p>Streak Bonus: {score.streakBonus}</p>
            <h3>Total: {score.total}</h3>
          </div>
        )}

        <button onClick={onNextPuzzle} className="next-btn">
          Next Puzzle
        </button>
      </div>
    </div>
  );
};

export default ScoreModal;
