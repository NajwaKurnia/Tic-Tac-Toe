'use client';

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function useSocket(): Socket {
  if (!socket) {
    socket = io('http://localhost:4000');
  }
  return socket;
}