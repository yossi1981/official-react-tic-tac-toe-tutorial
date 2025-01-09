import { useState } from 'react';

function Square({ value, onSquareClick, isWinningSquare }) {
  return (
    <button
      className={"square "  + (isWinningSquare ? "winnerSquare" :"")} onClick={onSquareClick}
    >
      {value}
    </button>
  )
}

function Board({ currentMove, squares, onPlay }) {
  const [winner, winningLine] = calculateWinner(squares);

  let status;
  const xIsNext = (currentMove % 2) === 1;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    if (currentMove === 9) {
      status = "Draw!";
    }
    else{
      status = "Next player: " + (xIsNext ? "X" : "O");
    }
  }

  function handleClick(i) {
    const [winner, winningLine] = calculateWinner(squares);
    if (squares[i] || winner) {
      return;
    }
    const nextSquares = squares.slice();
    if ((currentMove % 2) === 1) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    onPlay(nextSquares)
  }  
  
  const Grid = () => { 
    const grid = [];
    for (let x = 0; x < 3; x++) {
      const row = [];
      for(let y = 0; y < 3; y++) {
        const i = x*3 + y;
        row.push(
          <Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)} isWinningSquare={winningLine?.includes(i)}/>
        );
      }
      grid.push(<div key={x} className="board-row">{row}</div>)
    }
    return (
      <div>
        {grid}
      </div>
      );  
  }

  
  return (
    <>
      <div className="status">{status}</div>
      <Grid />
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);

  const currentSquares = history[currentMove];

  function toggleOrder() {
    setIsAscending(!isAscending);
  }

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  
  const moves = history.map((squares, move) => {
    let description;
    let index = null;
    if (move > 0) {
      const currentMove = history[move];
      const prevMove = history[move - 1];
      for (let i = 0; i < 9; i++) {
        if (currentMove[i] !== prevMove[i]) {
          index = i;
          break;
        }
      }
      description = `Go to move number ${move} (${index%3} , ${Math.floor(index/3)})`;
    }
    else {
      description = 'Go to game start'
    }
    
    const buttonLi = (
        <li key={move}>
        <button onClick={() => { jumpTo(move) }}>{description}</button>
        </li>
      )

    const textLi = (
        <li key={move}>
        {description}
        </li>
      )

    return (
       move == currentMove ? textLi : buttonLi
    )
  })

  if (!isAscending) moves.reverse();

  return (
    <div className="game">
      <div className="game-board">
        <Board currentMove={currentMove} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
        <button onClick={toggleOrder}>Toggle Order</button>
      </div>
    </div>
  )
}

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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return [null, null];
}