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
  // Generate a square with given id
  function renderSquare(id) {
    return (
      <Square
        key={id}
        value={squares[id]}
        onSquareClick={() => handleClick(id)}
      />
    );
  }

  // Generate a game board with given size using a nested for loop
  function renderBoard(size) {
    let board = [];

    for (let i = 0; i < size; i++) {
      let row = [];

      for (let j = 0; j < size; j++) {
        row.push(renderSquare(i * 3 + j));
      }

      board.push(
        <div key={i} className="board-row">
          {row}
        </div>
      );
    }

    return board;
  }

  // Update game board when a player clicks a square
  function handleClick(index) {
    // Check whether a player has met win conditions
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
      <div>{renderBoard(3)}</div>
    </>
  );
}

// Parent component of the child component Board
export default function Game() {
  // Initialize state variables
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);

  // The "X" player moves on even-numbered turns
  const xIsNext = currentMove % 2 === 0;

  // Current board state is the current move array in history array
  const currentSquares = history[currentMove];

  // Add nextSquares array to history array at the current move index
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  // Current board state is the move selected by the player
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // Sort move order by ascending or descending order
  function sortOrder() {
    setIsAscending(!isAscending);
  }

  // Create map of history array elements to React button elements
  const moves = history.map((squares, move) => {
    let description;

    // Set message text
    if (move > 0 && move === currentMove) {
      return <li key={move}>You are viewing Move #{move}</li>;
    } else if (move > 0) {
      description = "Go to Move #" + move;
    } else {
      description = "Go to Game Start";
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button className="move-order" onClick={sortOrder}>
          Sort by {isAscending ? "Descending" : "Ascending"} Order
        </button>
        <ol>{isAscending ? moves : moves.reverse()}</ol>
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

    // If first position letter matches second and third position letters
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  // Return null if the game is still in progress
  return null;
}
