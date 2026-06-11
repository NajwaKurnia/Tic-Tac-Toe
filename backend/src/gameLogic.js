const WINNING_LINES = [
    [0,1,2],[3,4,5],[6,7,8], 
    [0,3,6],[1,4,7],[2,5,8], 
    [0,4,8],[2,4,6],         
];

const TURN_DURATION = 15; 
function checkWinner(board) {
    for (const [a,b,c] of WINNING_LINES) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]; 
        }
    }
    if (board.every(cell => cell !== null)) return 'draw';
    return null;
}

function validateMove(room, socketId, index) {
    if (!room.gameActive)                return 'Game belum aktif!';
    if (room.currentTurn !== socketId)   return 'Bukan giliran kamu!';
    if (room.board[index] !== null)      return 'Kotak sudah terisi!';
    return null; 
}

function applyMove(room, socketId, index) {
    const player = room.players.find(p => p.id === socketId);
    room.board[index] = player.symbol;
    return checkWinner(room.board);
}

function switchTurn(room, currentSocketId) {
    const other = room.players.find(p => p.id !== currentSocketId);
    room.currentTurn = other.id;
}

function resetGame(room) {
    room.board = Array(9).fill(null);
    room.gameActive = true;
    const prev = room.currentTurn;
    room.currentTurn = room.players.find(p => p.id !== prev)?.id
                    ?? room.players[0].id;
}

module.exports = {
    TURN_DURATION,
    checkWinner,
    validateMove,
    applyMove,
    switchTurn,
    resetGame,
};