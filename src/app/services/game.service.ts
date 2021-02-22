import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IGame } from '../models/game';
import { NewGameModel } from '../models/newGameModel';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private http: HttpClient) {}

  newGame(newGameParams: NewGameModel): Observable<IGame> {
    return this.http.post<IGame>(
      `${environment.game.baseurl}${environment.game.endpoint}${environment.game.new}`,
      {
        username: newGameParams.username,
        opponent: newGameParams.opponent,
      }
    );
  }
}
