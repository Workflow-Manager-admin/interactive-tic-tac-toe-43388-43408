import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * Color palette and theme info (from container spec):
 *  - Primary: #1976d2 (blue)
 *  - Secondary: #424242 (dark gray)
 *  - Accent: #ffca28 (yellow)
 *  - Theme: light, modern
 */

/**
 * Single square component for the tic-tac-toe board.
 * PUBLIC_INTERFACE
 */
function Square({ value, onClick, highlight }) {
  return (
    <button
      className={`ttt-square${highlight ? ' highlight' : ''}`}
      onClick={onClick}
      aria-label={value ? `square with ${value}` : 'empty square'}
      tabIndex={0}
    >
      {value}
    </button>
  );
}

/**
 * Board component: 3x3 grid of squares.
 * PUBLIC_INTERFACE
 */
function Board({ squares, onSquareClick, winningLine }) {
  const renderSquare = i => (
    <Square
      key={i}
      value={squares[i]}
      onClick={() => onSquareClick(i)}
      highlight={winningLine && winningLine.includes(i)}
    />
  );
  // Render board in rows
  return (
    <div className="ttt-board">
      {[0, 1, 2].map(row => (
        <div className="ttt-board-row" key={row}>
          {[0, 1, 2].map(col => renderSquare(row * 3 + col))}
        </div>
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  // Board state (9 squares, null/X/O)
  const [squares, setSquares] = useState(Array(9).fill(null));
  // true if 'X' turn, false if 'O'
  const [xIsNext, setXIsNext] = useState(true);
  // Winner info: {winner: 'X'|'O', line: [int]}
  const [winnerInfo, setWinnerInfo] = useState({ winner: null, line: null });
  // Track if game is a draw
  const [isDraw, setIsDraw] = useState(false);

  // Theme state (retain from template, but default to light)
  const [theme, setTheme] = useState('light');

  // Apply custom theme colors for board and game info
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Update winner and draw info when board or turn changes
  useEffect(() => {
    const w = calculateWinner(squares);
    if (w.winner) {
      setWinnerInfo(w);
      setIsDraw(false);
    } else if (squares.every(Boolean)) {
      setWinnerInfo({ winner: null, line: null });
      setIsDraw(true);
    } else {
      setWinnerInfo({ winner: null, line: null });
      setIsDraw(false);
    }
  }, [squares]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // PUBLIC_INTERFACE
  const handleSquareClick = i => {
    if (winnerInfo.winner || squares[i]) return; // Ignore if won or filled
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  };

  // PUBLIC_INTERFACE
  const handleReset = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setWinnerInfo({ winner: null, line: null });
    setIsDraw(false);
  };

  // PUBLIC_INTERFACE
  function renderStatus() {
    if (winnerInfo.winner) {
      return (
        <div className="ttt-status winner">
          Winner: <span>{winnerInfo.winner}</span>
        </div>
      );
    }
    if (isDraw) {
      return <div className="ttt-status draw">It's a Draw!</div>;
    }
    return (
      <div className="ttt-status turn">
        Turn: <span>{xIsNext ? 'X' : 'O'}</span>
      </div>
    );
  }

  return (
    <div className="App ttt-app-bg">
      <header className="App-header ttt-header">
        {/* Theme toggle button (optional) */}
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <div className="ttt-container">
          <h1 className="ttt-title" style={{color: 'var(--primary-color, #1976d2)'}}>Tic-Tac-Toe</h1>
          <div className="ttt-controls">{renderStatus()}</div>
          <Board squares={squares} onSquareClick={handleSquareClick} winningLine={winnerInfo.line} />
          <button className="ttt-reset-btn" onClick={handleReset}>
            Reset Game
          </button>
        </div>
      </header>
    </div>
  );
}

// PUBLIC_INTERFACE
/**
 * Determines if there's a winner on the board.
 * @param {string[]} squares - Array of 9 items ("X", "O" or null)
 * @returns {{winner: "X"|"O"|null, line: array|null}}
 */
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
  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line };
    }
  }
  return { winner: null, line: null };
}

export default App;
