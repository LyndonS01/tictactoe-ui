import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-cells',
  templateUrl: './cells.component.html',
  styleUrls: ['./cells.component.css'],
})
export class CellsComponent implements OnInit {
  opponent: string = '';
  opponentSelected: boolean = false;

  constructor(private gameService: GameService) {}

  ngOnInit(): void {}

  humanButtonClicked(): void {
    this.opponent = 'Human';
    this.opponentSelected = true;
  }

  cpuButtonClicked(): void {
    this.opponent = 'Computer';
    this.opponentSelected = true;
  }

  resetButtonClicked(): void {
    this.opponent = '';
    this.opponentSelected = false;
  }
}
