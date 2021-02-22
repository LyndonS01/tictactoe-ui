import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { IGame } from 'src/app/models/game';
import { NewGameModel } from 'src/app/models/newGameModel';
import { GameService } from 'src/app/services/game.service';

import { CellsComponent } from './cells.component';

class MockService {
  newGame(newGame: NewGameModel): Observable<IGame> {
    let returnedGame: IGame = {
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

    return of(returnedGame);
  }
}

describe('CellsComponent', () => {
  let component: CellsComponent;
  let fixture: ComponentFixture<CellsComponent>;
  let service: GameService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [CellsComponent],
      providers: [{ provide: GameService, useClass: MockService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CellsComponent);
    component = fixture.componentInstance;
    service = TestBed.get(GameService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // click on Human saves Human as opponent
  it('should save human as opponent', () => {
    expect(component.opponent).toEqual('');
    expect(component.opponentSelected).toBe(false);
    component.humanButtonClicked();
    expect(component.opponentSelected).toBe(true);
    expect(component.opponent).toEqual('Human');
  });

  // click on Computer saves Computer as opponent
  it('should save computer as opponent', () => {
    expect(component.opponent).toEqual('');
    expect(component.opponentSelected).toBe(false);
    component.cpuButtonClicked();
    expect(component.opponentSelected).toBe(true);
    expect(component.opponent).toEqual('Computer');
  });

  // click on Reset restarts the game
  it('should save computer as opponent', () => {
    component.resetButtonClicked();
    expect(component.opponentSelected).toBe(false);
    expect(component.opponent).toEqual('');
  });
});
