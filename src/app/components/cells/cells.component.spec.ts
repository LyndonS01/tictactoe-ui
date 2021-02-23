import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { IGame } from 'src/app/models/game';
import { MoveModel } from 'src/app/models/moveModel';
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

  sendMove(moveParams: MoveModel): Observable<IGame> {
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
        pos0: 'X',
        pos1: '',
        pos2: '',
        pos3: '',
        pos4: 'O',
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
  let service1: GameService;
  // let mockGameService1: GameService;

  beforeEach(async () => {
    // mockGameService1 = jasmine.createSpyObj(['newGame']);

    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [CellsComponent],
      // providers: [{ provide: GameService, useClass: MockService }],
      providers: [
        { provide: GameService, useClass: MockService },
        // { provide: GameService, useValue: mockGameService1 },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CellsComponent);
    component = fixture.componentInstance;
    service1 = TestBed.inject(GameService);

    // let newGameParams: NewGameModel = {
    //   username: 'Player 1',
    //   opponent: 'Computer',
    // };

    // mockGameService1.newGame.and.returnValue(
    //   of<IGame>({
    //     gameId: 1,
    //     player1: 'Player 1',
    //     player2: 'Computer',
    //     nextMove: 'Player 1',
    //     winner: '',
    //     winningLine: 0,
    //     currentBoard: {
    //       boardId: 1,
    //       p1Symbol: 'O',
    //       p2Symbol: 'X',
    //       pos0: 'X',
    //       pos1: '',
    //       pos2: '',
    //       pos3: '',
    //       pos4: 'O',
    //       pos5: '',
    //       pos6: '',
    //       pos7: '',
    //       pos8: '',
    //     },
    //   })
    // );

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
    spyOn(service1, 'newGame').and.returnValue(of());
    expect(component.opponent).toEqual('');
    expect(component.opponentSelected).toBe(false);

    component.cpuButtonClicked();

    expect(service1.newGame).toHaveBeenCalled();
    expect(component.opponentSelected).toBe(true);
    expect(component.opponent).toEqual('Computer');
  });

  // click on Reset restarts the game
  it('should save computer as opponent', () => {
    component.resetButtonClicked();

    expect(component.opponentSelected).toBe(false);
    expect(component.opponent).toEqual('');
  });

  // click on a cell sends update to game server
  it('should send update to game server when gameId is valid', () => {
    // let spyComponent = spyOn(component, 'positionButtonClicked');

    component.gameId = 1;

    component.positionButtonClicked(4);

    // expect(component.positionButtonClicked).toHaveBeenCalled();
    expect(component.position).toEqual(4);
  });

  it('should send not update game server when gameId is not valid', () => {
    let spyService = spyOn(service1, 'sendMove');

    component.gameId = 0;
    component.positionButtonClicked(4);

    expect(component.position).toEqual(0);
    expect(spyService).not.toHaveBeenCalled();
  });
});
