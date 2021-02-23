import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IGame } from '../models/game';
import { NewGameModel } from '../models/newGameModel';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { MoveModel } from '../models/moveModel';
import { MessagesService } from './messages.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(
    private http: HttpClient,
    private messagesService: MessagesService
  ) {}

  newGame(newGameParams: NewGameModel): Observable<IGame> {
    this.messagesService.add('Initializing game with game server...');
    return this.http
      .post<IGame>(
        `${environment.game.baseurl}${environment.game.endpoint}${environment.game.new}`,
        {
          username: newGameParams.username,
          opponent: newGameParams.opponent,
        }
      )
      .pipe(
        tap((data) => console.log('Response: ' + JSON.stringify(data)))
        // catchError(this.handleError)
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
        tap((data) => console.log('Response: ' + JSON.stringify(data)))
        // catchError(this.handleError)
      );
  }

  // private handleError(err: HttpErrorResponse): Observable<never> {
  //   // in a real world app, we may send the server to some remote logging infrastructure
  //   // instead of just logging it to the console
  //   let errorMessage = '';
  //   if (err.error instanceof ErrorEvent) {
  //     // A client-side or network error occurred. Handle it accordingly.
  //     errorMessage = `An error occurred: ${err.error.message}`;
  //   } else {
  //     // The backend returned an unsuccessful response code.
  //     // The response body may contain clues as to what went wrong,
  //     errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
  //   }
  //   console.error(errorMessage);
  //   return throwError(errorMessage);
  // }
}
