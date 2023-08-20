import { useState } from "react";

// Child component of the parent component Board
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

// Child component of the parent component Game
// Parent component of the child component Square
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(index) {
    // Check whether a player has met any win conditions
    // Also check whether the clicked square is already filled
    if (calculateWinner(squares) || squares[index]) {
      return;
    }

    // Create a copy of the current squares array
    const nextSquares = squares.slice();

    // Mark square with "X" or "O" depending on player's turn
    if (xIsNext) {
      nextSquares[index] = "X";
    } else {
      nextSquares[index] = "O";
    }

    // Add current board to history array and update player turn
    onPlay(nextSquares);
  }

  // Check win conditions
  const winner = calculateWinner(squares);
  let status;

  // Set game status text
  if (winner) {
    status = "Winner: " + winner;
  } else if (!squares.includes(null)) {
    status = "It's a draw!";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

// Parent component of the child component Board
export default function Game() {
  // Initialize state variables
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);

  // Current board is the final array in history array
  const currentSquares = history[history.length - 1];

  // Add nextSquares array to history array
  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{}</ol>
      </div>
    </div>
  );
}

// Check squares array for win conditions
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  // Check all possible winning combinations
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  // Returns null if game still in progress
  return null;
}
