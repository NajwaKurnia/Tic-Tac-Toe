'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSocket } from '@/hooks/useSocket';
import LobbyScreen   from '@/components/LobbyScreen';
import WaitingScreen from '@/components/WaitingScreen';
import GameScreen    from '@/components/GameScreen';
import { Screen, Player } from '@/types/game';

export default function Home() {
  const socket = useSocket();

  //State
  const [screen, setScreen]       = useState<Screen>('lobby');
  const [myName, setMyName]       = useState('');
  const [myId, setMyId]           = useState('');
  const [mySymbol, setMySymbol]   = useState('');
  const [roomId, setRoomId]       = useState('');
  const [players, setPlayers]     = useState<Player[]>([]);
  const [board, setBoard]         = useState<(string|null)[]>(Array(9).fill(null));
  const [currentTurn, setTurn]    = useState<string|null>(null);
  const [winner, setWinner]       = useState<string|null>(null);
  const [winnerId, setWinnerId]   = useState<string|null>(null);
  const [errorMsg, setErrorMsg]   = useState('');
  const [toast, setToast]         = useState('');

  //Toast
  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  // Reset
  function resetState() {
    setMyName(''); setMyId(''); setMySymbol('');
    setRoomId(''); setPlayers([]); setBoard(Array(9).fill(null));
    setTurn(null); setWinner(null); setWinnerId(null); setErrorMsg('');
  }

  //Socket Events 
  useEffect(() => {
    socket.on('joined_room', ({ roomId: rid, symbol, playersCount }) => {
      setMyId(socket.id ?? '');
      setMySymbol(symbol);
      setRoomId(rid);
      if (playersCount < 2) setScreen('waiting');
    });

    socket.on('room_full', () => {
      setErrorMsg('Room sudah penuh! Coba Room ID lain.');
    });

    socket.on('game_start', ({ currentTurn: turn, board: b, players: p }) => {
      setPlayers(p);
      setBoard(b);
      setTurn(turn);
      setWinner(null);
      setWinnerId(null);
      setScreen('game');
    });

    socket.on('update_board', ({ board: b, currentTurn: turn }) => {
      setBoard(b);
      setTurn(turn);
    });

    socket.on('invalid_move', ({ message }: { message: string }) => {
      showToast(`⚠️ ${message}`);
    });

    socket.on('game_over', ({ board: b, winner: w, winnerId: wid }) => {
      setBoard(b);
      setWinner(w);
      setWinnerId(wid);
    });

    socket.on('game_restart', ({ board: b, currentTurn: turn }) => {
      setBoard(b);
      setTurn(turn);
      setWinner(null);
      setWinnerId(null);
    });

    socket.on('player_disconnected', () => {
      showToast('Lawan kamu keluar dari game.');
      resetState();
      setScreen('lobby');
    });

    socket.on('error_msg', ({ message }: { message: string }) => {
      showToast(`${message}`);
    });

    return () => {
      socket.off('joined_room');
      socket.off('room_full');
      socket.off('game_start');
      socket.off('update_board');
      socket.off('invalid_move');
      socket.off('game_over');
      socket.off('game_restart');
      socket.off('player_disconnected');
      socket.off('error_msg');
    };
  }, [socket]);

  //Handlers
  const handleJoin = useCallback((name: string) => {
    setMyName(name);
    setErrorMsg('');
  }, []);

  const handleCellClick = useCallback((index: number) => {
    socket.emit('make_move', { index });
  }, [socket]);

  const handlePlayAgain = useCallback(() => {
    socket.emit('play_again');
  }, [socket]);

  const handleLeaveRoom = useCallback(() => {
    socket.emit('leave_room');
    resetState();
    setScreen('lobby');
  }, [socket]);

  //Render
  return (
    <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center">

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 transition-all">
          {toast}
        </div>
      )}

      {screen === 'lobby' && (
        <LobbyScreen socket={socket} onJoin={handleJoin} errorMsg={errorMsg} />
      )}
      {screen === 'waiting' && (
        <WaitingScreen roomId={roomId} symbol={mySymbol} name={myName} />
      )}
      {screen === 'game' && (
        <GameScreen
          board={board}
          currentTurn={currentTurn}
          myId={myId}
          myName={myName}
          mySymbol={mySymbol}
          players={players}
          winner={winner}
          winnerId={winnerId}
          onCellClick={handleCellClick}
          onPlayAgain={handlePlayAgain}
          onLeaveRoom={handleLeaveRoom}
        />
      )}
    </main>
  );
}