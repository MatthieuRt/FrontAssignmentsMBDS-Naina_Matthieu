import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { Matiere } from '../assignments/matiere.model';
@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  uri = "http://localhost:8010/api/users";
  private _user: BehaviorSubject<any | null> = new BehaviorSubject(null);
  private _matiere: BehaviorSubject<Matiere | null> = new BehaviorSubject<Matiere | null>(null);
  constructor(private http: HttpClient) { }

  get user$(): Observable<any[]> {
    return this._user.asObservable();
  }
  getUser(id: string | null): Observable<any | undefined> {
    return this.http.get<any>(this.uri + "/" + id)
      .pipe(
        catchError(this.handleError<any>('### catchError: getUtilisateur by id avec id=' + id))
      );

  }
  getUserById(id: string): Observable<any> {
    console.log("efa natsoina");
    const url = this.uri + "/" + id
    return this.http.get<any>(url).pipe(
      take(1),
      map((reponse) => {
        this._user.next(reponse);
        return reponse;
      }),
      switchMap((user) => {

        if (!user) {
          return throwError('Pas d\' utilisateur avec l\'id => ' + id + '!');
        }

        return of(user);
      })
    );
  }
  getMatiere(id: string|null): Observable<Matiere | null> {
    return this._user.pipe(
      take(1),
      map(user => {
        const matiere = user.matieres.find((mat: Matiere) => mat.id === Number(id)) || null;
        this._matiere.next(matiere);
        console.log(matiere)
        return matiere;
      })
    );
  }


  private handleError<T>(operation: any, result?: T) {
    return (error: any): Observable<T> => {
      console.log(error); // pour afficher dans la console
      console.log(operation + ' a échoué ' + error.message);

      return of(result as T);
    }
  };
}
