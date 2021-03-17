import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { ICurrentBoard, IGame } from 'src/app/models/game';
import { MoveModel } from 'src/app/models/move-model';
import { NewGameModel } from 'src/app/models/newgame-model';
import { UnblockModel } from 'src/app/models/unblock-model';
import { UnblockResponseModel } from 'src/app/models/unblock-response-model';
import { GameService } from 'src/app/services/game.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { MessagesService } from 'src/app/services/messages.service';

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
      set: undefined,
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
      set: undefined,
    };

    return of(returnedGame);
  }

  unblock(unblockParams: UnblockModel): Observable<any> {
    const unblockResponse: UnblockResponseModel = {
      gameId: 1,
      issuer: 'Player 2',
      qIndex: 1,
    };

    return of(unblockResponse);
  }
}

class MockLocalStorageService {
  // Mocking local storage
  store: { [index: string]: string | null } = {};

  getValue(key: string): string | null {
    return key in this.store ? this.store[key] : null;
  }

  storeValue(key: string, value: string): void {
    this.store[key] = `${value}`;
  }

  removeValue(key: string): void {
    this.store[key] = null;
  }
}

describe('CellsComponent', () => {
  let component: CellsComponent;
  let fixture: ComponentFixture<CellsComponent>;
  let service1: GameService;
  let service2: MessagesService;
  let service3: LocalStorageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [CellsComponent],
      providers: [
        { provide: GameService, useClass: MockService },
        { provide: MessagesService, useClass: MessagesService },
        { provide: LocalStorageService, useClass: MockLocalStorageService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CellsComponent);
    component = fixture.componentInstance;
    service1 = TestBed.inject(GameService);
    service2 = TestBed.inject(MessagesService);
    service3 = TestBed.inject(LocalStorageService);

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

    const out1 = expect(component.checkWinOrDraw(board)).toHaveBeenCalled;
    const out2 = expect(spyService1).toHaveBeenCalled();
    const out3 = expect(component.gameOver).toBe(true);
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

    const out1 = expect(component.checkWinOrDraw(board)).toHaveBeenCalled;
    const out2 = expect(spyService1).toHaveBeenCalled();
    const out3 = expect(component.gameOver).toBe(true);
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
    const out3 = expect(component.gameOver).toBe(true);
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
      set: undefined,
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
      set: undefined,
    };

    component.game = sampleGame;

    component.positionButtonClicked(5);

    const out = expect(component.board.symbol[5]).toEqual('X');
  });

  it('humanButtonClicked should give correct message service when game is undefined', () => {
    const spyService = spyOn(service2, 'add');

    // component.username = 'Test Player';
    service3.storeValue('token', 'testtoken');
    service3.storeValue('user', 'Test Player');

    component.humanButtonClicked();

    const out = expect(spyService).toHaveBeenCalledWith(
      'Your move, Test Player'
    );
  });

  it('toggleBoardLock should lock if it is not player"s move', () => {
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
      set: undefined,
    };

    component.game = sampleGame;
    component.humanOpponent = true;
    component.username = 'Player 1';
    component.boardLocked = false;

    component.toggleBoardLock(sampleGame);

    const out = expect(component.boardLocked).toBe(true);
  });

  it('toggleBoardLock should not lock if it is player"s move', () => {
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
      set: undefined,
    };

    component.game = sampleGame;
    component.humanOpponent = true;
    component.username = 'Player 2';
    component.boardLocked = true;

    component.toggleBoardLock(sampleGame);

    const out = expect(component.boardLocked).toBe(false);
  });

  it('toggleBoardLock should lock if playing against computer', () => {
    const sampleGame: IGame = {
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
      set: undefined,
    };

    component.game = sampleGame;
    component.humanOpponent = false;
    component.username = 'Player 1';
    component.boardLocked = true;

    component.toggleBoardLock(sampleGame);

    const out = expect(component.boardLocked).toBe(false);
  });

  it('unblockOpponent should not call unblock service if it is not player against human or not game over', () => {
    const sampleGame: IGame = {
      gameId: 1,
      player1: 'Player 1',
      player2: 'Computer',
      nextMove: 'Player 1',
      winner: 'Player 1',
      winningLine: 1,
      currentBoard: {
        boardId: 1,
        p1Symbol: 'O',
        p2Symbol: 'X',
        pos0: 'O',
        pos1: 'O',
        pos2: 'O',
        pos3: '',
        pos4: 'X',
        pos5: '',
        pos6: 'X',
        pos7: '',
        pos8: 'X',
      },
      set: undefined,
    };

    component.game = sampleGame;
    component.humanOpponent = false;
    component.username = 'Player 1';
    component.gameOver = false;
    const spyService = spyOn(service1, 'unblock');

    component.unblockOpponent(sampleGame);

    const out = expect(spyService).not.toHaveBeenCalled();
  });

  it('unblockOpponent should not call unblock service if winner is not current player', () => {
    const sampleGame: IGame = {
      gameId: 1,
      player1: 'Player 2',
      player2: 'Player 1',
      nextMove: 'Player 2',
      winner: 'Player 1',
      winningLine: 1,
      currentBoard: {
        boardId: 1,
        p1Symbol: 'O',
        p2Symbol: 'X',
        pos0: 'O',
        pos1: 'O',
        pos2: 'O',
        pos3: '',
        pos4: 'X',
        pos5: '',
        pos6: 'X',
        pos7: '',
        pos8: 'X',
      },
      set: undefined,
    };

    component.game = sampleGame;
    component.humanOpponent = true;
    component.gameOver = true;
    component.username = 'Player 2';

    const spyService = spyOn(service1, 'unblock');

    component.unblockOpponent(sampleGame);

    const out = expect(spyService).not.toHaveBeenCalled();
  });

  it('unblockOpponent should call unblock with qIndex 1 if winner is Player1', () => {
    const sampleGame: IGame = {
      gameId: 1,
      player1: 'Player 1',
      player2: 'Player 2',
      nextMove: 'Player 2',
      winner: 'Player 1',
      winningLine: 1,
      currentBoard: {
        boardId: 1,
        p1Symbol: 'O',
        p2Symbol: 'X',
        pos0: 'O',
        pos1: 'O',
        pos2: 'O',
        pos3: '',
        pos4: 'X',
        pos5: '',
        pos6: 'X',
        pos7: '',
        pos8: 'X',
      },
      set: undefined,
    };

    component.game = sampleGame;
    component.humanOpponent = true;
    component.gameOver = true;
    component.gameId = 1;
    component.username = 'Player 1';
    component.unblockResponse.gameId = 0;
    const unblockParams: UnblockModel = {
      issuer: 'Player 1',
      gameId: 1,
      qIndex: 1,
    };

    const spyService = spyOn(service1, 'unblock').and.returnValue(of());

    component.unblockOpponent(sampleGame);

    const out1 = expect(spyService).toHaveBeenCalledWith(unblockParams);
    const out2 = expect(spyService).toHaveBeenCalledTimes(1);
  });

  it('unblockOpponent should call unblock with qIndex 2 if winner is Player2', () => {
    const sampleGame: IGame = {
      gameId: 1,
      player1: 'Player 1',
      player2: 'Player 2',
      nextMove: 'Player 1',
      winner: 'Player 2',
      winningLine: 1,
      currentBoard: {
        boardId: 1,
        p1Symbol: 'O',
        p2Symbol: 'X',
        pos0: 'O',
        pos1: 'O',
        pos2: 'O',
        pos3: '',
        pos4: 'X',
        pos5: '',
        pos6: 'X',
        pos7: '',
        pos8: 'X',
      },
      set: undefined,
    };

    component.game = sampleGame;
    component.humanOpponent = true;
    component.gameOver = true;
    component.gameId = 1;
    component.username = 'Player 2';
    component.unblockResponse.gameId = 0;
    const unblockParams: UnblockModel = {
      issuer: 'Player 2',
      gameId: 1,
      qIndex: 2,
    };

    const spyService = spyOn(service1, 'unblock').and.returnValue(of());

    component.unblockOpponent(sampleGame);

    const out1 = expect(spyService).toHaveBeenCalledWith(unblockParams);
    const out2 = expect(spyService).toHaveBeenCalledTimes(1);
  });

  it('unblockOpponent should not call unblock if winner exists and current player was previously unblocked', () => {
    const sampleGame: IGame = {
      gameId: 1,
      player1: 'Player 1',
      player2: 'Player 2',
      nextMove: 'Player 1',
      winner: 'Player 2',
      winningLine: 1,
      currentBoard: {
        boardId: 1,
        p1Symbol: 'O',
        p2Symbol: 'X',
        pos0: 'O',
        pos1: 'O',
        pos2: 'O',
        pos3: '',
        pos4: 'X',
        pos5: '',
        pos6: 'X',
        pos7: '',
        pos8: 'X',
      },
      set: undefined,
    };

    component.game = sampleGame;
    component.humanOpponent = true;
    component.gameOver = true;
    component.gameId = 1;
    component.username = 'Player 2';
    component.unblockResponse.gameId = 1;
    const unblockParams: UnblockModel = {
      issuer: 'Player 2',
      gameId: 1,
      qIndex: 2,
    };

    const spyService = spyOn(service1, 'unblock').and.returnValue(of());

    component.unblockOpponent(sampleGame);

    const out1 = expect(spyService).not.toHaveBeenCalled();
  });

  it('unblockOpponent should not call unblock service if it is a draw and not not current player"s move', () => {
    const sampleGame: IGame = {
      gameId: 1,
      player1: 'Player 2',
      player2: 'Player 1',
      nextMove: 'Player 2',
      winner: 'Player 1',
      winningLine: 0,
      currentBoard: {
        boardId: 1,
        p1Symbol: 'O',
        p2Symbol: 'X',
        pos0: 'O',
        pos1: 'X',
        pos2: 'O',
        pos3: 'X',
        pos4: 'X',
        pos5: 'O',
        pos6: 'X',
        pos7: '',
        pos8: 'X',
      },
      set: undefined,
    };

    component.game = sampleGame;
    component.humanOpponent = true;
    component.gameOver = true;
    component.username = 'Player 1';

    const spyService = spyOn(service1, 'unblock');

    component.unblockOpponent(sampleGame);

    const out = expect(spyService).not.toHaveBeenCalled();
  });

  it('unblockOpponent should call unblock with qIndex 1 if it is a draw and is Player1"s move', () => {
    const sampleGame: IGame = {
      gameId: 1,
      player1: 'Player 1',
      player2: 'Player 2',
      nextMove: 'Player 1',
      winner: 'Player 1',
      winningLine: 1,
      currentBoard: {
        boardId: 1,
        p1Symbol: 'O',
        p2Symbol: 'X',
        pos0: 'O',
        pos1: 'O',
        pos2: 'O',
        pos3: '',
        pos4: 'X',
        pos5: '',
        pos6: 'X',
        pos7: '',
        pos8: 'X',
      },
      set: undefined,
    };

    component.game = sampleGame;
    component.humanOpponent = true;
    component.gameOver = true;
    component.gameId = 1;
    component.username = 'Player 1';
    component.unblockResponse.gameId = 0;
    const unblockParams: UnblockModel = {
      issuer: 'Player 1',
      gameId: 1,
      qIndex: 1,
    };

    const spyService = spyOn(service1, 'unblock').and.returnValue(of());

    component.unblockOpponent(sampleGame);

    const out1 = expect(spyService).toHaveBeenCalledWith(unblockParams);
    const out2 = expect(spyService).toHaveBeenCalledTimes(1);
  });

  it('unblockOpponent should call unblock with qIndex 2 if it is a draw and is Player2"s move', () => {
    const sampleGame: IGame = {
      gameId: 1,
      player1: 'Player 1',
      player2: 'Player 2',
      nextMove: 'Player 2',
      winner: 'Player 2',
      winningLine: 1,
      currentBoard: {
        boardId: 1,
        p1Symbol: 'O',
        p2Symbol: 'X',
        pos0: 'O',
        pos1: 'O',
        pos2: 'O',
        pos3: '',
        pos4: 'X',
        pos5: '',
        pos6: 'X',
        pos7: '',
        pos8: 'X',
      },
      set: undefined,
    };

    component.game = sampleGame;
    component.humanOpponent = true;
    component.gameOver = true;
    component.gameId = 1;
    component.username = 'Player 2';
    component.unblockResponse.gameId = 0;
    const unblockParams: UnblockModel = {
      issuer: 'Player 2',
      gameId: 1,
      qIndex: 2,
    };

    const spyService = spyOn(service1, 'unblock').and.returnValue(of());

    component.unblockOpponent(sampleGame);

    const out1 = expect(spyService).toHaveBeenCalledWith(unblockParams);
    const out2 = expect(spyService).toHaveBeenCalledTimes(1);
  });

  it('humanButtonClicked should clear username if no token found', () => {
    service3.removeValue('token');
    service3.storeValue('user', 'testuser');

    component.humanButtonClicked();

    const out1 = expect(component.loginRequired).toBe(true);
    const out2 = expect(component.username).toEqual('');
  });

  it('humanButtonClicked should set username if token is present', () => {
    service3.storeValue('token', 'testtoken');
    service3.storeValue('user', 'Test Player');

    component.humanButtonClicked();

    const out1 = expect(component.loginRequired).toBe(false);
    const out2 = expect(component.username).toEqual('Test Player');
  });

  it('cpuButtonClicked should clear username if no token found', () => {
    service3.removeValue('token');
    service3.storeValue('user', 'testuser');

    component.cpuButtonClicked();

    const out1 = expect(component.loginRequired).toBe(true);
    const out2 = expect(component.username).toEqual('');
  });

  it('cpuButtonClicked should set username if token is present', () => {
    service3.storeValue('token', 'testtoken');
    service3.storeValue('user', 'Test Player');

    component.cpuButtonClicked();

    const out1 = expect(component.loginRequired).toBe(false);
    const out2 = expect(component.username).toEqual('Test Player');
  });
});
