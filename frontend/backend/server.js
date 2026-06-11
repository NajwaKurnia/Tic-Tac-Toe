const express = require('express');
const http    = require('http');
const { Server } = require('socket.io');
const cors    = require('cors');
const { registerSocketEvents } = require('./src/socketHandler');

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Next.js dev server
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);
  registerSocketEvents(io, socket);
});

server.listen(4000, () => {
  console.log('Backend berjalan di http://localhost:4000');
});