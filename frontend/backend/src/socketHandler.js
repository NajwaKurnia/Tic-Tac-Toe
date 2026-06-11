const {
  createRoom, getRoom, deleteRoom,
  findRoomByPlayerId, addPlayerToRoom, isRoomFull,
} = require('./roomManager');

const { validateMove, applyMove, switchTurn, resetGame } = require('./gameLogic');

function handlePlayerLeave(io, socket) {
  try {
    const roomId = findRoomByPlayerId(socket.id);
    if (!roomId) return;

    socket.to(roomId).emit('player_disconnected');
    deleteRoom(roomId);
    socket.leave(roomId);

    console.log(`Room ${roomId} dihapus karena player ${socket.id} keluar`);
  } catch (err) {
    console.error(`[handlePlayerLeave] Error:`, err.message);
  }
}

function registerSocketEvents(io, socket) {

  socket.on('join_lobby', ({ roomId, name }) => {
    try {
      if (!roomId || typeof roomId !== 'string' || !roomId.trim()) {
        socket.emit('error_msg', { message: 'Room ID tidak valid!' });
        return;
      }
      if (!name || typeof name !== 'string' || !name.trim()) {
        socket.emit('error_msg', { message: 'Nama tidak valid!' });
        return;
      }

      const cleanRoomId = roomId.trim();
      const cleanName   = name.trim();

      if (!getRoom(cleanRoomId)) createRoom(cleanRoomId);

      if (isRoomFull(cleanRoomId)) {
        socket.emit('room_full');
        return;
      }

      const symbol = addPlayerToRoom(cleanRoomId, socket.id, cleanName);
      socket.join(cleanRoomId);
      socket.roomId = cleanRoomId;

      const room     = getRoom(cleanRoomId);
      const opponent = room.players.find(p => p.id !== socket.id);

      socket.emit('joined_room', {
        roomId: cleanRoomId,
        symbol,
        playersCount: room.players.length,
        opponentName: opponent?.name || null,
      });

      console.log(`[join_lobby] ${cleanName} (${socket.id}) joined room ${cleanRoomId} as ${symbol}`);

      if (room.players.length === 2) {
        room.gameActive  = true;
        room.currentTurn = room.players[0].id;

        io.to(cleanRoomId).emit('game_start', {
          currentTurn: room.currentTurn,
          board: room.board,
          players: room.players.map(p => ({ id: p.id, symbol: p.symbol, name: p.name })),
        });

        console.log(`[game_start] Room ${cleanRoomId} dimulai`);
      }
    } catch (err) {
      console.error(`[join_lobby] Error:`, err.message);
      socket.emit('error_msg', { message: 'Gagal bergabung ke room. Coba lagi.' });
    }
  });

  socket.on('make_move', ({ index }) => {
    try {
      if (index === undefined || index === null || typeof index !== 'number') {
        socket.emit('invalid_move', { message: 'Index tidak valid!' });
        return;
      }
      if (index < 0 || index > 8) {
        socket.emit('invalid_move', { message: 'Index di luar jangkauan!' });
        return;
      }

      const roomId = socket.roomId;
      const room   = getRoom(roomId);

      if (!room) {
        socket.emit('error_msg', { message: 'Room tidak ditemukan!' });
        return;
      }

      const errorMsg = validateMove(room, socket.id, index);
      if (errorMsg) {
        socket.emit('invalid_move', { message: errorMsg });
        return;
      }

      const winner = applyMove(room, socket.id, index);

      if (winner) {
        room.gameActive = false;
        io.to(roomId).emit('game_over', {
          board: room.board,
          winner,
          winnerId: winner !== 'draw' ? socket.id : null,
        });
        console.log(`[game_over] Room ${roomId} winner: ${winner}`);
      } else {
        switchTurn(room, socket.id);
        io.to(roomId).emit('update_board', {
          board: room.board,
          currentTurn: room.currentTurn,
        });
      }
    } catch (err) {
      console.error(`[make_move] Error:`, err.message);
      socket.emit('error_msg', { message: 'Gagal memproses langkah. Coba lagi.' });
    }
  });

  socket.on('play_again', () => {
    try {
      const room = getRoom(socket.roomId);

      if (!room) {
        socket.emit('error_msg', { message: 'Room tidak ditemukan!' });
        return;
      }
      if (room.players.length < 2) {
        socket.emit('error_msg', { message: 'Menunggu pemain lain!' });
        return;
      }

      resetGame(room);
      io.to(socket.roomId).emit('game_restart', {
        board: room.board,
        currentTurn: room.currentTurn,
      });

      console.log(`[play_again] Room ${socket.roomId} di-reset`);
    } catch (err) {
      console.error(`[play_again] Error:`, err.message);
      socket.emit('error_msg', { message: 'Gagal memulai ulang game. Coba lagi.' });
    }
  });

  socket.on('leave_room', () => {
    try {
      handlePlayerLeave(io, socket);
    } catch (err) {
      console.error(`[leave_room] Error:`, err.message);
    }
  });

  socket.on('disconnect', () => {
    try {
      handlePlayerLeave(io, socket);
      console.log(`[disconnect] Player ${socket.id} terputus`);
    } catch (err) {
      console.error(`[disconnect] Error:`, err.message);
    }
  });
}

module.exports = { registerSocketEvents };