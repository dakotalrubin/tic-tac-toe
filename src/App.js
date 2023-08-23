import { useState } from "react";

// Child component of the parent component Board
function Square({ value, isWinningSquare, onSquareClick }) {
  // Add green highlighting to a winning square
  return (
    <button
      className={"square " + (isWinningSquare ? "winning-square" : null)}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

// Child component of the parent component Game
// Parent component of the child component Square
function Board({ xIsNext, squares, onPlay }) {
  // Generate a square with given id
  function renderSquare(id) {
    let isWinningSquare = checkWinningSquare(id);
    return (
      <Square
        key={id}
        value={squares[id]}
        isWinningSquare={isWinningSquare}
        onSquareClick={() => handleClick(id)}
      />
    );
  }

  // Generate a game board with given size
  function renderBoard(size) {
    let board = [];

    // Render squares into rows and push to game board
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

    // Track index of the clicked square in current squares array
    nextSquares[9] = index;

    // Add current board to history array and update player turn
    onPlay(nextSquares);
  }

  // Determine whether square with given id is a winning square
  function checkWinningSquare(id) {
    let isWinningSquare;

    if (winningSquares) {
      isWinningSquare = winningSquares.includes(id);
    } else {
      isWinningSquare = false;
    }

    return isWinningSquare;
  }

  // Check win conditions
  const winner = calculateWinner(squares);
  let status, winningSquares;

  // Set game status text
  if (winner) {
    status = "Winner: " + winner.player;
    winningSquares = winner.line;
  } else if (!squares.includes(null)) {
    status = "It's a draw!";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  // Create game board with given size 3x3
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

  // Location for each move in (row, column) format
  const locations = [
    [1, 1],
    [1, 2],
    [1, 3],
    [2, 1],
    [2, 2],
    [2, 3],
    [3, 1],
    [3, 2],
    [3, 3]
  ];

  // Current game board state is the current squares array in move history array
  const currentSquares = history[currentMove];

  // Add nextSquares array to nextHistory array at the current move index
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  // Current game board state reflects the move selected by the player
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // Sort move history by ascending or descending order
  function sortOrder() {
    setIsAscending(!isAscending);
  }

  // Create map of history array elements to React button elements
  const moves = history.map((squares, move) => {
    // Create variable for message text, track index of clicked square
    let description;
    let index = squares[9];

    // Set message or button text
    if (move > 0 && move === currentMove) {
      description =
        "You are viewing Move #" + move + " (" + locations[index] + ")";
      return <li key={move}>{description}</li>;
    } else if (move > 0) {
      description = "Go to Move #" + move + " (" + locations[index] + ")";
    } else {
      description = "Go to Game Start";
    }

    // Create button to return to previous move in move history list
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  // Create game board and move history list
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button className="move-history" onClick={sortOrder}>
          Sort by {isAscending ? "Descending" : "Ascending"} Order
        </button>
        <ol>{isAscending ? moves : moves.reverse()}</ol>
      </div>
    </div>
  );
}

// Check squares array for win conditions
function calculateWinner(squares) {
  // Location for each winning combination in index format
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

    // First position letter must match second and third position letters
    // Return object containing winning player and line of squares
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: [a, b, c] };
    }
  }

  // Return null if game still in progress
  return null;
}
