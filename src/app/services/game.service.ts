import { Injectable } from '@angular/core';
import { IGame } from './game';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor() {}

  newGame(): IGame {
    return {
      gameId: 1,
      player1: 'Player 1',
      player2: 'Computer',
      nextMove: 'Player 1',
      winner: '',
      winningLine: 0,
      currentBoard: {
        boardId: 1,
        p1Symbol: 'O',
        p2Symbol: 'X',
        pos0: '',
        pos1: '',
        pos2: '',
        pos3: '',
        pos4: '',
        pos5: '',
        pos6: '',
        pos7: '',
        pos8: '',
      },
    };
  }
}
