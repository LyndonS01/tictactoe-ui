import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { ICurrentBoard, IGame } from 'src/app/models/game';
import { MoveModel } from 'src/app/models/move-model';
import { NewGameModel } from 'src/app/models/newgame-model';
import { SymbolsModel } from 'src/app/models/symbols-model';
import { UnblockModel } from 'src/app/models/unblock-model';
import { UnblockResponseModel } from 'src/app/models/unblock-response-model';
import { GameService } from 'src/app/services/game.service';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-cells',
  templateUrl: './cells.component.html',
  styleUrls: ['./cells.component.css'],
})
export class CellsComponent implements OnInit {
  username = 'Lefty';
  opponent = '';
  gameId = 0;
  position = 0;
  winningLine = 0;
  winner = '';
  errorMessage = '';
  opponentTypeSelected = false;
  playerSelected = false;
  game: IGame | undefined;
  filledPositions = 0;
  humanOpponent = false;
  board = new SymbolsModel();
  boardLocked = false;
  gameOver = false;
  unblockResponse = new UnblockResponseModel();

  constructor(
    private gameService: GameService,
    public messagesService: MessagesService
  ) {}

  ngOnInit(): void {}

  humanButtonClicked(): void {
    this.opponent = '';
    this.opponentTypeSelected = true;
    this.humanOpponent = true;
    const newGameParams: NewGameModel = {
      username: this.username,
      opponent: this.opponent,
    };

    this.messagesService.add(`Your move, ${this.username}`);

    this.boardLocked = true;
    this.gameService.newGame(newGameParams).subscribe({
      next: (game) => {
        (this.game = game),
          (this.gameId = game.gameId),
          (this.opponent = game.player2),
          this.copyBoard(game.currentBoard),
          this.toggleBoardLock(game);
      },
      // error: (err) => (this.errorMessage = err),
    });
  }

  cpuButtonClicked(): void {
    this.opponent = 'Computer';
    this.opponentTypeSelected = true;
    const newGameParams: NewGameModel = {
      username: this.username,
      opponent: this.opponent,
    };

    this.messagesService.add('Your opponent is the game server');
    this.messagesService.add(`Your move, ${this.username} (O)`);
    this.boardLocked = true;
    this.gameService.newGame(newGameParams).subscribe({
      next: (game) => {
        (this.game = game),
          (this.gameId = game.gameId),
          this.copyBoard(game.currentBoard),
          this.toggleBoardLock(game);
      },
      // error: (err) => (this.errorMessage = err),
    });
  }

  resetButtonClicked(): void {
    this.opponent = '';
    this.opponentTypeSelected = false;
    this.playerSelected = false;
    this.filledPositions = 0;
    this.winner = '';
    this.messagesService.clear();
    this.humanOpponent = false;
    this.boardLocked = false;
    this.game = undefined;
    this.gameOver = false;
    this.unblockResponse.gameId = 0;
  }

  positionButtonClicked(position: number): void {
    if (this.game !== undefined) {
      if (this.game.nextMove === this.game.player1) {
        this.board.symbol[position] = this.game.currentBoard.p1Symbol;
      } else {
        this.board.symbol[position] = this.game.currentBoard.p2Symbol;
      }
    } else {
      // current player is initiating the game
      this.board.symbol[position] = 'O';
    }

    // send the appropriate prompt message

    this.messagesService.add('Sending your move to the game server...');
    if (this.humanOpponent) {
      this.messagesService.add('Waiting for opponent to join or move...');
    }

    if (this.game !== undefined) {
      // is it my turn to move?
      if (this.game.nextMove === this.username) {
        // pick up my symbol
        let symbol;
        if (this.username === this.game.player1) {
          symbol = this.game.currentBoard.p1Symbol;
        } else {
          symbol = this.game.currentBoard.p2Symbol;
        }
        if (!this.humanOpponent && !this.gameOver) {
          this.messagesService.add(
            `Your move, ${this.game.nextMove} (${symbol})`
          );
        }
      }
    }

    if (this.gameId > 0) {
      this.position = position;
      const moveParams: MoveModel = {
        username: this.username,
        gameId: this.gameId,
        position: this.position,
      };

      this.boardLocked = true;
      this.gameService.sendMove(moveParams).subscribe({
        next: (game) => {
          (this.game = game),
            (this.gameId = game.gameId),
            (this.winningLine = game.winningLine),
            (this.winner = game.winner),
            this.copyBoard(game.currentBoard),
            this.checkWinOrDraw(game.currentBoard),
            this.unblockOpponent(game),
            this.toggleBoardLock(game),
            this.messagesService.add(
              this.humanOpponent && !this.gameOver
                ? `Your move, ${this.username} (${
                    this.username === this.game.player1
                      ? this.game.currentBoard.p1Symbol
                      : this.game.currentBoard.p2Symbol
                  })`
                : ''
            );
        },
        // error: (err) => (this.errorMessage = err),
      });
    }
  }

