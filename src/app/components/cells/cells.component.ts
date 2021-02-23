import { Component, OnInit } from '@angular/core';
import { ICurrentBoard, IGame } from 'src/app/models/game';
import { MoveModel } from 'src/app/models/moveModel';
import { NewGameModel } from 'src/app/models/newGameModel';
import { GameService } from 'src/app/services/game.service';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-cells',
  templateUrl: './cells.component.html',
  styleUrls: ['./cells.component.css'],
})
export class CellsComponent implements OnInit {
  username: string = 'Player 1';
  opponent: string = '';
  gameId: number = 0;
  position: number = 0;
  winningLine: number = 0;
  winner: string = '';
  errorMessage = '';
  opponentSelected: boolean = false;
  game: IGame | undefined;
  filledPositions: number = 0;

  constructor(
    private gameService: GameService,
    public messagesService: MessagesService
  ) {}

  ngOnInit(): void {}

  humanButtonClicked(): void {
    this.opponent = 'Human';
    this.opponentSelected = true;
  }

  cpuButtonClicked(): void {
    this.opponent = 'Computer';
    this.opponentSelected = true;
    let newGameParams: NewGameModel = {
      username: this.username,
      opponent: this.opponent,
    };

    this.messagesService.add('Your opponent is the game server');
    this.messagesService.add(`Your move, ${this.username}`);
    this.gameService.newGame(newGameParams).subscribe({
      next: (game) => {
        (this.game = game), (this.gameId = game.gameId);
      },
      // error: (err) => (this.errorMessage = err),
    });
  }

  resetButtonClicked(): void {
    this.opponent = '';
    this.opponentSelected = false;
    // this.messagesService.clear();
    // console.log(`Message length: ${this.messagesService.messages.length}`);
  }

  positionButtonClicked(position: number): void {
    if (this.gameId > 0) {
      this.position = position;
      let moveParams: MoveModel = {
        username: this.username,
        gameId: this.gameId,
        position: this.position,
      };

      this.gameService.sendMove(moveParams).subscribe({
        next: (game) => {
          (this.game = game),
            (this.gameId = game.gameId),
            (this.winningLine = game.winningLine),
            (this.winner = game.winner);
          this.checkWinOrDraw(game.currentBoard);
        },
        // error: (err) => (this.errorMessage = err),
      });
    }
  }

  // check for win or draw here
  checkWinOrDraw(currentBoard: ICurrentBoard): void {
    //check for win conditions
    if (this.winningLine > 0) {
      let winningPlayer = 'You';
      if (this.winner !== this.game?.player1) {
        if (this.winner !== 'Computer') {
          winningPlayer = this.winner;
        } else {
          winningPlayer = 'The computer';
        }
      }
      this.messagesService.add(`${winningPlayer} won the game!`);
    } else if (this.winningLine == 0) {
      // There is no winner yet. If one position is left, then game is drawn.
      let filledPositions = 0;
      if (currentBoard.pos0 !== '') filledPositions++;
      if (currentBoard.pos1 !== '') filledPositions++;
      if (currentBoard.pos2 !== '') filledPositions++;
      if (currentBoard.pos3 !== '') filledPositions++;
      if (currentBoard.pos4 !== '') filledPositions++;
      if (currentBoard.pos5 !== '') filledPositions++;
      if (currentBoard.pos6 !== '') filledPositions++;
      if (currentBoard.pos7 !== '') filledPositions++;
      if (currentBoard.pos8 !== '') filledPositions++;
      this.filledPositions = filledPositions;
      if (filledPositions === 8) {
        this.messagesService.add(`This game is a draw`);
      }
    } else this.messagesService.add(`Your move, ${this.game?.nextMove}`);
  }
}
