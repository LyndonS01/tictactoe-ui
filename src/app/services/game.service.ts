import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IGame } from '../models/game';
import { NewGameModel } from '../models/newgame-model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { MoveModel } from '../models/move-model';
import { MessagesService } from './messages.service';
import { UnblockModel } from '../models/unblock-model';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(
    private http: HttpClient,
    private messagesService: MessagesService
  ) {}

  newGame(newGameParams: NewGameModel): Observable<IGame> {
    return this.http
      .post<IGame>(
        `${environment.game.baseurl}${environment.game.endpoint}${environment.game.new}`,
        {
          username: newGameParams.username,
          opponent: newGameParams.opponent,
        }
      )
      .pipe(
        tap((data) => console.log('Response: ' + JSON.stringify(data))),
        catchError(this.handleError<IGame>('newGame'))
      );
  }

  sendMove(moveParams: MoveModel): Observable<IGame> {
    return this.http
      .post<IGame>(
        `${environment.game.baseurl}${environment.game.endpoint}${environment.game.move}`,
        {
          username: moveParams.username,
          gameId: moveParams.gameId,
          position: moveParams.position,
        }
      )
      .pipe(
        tap((data) => console.log('Response: ' + JSON.stringify(data))),
        catchError(this.handleError<IGame>('sendMove'))
      );
  }

  unblock(unblockParams: UnblockModel): Observable<any> {
    return this.http
      .get<any>(
        `${environment.game.baseurl}${environment.game.endpoint}${environment.game.unblock}?gameId=${unblockParams.gameId}&id=${unblockParams.qIndex}`
      )
      .pipe(
        tap(
          (data) =>
            console.log('Unblock Message from: ' + JSON.stringify(data)),
          catchError(this.handleError<any>('unblock'))
        )
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
