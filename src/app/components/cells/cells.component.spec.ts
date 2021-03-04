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
    const returnedGame: IGame = {
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
    const returnedGame: IGame = {
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

  // click on Human saves Player 2 as opponent
  it('should set humanOpponent to true', () => {
    expect(component.opponent).toEqual('');
    expect(component.opponentTypeSelected).toBe(false);
    expect(component.humanOpponent).toBe(false);

    component.humanButtonClicked();

    expect(component.opponentTypeSelected).toBe(true);
    // expect(component.opponent).toEqual('');
    expect(component.humanOpponent).toBe(true);
  });

  // click on Computer saves Computer as opponent
  it('should save computer as opponent', () => {
    spyOn(service1, 'newGame').and.returnValue(of());
    expect(component.opponent).toEqual('');
    expect(component.opponentTypeSelected).toBe(false);

    component.cpuButtonClicked();

    expect(service1.newGame).toHaveBeenCalled();
    expect(component.opponentTypeSelected).toBe(true);
    expect(component.opponent).toEqual('Computer');
  });

  // click on Reset restarts the game
  it('should reset the game', () => {
    const spyService = spyOn(service2, 'clear');
    component.resetButtonClicked();

    expect(component.opponentTypeSelected).toBe(false);
    expect(component.opponent).toEqual('');
    expect(component.filledPositions).toEqual(0);
    expect(component.winner).toEqual('');
    expect(component.humanOpponent).toBe(false);
    expect(spyService).toHaveBeenCalled();
  });

  // click on a cell sends update to game server
  it('should send update to game server when gameId is valid', () => {
    component.gameId = 1;

    component.positionButtonClicked(4);

    expect(component.position).toEqual(4);
  });

  it('should not send update game server when gameId is not valid', () => {
    const spyService = spyOn(service1, 'sendMove');

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
    const spyService1 = spyOn(service2, 'add');
    const board: ICurrentBoard = {
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

    const out = expect(component.checkWinOrDraw(board)).toHaveBeenCalled;
    expect(spyService1).toHaveBeenCalled();
  });

  // checkWinOrDraw with Computer as winner
  it('should add message that the computer won', () => {
    component.winningLine = 1;
    component.username = 'Player 1';
    component.winner = 'Computer';
    const spyService1 = spyOn(service2, 'add');
    const board: ICurrentBoard = {
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

    const out = expect(component.checkWinOrDraw(board)).toHaveBeenCalled;
    expect(spyService1).toHaveBeenCalled();
  });

  // checkWinOrDraw with one position left
  it('should add message that the game is drawn', () => {
    component.winningLine = 0;
    component.username = 'Player 1';
    component.winner = '';

    const board: ICurrentBoard = {
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
    const spyService1 = spyOn(service2, 'add');

    component.checkWinOrDraw(board);

    const out1 = expect(component.checkWinOrDraw(board)).toHaveBeenCalled;
    const out2 = expect(spyService1).toHaveBeenCalled;
  });

  it('positionButtonClicked should not update cell clicked when game is undefined', () => {
    component.game = undefined;

    component.positionButtonClicked(4);

    const out = expect(component.board.symbol[4]).toEqual('O');
  });

  it('positionButtonClicked should update cell clicked with p1Symbol when game is defined', () => {
    const sampleGame: IGame = {
      gameId: 1,
      player1: 'Player 1',
      player2: '',
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
    component.game = sampleGame;

    component.positionButtonClicked(5);

    const out = expect(component.board.symbol[5]).toEqual('O');
  });

  it('positionButtonClicked should update cell clicked with p2Symbol when game is defined', () => {
    const sampleGame: IGame = {
      gameId: 1,
      player1: 'Player 1',
      player2: 'Player 2',
      nextMove: 'Player 2',
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

    component.game = sampleGame;

    component.positionButtonClicked(5);

    const out = expect(component.board.symbol[5]).toEqual('X');
  });

  it('humanButtonClicked should give correct message service when game is undefined', () => {
    const spyService = spyOn(service2, 'add');
    component.game = undefined;

    component.humanButtonClicked();

    const out = expect(spyService).toHaveBeenCalledWith(
      'Waiting for opponent to join or move...'
    );
  });

  it('humanButtonClicked should give correct message service when it is player 1"s turn', () => {
    const sampleGame: IGame = {
      gameId: 1,
      player1: 'Player 1',
      player2: '',
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

    component.game = sampleGame;
    const spyService = spyOn(service2, 'add');

    component.humanButtonClicked();

    const out = expect(spyService).toHaveBeenCalledWith(
      'Your move, Player 1 (O)'
    );
  });

  it('humanButtonClicked should give correct message service when it is player 2"s turn', () => {
    const sampleGame: IGame = {
      gameId: 1,
      player1: 'Player 1',
      player2: 'Player 2',
      nextMove: 'Player 2',
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

    component.game = sampleGame;
    const spyService = spyOn(service2, 'add');

    component.humanButtonClicked();

    const out = expect(spyService).toHaveBeenCalledWith(
      'Your move, Player 2 (X)'
    );
  });

  it('checkWinOrDraw should give correct message service when it is a human opponent', () => {
    const board: ICurrentBoard = {
      boardId: 1,
      p1Symbol: 'O',
      p2Symbol: 'X',
      pos0: '',
      pos1: '',
      pos2: '',
      pos3: '',
      pos4: 'O',
      pos5: '',
      pos6: '',
      pos7: '',
      pos8: '',
    };

    const spyService = spyOn(service2, 'add');

    component.humanOpponent = true;
    component.checkWinOrDraw(board);

    const out = expect(spyService).toHaveBeenCalledWith(
      'Waiting for opponent to join or move...'
    );
  });

  it('checkWinOrDraw should give correct message service when playing against computer', () => {
    const board: ICurrentBoard = {
      boardId: 1,
      p1Symbol: 'O',
      p2Symbol: 'X',
      pos0: '',
      pos1: '',
      pos2: '',
      pos3: '',
      pos4: 'O',
      pos5: '',
      pos6: '',
      pos7: '',
      pos8: '',
    };

    const spyService = spyOn(service2, 'add');

    component.humanOpponent = false;
    component.checkWinOrDraw(board);

    const out = expect(spyService).not.toHaveBeenCalledWith(
      'Waiting for opponent to join or move...'
    );
  });
});
