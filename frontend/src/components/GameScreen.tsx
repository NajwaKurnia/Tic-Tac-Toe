'use client';

import { Player } from '@/types/game';

interface Props {
  board: (string | null)[];
  currentTurn: string | null;
  myId: string;
  myName: string;
  mySymbol: string;
  players: Player[];
  winner: string | null;
  winnerId: string | null;
  onCellClick: (index: number) => void;
  onPlayAgain: () => void;
  onLeaveRoom: () => void;
}
const WINNING_LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6],
];

function getWinningCells(board: (string | null)[]): number[] {
  for (const [a,b,c] of WINNING_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return [a, b, c];
    }
  }
  return [];
}

export default function GameScreen({
  board, currentTurn, myId, myName, mySymbol,
  players, winner, winnerId,
  onCellClick, onPlayAgain, onLeaveRoom,
}: Props) {
  const isMyTurn   = currentTurn === myId;
  const opponent   = players.find(p => p.id !== myId);
  const winningCells = winner && winner !== 'draw' ? getWinningCells(board) : [];

  const statusText = winner
    ? winner === 'draw'
      ? '🤝 Seri!'
      : winnerId === myId ? '🏆 Kamu menang!' : '😢 Kamu kalah!'
    : isMyTurn
      ? `🟢 Giliran kamu! (${myName})`
      : `🔴 Giliran ${opponent?.name || 'lawan'}...`;

  return (
    <div className="flex flex-col items-center gap-6 p-8">
      <h1 className="text-3xl font-bold text-red-400">Tic Tac Toe</h1>

      {/* Status Bar */}
      <div className="flex gap-8 text-sm">
        <span className="text-blue-300 font-semibold">{myName} ({mySymbol})</span>
        <span className="text-orange-300 font-semibold">
          {opponent?.name} ({opponent?.symbol})
        </span>
      </div>

      {/* Turn Info */}
      <p className="text-green-300 font-medium">{statusText}</p>

      {/* Board */}
      <div className="grid grid-cols-3 gap-2">
        {board.map((val, i) => {
          const isWinningCell = winningCells.includes(i);

          return (
            <button
              key={i}
              onClick={() => onCellClick(i)}
              disabled={!!val || !!winner || !isMyTurn}
              className={`
                w-24 h-24 text-5xl font-bold rounded-xl border-2 transition-all duration-300
                disabled:opacity-100
                ${isWinningCell
                  ? 'bg-green-800 border-green-400 scale-105' 
                  : val
                    ? 'bg-slate-800 border-slate-600 cursor-default'
                    : 'bg-slate-800 border-slate-600 cursor-pointer hover:bg-slate-700 hover:border-slate-400'
                }
              `}
            >
              <span className={val === 'X' ? 'text-blue-400' : 'text-red-400'}>
                {val}
              </span>
            </button>
          );
        })}
      </div>

      {/* Action Buttons */}
      {winner && (
        <div className="flex gap-4 mt-2">
          <button
            onClick={onPlayAgain}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition"
          >
            Main Lagi
          </button>
          <button
            onClick={onLeaveRoom}
            className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition"
          >
            Keluar Room
          </button>
        </div>
      )}
    </div>
  );
}