import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, switchMap, tap, throwError } from 'rxjs';
import { Matiere } from '../student-user/matiere.model';

@Injectable({
  providedIn: 'root'
})
export class AdminprofService {

  uri = "http://localhost:8010/api/";
  
  private _listMatieres: BehaviorSubject<Matiere[] | null> = new BehaviorSubject<Matiere[] | null>(null);
  
  constructor(private http: HttpClient) { }

  get listMatieres$(): Observable<any> {
    return this._listMatieres.asObservable();
  }

  getMatieresByProf(id: string): Observable<any> {
    return this.http.get<any>(`${this.uri}matieres/${id}/prof`).pipe(
      map((data: any) => {
        return data;
      }),
      tap((response: any) => {
        this._listMatieres.next(response);
      })
    )
  }
}
