import { Component, OnInit } from '@angular/core';
import { IGame } from 'src/app/models/game';
import { MoveModel } from 'src/app/models/moveModel';
import { NewGameModel } from 'src/app/models/newGameModel';
import { GameService } from 'src/app/services/game.service';

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

  opponentSelected: boolean = false;
  game: IGame | undefined;

  errorMessage = '';

  constructor(private gameService: GameService) {}

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
          (this.game = game), (this.gameId = game.gameId);
        },
        // error: (err) => (this.errorMessage = err),
      });

      // check for win or draw here
    }
  }
}
