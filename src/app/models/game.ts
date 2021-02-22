// import { ICurrentBoard } from './currentboard';

export interface IGame {
  gameId: number;
  player1: string;
  player2: string;
  nextMove: string;
  winner: string;
  winningLine: number;
  currentBoard: ICurrentBoard;
}

interface ICurrentBoard {
  boardId: number;
  p1Symbol: string;
  p2Symbol: string;
  pos0: string;
  pos1: string;
  pos2: string;
  pos3: string;
  pos4: string;
  pos5: string;
  pos6: string;
  pos7: string;
  pos8: string;
}
