export type Symbol = 'X' | 'O';

export interface Player {
  id: string;
  symbol: Symbol;
  name: string;
}

export type Screen = 'lobby' | 'waiting' | 'game';

export interface GameState {
  board: (string | null)[];
  currentTurn: string | null;
  winner: string | null;
  winnerId: string | null;
  players: Player[];
}