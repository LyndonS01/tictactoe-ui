import { Component, OnInit } from '@angular/core';
import { IGame } from 'src/app/models/game';
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
      next: (game) => (this.game = game),
      // error: (err) => (this.errorMessage = err),
    });
  }

  resetButtonClicked(): void {
    this.opponent = '';
    this.opponentSelected = false;
  }
}