  // check for win or draw here
  checkWinOrDraw(currentBoard: ICurrentBoard): void {
    // check for win conditions
    if (this.winningLine > 0) {
      let winningPlayer = this.winner;
      if (this.winner === 'Computer') {
        winningPlayer = 'The computer';
      }
      this.messagesService.add(`${winningPlayer} won the game!`);
      this.gameOver = true;
    } else {
      // There is no winner yet. If one position is left, then game is drawn.
      let filledPositions = 0;
      if (currentBoard.pos0 !== '') {
        filledPositions++;
      }
      if (currentBoard.pos1 !== '') {
        filledPositions++;
      }
      if (currentBoard.pos2 !== '') {
        filledPositions++;
      }
      if (currentBoard.pos3 !== '') {
        filledPositions++;
      }
      if (currentBoard.pos4 !== '') {
        filledPositions++;
      }
      if (currentBoard.pos5 !== '') {
        filledPositions++;
      }
      if (currentBoard.pos6 !== '') {
        filledPositions++;
      }
      if (currentBoard.pos7 !== '') {
        filledPositions++;
      }
      if (currentBoard.pos8 !== '') {
        filledPositions++;
      }
      this.filledPositions = filledPositions;
      if (filledPositions === 8) {
        this.messagesService.add(`This game is a draw`);
        this.gameOver = true;
      }
    }
  }

  copyBoard(currentBoard: ICurrentBoard): void {
    this.board.symbol[0] = currentBoard.pos0;
    this.board.symbol[1] = currentBoard.pos1;
    this.board.symbol[2] = currentBoard.pos2;
    this.board.symbol[3] = currentBoard.pos3;
    this.board.symbol[4] = currentBoard.pos4;
    this.board.symbol[5] = currentBoard.pos5;
    this.board.symbol[6] = currentBoard.pos6;
    this.board.symbol[7] = currentBoard.pos7;
    this.board.symbol[8] = currentBoard.pos8;
  }

  toggleBoardLock(game: IGame): void {
    if (this.humanOpponent) {
      if (this.username !== game.nextMove) {
        this.boardLocked = true;
      } else {
        this.boardLocked = false;
      }
    } else {
      this.boardLocked = false;
    }
  }

  unblockOpponent(game: IGame): void {
    const unblockParams: UnblockModel = {
      issuer: this.username,
      gameId: this.gameId,
      qIndex: 0,
    };

    if (this.humanOpponent && this.gameOver) {
      if (game.winningLine > 0) {
        // it's a win
        if (game.winner === this.username) {
          if (game.winner === game.player1) {
            unblockParams.qIndex = 1;
          } else {
            unblockParams.qIndex = 2;
          }

          if (this.unblockResponse.gameId < 1) {
            // no unblock received earlier, you weren't the one unblocked
            this.gameService.unblock(unblockParams).subscribe({
              next: (u) => {
                (this.unblockResponse.gameId = u.gameId),
                  (this.unblockResponse.issuer = u.issuer),
                  (this.unblockResponse.qIndex = u.qIndex);
              },
              // error: (err) => (this.errorMessage = err),
            });
          }
        }
      } else {
        // it's a draw
        if (game.nextMove === this.username) {
          if (game.nextMove === game.player1) {
            unblockParams.qIndex = 1;
          } else {
            unblockParams.qIndex = 2;
          }

          this.gameService.unblock(unblockParams).subscribe({
            next: (u) => {
              (this.unblockResponse.gameId = u.gameId),
                (this.unblockResponse.issuer = u.issuer),
                (this.unblockResponse.qIndex = u.qIndex);
            },
            // error: (err) => (this.errorMessage = err),
          });
        }
      }
    }
  }
}
