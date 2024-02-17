// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
/* 1. 💯 preserve state in localStorage & 2. 💯 use coustom hook; useLocalStorageState */
import {useLocalStorageState} from '../utils'

function Board({squares, onClick}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const initialSquares = Array(9).fill(null)

  /* 3. 💯 add game history feature */
  const [currentStep, setCurrentStep] = useLocalStorageState(
    'tic-tac-toe:currentStep',
    0,
  )
  const [history, setHistory] = useLocalStorageState('tic-tac-toe:history', [
    initialSquares,
  ])
  const currentSquare = history[currentStep]
  const moves = history.map((stepSquares, step) => {
    const desc = step === 0 ? 'Go to game start!' : `Go to move #${step}`
    const isCurrentStep = step === currentStep

    return (
      <li key={step}>
        <button disabled={isCurrentStep} onClick={() => setCurrentStep(step)}>
          {desc} {isCurrentStep ? '(current)' : null}
        </button>
      </li>
    )
  })

  const nextValue = calculateNextValue(currentSquare)
  const winner = calculateWinner(currentSquare)
  const status = calculateStatus(winner, currentSquare, nextValue)

  function selectSquare(square) {
    if (currentSquare[square] || winner) {
      return
    }
    const squaresCopy = [...currentSquare]
    const newHistory = history.slice(0, currentStep + 1)
    squaresCopy[square] = nextValue
    setHistory([...newHistory, squaresCopy])
    setCurrentStep(newHistory.length)
  }

  function restart() {
    setHistory([initialSquares])
    setCurrentStep(0)
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={currentSquare} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
