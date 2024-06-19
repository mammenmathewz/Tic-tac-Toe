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

  useEffect(() => {
    if (currentPlayer === PLAYER_AI && !gameOver) {
      // AI's turn
      const bestMove = minimax(board, PLAYER_AI).index;
      makeMove(bestMove);
    }
  }, [board, currentPlayer, gameOver]);

  const handleCellClick = (index: number): void => {
    if (board[index] === EMPTY_CELL && currentPlayer === PLAYER_HUMAN && !gameOver) {
      makeMove(index);
    }
  };

  const makeMove = (index: number): void => {
    let newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === PLAYER_HUMAN ? PLAYER_AI : PLAYER_HUMAN);
    checkWinner(newBoard);
  };

  const checkWinner = (currentBoard: Board[]): void => {
    const winningLines: number[][] = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    for (let line of winningLines) {
      const [a, b, c] = line;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        setGameOver(true);
        return;
      }
    }

    if (!currentBoard.includes(EMPTY_CELL)) {
      setGameOver(true); // Tie
    }
  };

  interface MinimaxResult {
    score: number;
    index?: number;
  }

  const minimax = (currentBoard: Board[], player: Player): MinimaxResult => {
    // Base cases: terminal states
    if (checkWinner(currentBoard)) {
      return player === PLAYER_AI ? { score: 10 } : { score: -10 };
    }
    if (!currentBoard.includes(EMPTY_CELL)) {
      return { score: 0 };
    }

    // Collect possible moves and scores
    let moves: MinimaxResult[] = [];
    for (let i = 0; i < currentBoard.length; i++) {
      if (currentBoard[i] === EMPTY_CELL) {
        let move: MinimaxResult = {};
        move.index = i;
        let newBoard = [...currentBoard];
        newBoard[i] = player;

        if (player === PLAYER_AI) {
          let result = minimax(newBoard, PLAYER_HUMAN);
          move.score = result.score;
        } else {
          let result = minimax(newBoard, PLAYER_AI);
          move.score = result.score;
        }

        moves.push(move);
      }
    }

    // Find the best move
    let bestMove: MinimaxResult | undefined;
    if (player === PLAYER_AI) {
      let bestScore = -Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score && moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = moves[i];
        }
      }
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score && moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = moves[i];
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

  return (
    <div className="App">
      <h1>Tic Tac Toe with Minimax AI</h1>
      <div className="board">
        {board.map((cell, index) => renderCell(index))}
      </div>
      {gameOver && (
        <div className="game-over">
          <p>{checkWinner(board) === 0 ? 'It\'s a tie!' : `Player ${currentPlayer === PLAYER_HUMAN ? PLAYER_AI : PLAYER_HUMAN} wins!`}</p>
        </div>
      )}
    </div>
  );
};

export default App;
