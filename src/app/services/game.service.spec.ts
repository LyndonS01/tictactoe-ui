import { getTestBed, TestBed } from '@angular/core/testing';
import { IGame } from '../models/game';
import { NewGameModel } from '../models/newGameModel';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { GameService } from './game.service';
import { environment } from 'src/environments/environment';
import { MoveModel } from '../models/moveModel';

describe('GameService', () => {
  let service: GameService;
  let httpMock: HttpTestingController;
  let injector: TestBed;

  let game: IGame = {
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

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(GameService);
    injector = getTestBed();
    httpMock = injector.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('#createNewGame', () => {
    it('it should create expected game', () => {
      let testParams = new NewGameModel('Player 1', 'Computer');
      let testResponse = {
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

  describe('#sendNewMove', () => {
    it('it should send move and receive the updated game', () => {
      let testParams = new MoveModel('Player 1', 1, 4);
      let testResponse = {
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
});
