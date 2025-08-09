import { useState, useEffect } from 'react'
import './index.css'
import './App.css'
import GameDisplay from './components/GameDisplay'
import ScoreModal from './components/ScoreModal'
import { generatePuzzle, checkAnswer, calculateScore } from './utils/gameState'
import { DIFFICULTY } from './utils/ciphers'

function App() {
  const [currentPuzzle, setCurrentPuzzle] = useState(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [lastResult, setLastResult] = useState(null)
  const [remainingTime, setRemainingTime] = useState(120) // 2 minutes

  // Initialize first puzzle
  useEffect(() => {
    if (!currentPuzzle) {
      setCurrentPuzzle(generatePuzzle())
    }
  }, [])

  // Timer countdown
  useEffect(() => {
    if (!currentPuzzle || showModal) return

    const timer = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          handleAnswer('')  // Force incorrect answer when time runs out
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [currentPuzzle, showModal])

  const handleAnswer = (guess) => {
    const isCorrect = checkAnswer(currentPuzzle, guess)
    const resultScore = isCorrect ? calculateScore(currentPuzzle, streak) : null

    setLastResult({
      isCorrect,
      score: resultScore
    })

    if (isCorrect) {
      setScore(prev => prev + resultScore.total)
      setStreak(prev => prev + 1)
    } else {
      setStreak(0)
    }

    setShowModal(true)
  }

  const handleNextPuzzle = () => {
    // Increase difficulty based on streak
    const difficulty = streak >= 3 ? DIFFICULTY.HARD : 
                      streak >= 1 ? DIFFICULTY.MEDIUM : 
                      DIFFICULTY.EASY

    setCurrentPuzzle(generatePuzzle(difficulty))
    setShowModal(false)
    setRemainingTime(120)
  }

  if (!currentPuzzle) return <div>Loading...</div>

  return (
    <div className="app">
      <h1>Cipher Breaker</h1>
      
      <GameDisplay
        encryptedMessage={currentPuzzle.encryptedPhrase}
        onSubmit={handleAnswer}
        score={score}
        streak={streak}
        remainingTime={remainingTime}
        currentCipher={currentPuzzle.cipher}
      />

      <ScoreModal
        show={showModal}
        score={lastResult?.score}
        isCorrect={lastResult?.isCorrect}
        onNextPuzzle={handleNextPuzzle}
      />
    </div>
  )
}

export default App
