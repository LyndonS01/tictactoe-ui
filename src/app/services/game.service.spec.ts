import { getTestBed, TestBed } from '@angular/core/testing';
import { IGame } from '../models/game';
import { NewGameModel } from '../models/newgame-model';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { GameService } from './game.service';
import { environment } from 'src/environments/environment';
import { MoveModel } from '../models/move-model';
import { UnblockModel } from '../models/unblock-model';
import { CellsComponent } from '../components/cells/cells.component';

describe('GameService', () => {
  let service: GameService;
  let httpMock: HttpTestingController;

  const game: IGame = {
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

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(GameService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('#createNewGame', () => {
    it('it should create expected game', () => {
      const testParams = new NewGameModel('Player 1', 'Computer', 0, 0);
      const testResponse = {
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

      service.newGame(testParams).subscribe((result) => {
        expect(result).toEqual(testResponse);
      });

      const req = httpMock.expectOne(
        `${environment.game.baseurl}${environment.game.endpoint}${environment.game.new}`
      );
      expect(req.request.method).toBe('POST');
      req.flush(testResponse);
    });
  });

  describe('#sendMove', () => {
    it('it should send move and receive the updated game', () => {
      const testParams = new MoveModel('Player 1', 1, 4);
      const testResponse = {
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

      service.sendMove(testParams).subscribe((result) => {
        expect(result).toEqual(testResponse);
      });

      const req = httpMock.expectOne(
        `${environment.game.baseurl}${environment.game.endpoint}${environment.game.move}`
      );
      expect(req.request.method).toBe('POST');
      req.flush(testResponse);
    });
  });

  describe('#unblock', () => {
    it('it should use unbolck params and receive the published message', () => {
      const unblockParams = new UnblockModel('Player 1', 1, 1);
      const unblockResponse = {
        gameId: 1,
        issuer: 'Player 1', // irrelevant
        qIndex: 1, // index to route key or queue
      };

      service.unblock(unblockParams).subscribe((result) => {
        expect(result).toEqual(unblockResponse);
      });

      const req = httpMock.expectOne(
        `${environment.game.baseurl}${environment.game.endpoint}${environment.game.unblock}?gameId=${unblockParams.gameId}&id=${unblockParams.qIndex}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(unblockResponse);
    });
  });
});
