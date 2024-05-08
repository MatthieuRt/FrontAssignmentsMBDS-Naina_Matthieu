import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError} from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  uri = "http://localhost:8010/api/users";

  constructor(private http:HttpClient) { }

  getUser(id:string):Observable<any|undefined> {
    return this.http.get<any>(this.uri + "/" + id)
    .pipe(
           catchError(this.handleError<any>('### catchError: getUtilisateur by id avec id=' + id))
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
