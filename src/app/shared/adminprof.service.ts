import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, switchMap, tap, throwError } from 'rxjs';
import { Matiere } from '../student-user/matiere.model';

@Injectable({
  providedIn: 'root'
})
export class AdminprofService {

  //uri = "http://localhost:8010/api/";
  uri = "https://backassignmentsmdbs-naina-matthieu.onrender.com/api/"
  
  private _listMatieres: BehaviorSubject<Matiere[] | null> = new BehaviorSubject<Matiere[] | null>(null);
  private _listAssignments: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  
  constructor(private http: HttpClient) { }

  get listMatieres$(): Observable<any> {
    return this._listMatieres.asObservable();
  }

  get listAssignments$(): Observable<any> {
    return this._listAssignments.asObservable()
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

  getAssignmentsByMatiere(id: string): Observable<any> {
    return this.http.get<any>(`${this.uri}assignments/${id}/matiere`).pipe(
      map((data: any) => {
        return data;
      }),
      tap((response: any) => {
        this._listAssignments.next(response);
      })
    )
  }
}
