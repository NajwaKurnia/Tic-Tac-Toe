const rooms = {};

function createRoom(roomId) {
  rooms[roomId] = {
    players: [],
    board: Array(9).fill(null),
    currentTurn: null,
    gameActive: false,
    timerInterval: null, 
    timeLeft: 0,         
  };
}

function getRoom(roomId) {
  return rooms[roomId] || null;
}

function deleteRoom(roomId) {
  delete rooms[roomId];
}

function findRoomByPlayerId(playerId) {
  return Object.keys(rooms).find(id =>
    rooms[id].players.some(p => p.id === playerId)
  ) || null;
}

function addPlayerToRoom(roomId, playerId, playerName) {
  const room   = rooms[roomId];
  const symbol = room.players.length === 0 ? 'X' : 'O';
  room.players.push({ id: playerId, symbol, name: playerName }); 
  return symbol;
}

function isRoomFull(roomId) {
  return rooms[roomId]?.players.length >= 2;
}

module.exports = {
  rooms,
  createRoom,
  getRoom,
  deleteRoom,
  findRoomByPlayerId,
  addPlayerToRoom,
  isRoomFull,
};