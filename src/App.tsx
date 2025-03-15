import React, { useState, useEffect } from 'react';
import './App.css';

type Player = 'X' | 'O';
type Board = Player | null;

const PLAYER_HUMAN: Player = 'X';
const PLAYER_AI: Player = 'O';
const EMPTY_CELL: Board = null;

const App: React.FC = () => {
  const [board, setBoard] = useState<Board[]>(Array(9).fill(EMPTY_CELL));
  const [currentPlayer, setCurrentPlayer] = useState<Player>(PLAYER_HUMAN);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [winner, setWinner] = useState<Player | null>(null);

  useEffect(() => {
    if (currentPlayer === PLAYER_AI && !gameOver) {
      const bestMove = minimax(board, PLAYER_AI).index;
      if (bestMove !== undefined) {
        makeMove(bestMove);
      }
    }
  }, [board, currentPlayer, gameOver]);

  const handleCellClick = (index: number): void => {
    if (board[index] === EMPTY_CELL && currentPlayer === PLAYER_HUMAN && !gameOver) {
      makeMove(index);
    }
  };

  const makeMove = (index: number): void => {
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    const result = checkWinner(newBoard);
    if (result) {
      setGameOver(true);
      setWinner(result === 'tie' ? null : result);
    } else {
      setCurrentPlayer(currentPlayer === PLAYER_HUMAN ? PLAYER_AI : PLAYER_HUMAN);
    }
  };

  const checkWinner = (currentBoard: Board[]): Player | 'tie' | null => {
    const winningLines: number[][] = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const line of winningLines) {
      const [a, b, c] = line;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return currentBoard[a];
      }
    }

    if (!currentBoard.includes(EMPTY_CELL)) {
      return 'tie';
    }

    return null;
  };

  interface MinimaxResult {
    score: number;
    index?: number;
  }

  const minimax = (currentBoard: Board[], player: Player): MinimaxResult => {
    const winnerResult = checkWinner(currentBoard);
    if (winnerResult === PLAYER_AI) {
      return { score: 10 };
    }
    if (winnerResult === PLAYER_HUMAN) {
      return { score: -10 };
    }
    if (winnerResult === 'tie') {
      return { score: 0 };
    }

    const moves: MinimaxResult[] = [];
    for (let i = 0; i < currentBoard.length; i++) {
      if (currentBoard[i] === EMPTY_CELL) {
        const move: MinimaxResult = {
          index: i,
          score: 0
        };
        const newBoard = [...currentBoard];
        newBoard[i] = player;
        const result = minimax(newBoard, player === PLAYER_AI ? PLAYER_HUMAN : PLAYER_AI);
        move.score = result.score;
        moves.push(move);
      }
    }

    let bestMove: MinimaxResult | undefined;
    if (player === PLAYER_AI) {
      let bestScore = -Infinity;
      for (const move of moves) {
        if (move.score > bestScore) {
          bestScore = move.score;
          bestMove = move;
        }
      }
    } else {
      let bestScore = Infinity;
      for (const move of moves) {
        if (move.score < bestScore) {
          bestScore = move.score;
          bestMove = move;
        }
      }
    }

    return bestMove!;
  };

  const renderCell = (index: number): JSX.Element => {
    return (
      <div className="cell" onClick={() => handleCellClick(index)}>
        {board[index]}
      </div>
    );
  };

  const resetGame = () => {
    setBoard(Array(9).fill(EMPTY_CELL));
    setCurrentPlayer(PLAYER_HUMAN);
    setGameOver(false);
    setWinner(null);
  };

  return (
    <div className="App">
      <h1>Tic Tac Toe with Minimax AI</h1>
      <div className="board shadow-2xl">
        {board.map((cell, index) => renderCell(index))}
      </div>
      {gameOver && (
        <div className="game-over">
          {winner ? <p>Player {winner} wins!</p> : <p>It's a tie!</p>}
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}
    </div>
  );
};

export default App;