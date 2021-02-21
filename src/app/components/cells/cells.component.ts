import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cells',
  templateUrl: './cells.component.html',
  styleUrls: ['./cells.component.css'],
})
export class CellsComponent implements OnInit {
  opponent: string = '';
  opponentSelected: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  humanButtonClicked() {
    this.opponent = 'Human';
    this.opponentSelected = true;
  }

  cpuButtonClicked() {
    this.opponent = 'Computer';
    this.opponentSelected = true;
  }
}
