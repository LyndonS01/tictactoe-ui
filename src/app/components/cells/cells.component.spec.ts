import { HttpClientModule } from '@angular/common/http';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { ICurrentBoard, IGame } from 'src/app/models/game';
import { MoveModel } from 'src/app/models/moveModel';
import { NewGameModel } from 'src/app/models/newGameModel';
import { GameService } from 'src/app/services/game.service';
import { MessagesService } from 'src/app/services/messages.service';
import { MessagesComponent } from '../messages/messages.component';

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
  let service2: MessagesService;
  let mockMessagesService: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [CellsComponent],
      providers: [
        { provide: GameService, useClass: MockService },
        { provide: MessagesService, useClass: MessagesService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CellsComponent);
    component = fixture.componentInstance;
    service1 = TestBed.inject(GameService);
    service2 = TestBed.inject(MessagesService);

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
    component.gameId = 1;

    component.positionButtonClicked(4);

    expect(component.position).toEqual(4);
  });

  it('should send not update game server when gameId is not valid', () => {
    let spyService = spyOn(service1, 'sendMove');

    component.gameId = 0;
    component.positionButtonClicked(4);

    expect(component.position).toEqual(0);
    expect(spyService).not.toHaveBeenCalled();
  });

  // checkWinOrDraw with Player 1 as winner
  it('should add message that You won', () => {
    component.winningLine = 1;
    component.username = 'Player 1';
    component.winner = 'Player 1';
    let spyService1 = spyOn(service2, 'add');
    let board: ICurrentBoard = {
      boardId: 1,
      p1Symbol: 'O',
      p2Symbol: 'X',
      pos0: 'X',
      pos1: 'O',
      pos2: 'X',
      pos3: 'O',
      pos4: 'X',
      pos5: 'O',
      pos6: 'X',
      pos7: 'O',
      pos8: '',
    };

    component.checkWinOrDraw(board);

    expect(component.checkWinOrDraw(board)).toHaveBeenCalled;
    expect(spyService1).toHaveBeenCalled();
  });

  // checkWinOrDraw with Computer as winner
  it('should add message that the computer won', () => {
    component.winningLine = 1;
    component.username = 'Player 1';
    component.winner = 'Computer';
    let spyService1 = spyOn(service2, 'add');
    let board: ICurrentBoard = {
      boardId: 1,
      p1Symbol: 'O',
      p2Symbol: 'X',
      pos0: 'X',
      pos1: 'O',
      pos2: 'X',
      pos3: 'O',
      pos4: 'X',
      pos5: 'O',
      pos6: 'X',
      pos7: 'O',
      pos8: '',
    };
    component.checkWinOrDraw(board);

    expect(component.checkWinOrDraw(board)).toHaveBeenCalled;
    expect(spyService1).toHaveBeenCalled();
  });

  // checkWinOrDraw with one position left
  it('should add message that the game is drawn', () => {
    component.winningLine = 0;
    component.username = 'Player 1';
    component.winner = '';

    let board: ICurrentBoard = {
      boardId: 1,
      p1Symbol: 'O',
      p2Symbol: 'X',
      pos0: 'X',
      pos1: 'O',
      pos2: 'X',
      pos3: 'O',
      pos4: 'X',
      pos5: 'O',
      pos6: 'X',
      pos7: 'O',
      pos8: '',
    };
    let spyService1 = spyOn(service2, 'add');

    component.checkWinOrDraw(board);

    expect(component.checkWinOrDraw(board)).toHaveBeenCalled;
  });
});
