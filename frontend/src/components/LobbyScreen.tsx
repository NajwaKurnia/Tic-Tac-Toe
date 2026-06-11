'use client';

import { useState } from 'react';
import { Socket } from 'socket.io-client';

interface Props {
  socket: Socket;
  onJoin: (name: string) => void;
  errorMsg: string;
}

export default function LobbyScreen({ socket, onJoin, errorMsg }: Props) {
  const [name, setName]     = useState('');
  const [roomId, setRoomId] = useState('');

  function handleJoin() {
    if (!name.trim()) return;
    if (!roomId.trim()) return;
    onJoin(name.trim());
    socket.emit('join_lobby', { roomId: roomId.trim(), name: name.trim() });
  }

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <h1 className="text-4xl font-bold text-red-400">🎮 Tic Tac Toe</h1>
      <p className="text-gray-400">Masukkan nama dan Room ID untuk bermain</p>

      <input
        className="w-72 px-4 py-3 rounded-lg bg-transparent border-2 border-red-400 text-white text-center placeholder-gray-500 focus:outline-none"
        placeholder="Nama kamu"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        className="w-72 px-4 py-3 rounded-lg bg-transparent border-2 border-red-400 text-white text-center placeholder-gray-500 focus:outline-none"
        placeholder="Room ID (contoh: room123)"
        value={roomId}
        onChange={e => setRoomId(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleJoin()}
      />
      <button
        onClick={handleJoin}
        className="w-72 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition"
      >
        Masuk / Buat Lobby
      </button>

      {errorMsg && <p className="text-red-400 text-sm">{errorMsg}</p>}
    </div>
  );
}