import { ICurrentBoard } from './currentboard';

export interface IGame {
  gameId: number;
  player1: string;
  player2: string;
  nextMove: string;
  winner: string;
  winningLine: number;
  currentBoard: ICurrentBoard;
}
