import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  authenticate(
    username: string | undefined,
    password: string | undefined
  ): Observable<any> {
    return this.http
      .post<string>(
        `${environment.auth.url}${environment.auth.endpoint}`,
        { username, password },
        { responseType: 'text' as 'json' }
      )
      .pipe(
        tap(
          (data) => console.log('Token: ' + JSON.stringify(data)),
          catchError(this.handleError<any>('authenticate'))
        )
      );
  }

  register(username: string, password: string): Observable<any> {
    return this.http
      .post<string>(
        `${environment.auth.url}${environment.auth.endpoint}${environment.auth.register}`,
        { username, password },
        { responseType: 'text' as 'json' }
      )
      .pipe(
        tap(
          (data) => console.log('Token: ' + JSON.stringify(data)),
          catchError(this.handleError<any>('register'))
        )
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T): any {
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
