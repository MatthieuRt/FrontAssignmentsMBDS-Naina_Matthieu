import { Injectable } from '@angular/core';
import { Assignment } from '../assignments/assignment.model';
import { BehaviorSubject, Observable, forkJoin, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { LoggingService } from './logging.service';
import { HttpClient } from '@angular/common/http';

// importation des données de test
import { bdInitialAssignments } from './data';
import { Matiere } from '../student-user/matiere.model';

@Injectable({
  providedIn: 'root'
})
export class AssignmentsService {
  assignments: Assignment[] = [];

  constructor(private logService: LoggingService,
    private http: HttpClient) { }

  uri = 'http://localhost:8010/api';
  //uri = "https://angularmbdsmadagascar2024.onrender.com/api/assignments";

  private _matieres: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  private _etudiants: BehaviorSubject<any[] | null> = new BehaviorSubject<any[] | null>(null);

  get matieres$(): Observable<any> {
    return this._matieres.asObservable();
  }

  get etudiants$(): Observable<any> {
    return this._etudiants.asObservable();
  }

  getMatieres(): Observable<any> {
    return this.http.get<any>(`${this.uri}/matieres`).pipe(
      map((data: any) => {
        this._matieres.next(data)
        return data
      }),
      tap((response: any[]) => {
        this._matieres.next(response);
      })
    )
  }

  getEtudiantsParMatiere(idMatiere:string): Observable<any[]> {
    return this.http.get<any>(`${this.uri}/matieres/${idMatiere}/etudiants`).pipe(
      map((data: any) => {
        return data;
      }),
      tap((response: any) => {
        this._etudiants.next(response);
      })
    )
  }

  getEtudiants(): Observable<any[]> {
    return this.http.get<any>(`${this.uri}/users`).pipe(
      map((data: any) => {
        return data;
      }),
      tap((response: any) => {
        this._etudiants.next(response);
      })
    )
  }

  // retourne tous les assignments
  getAssignments(): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(this.uri);
  }

  getAssignmentsPagines(page: number, limit: number): Observable<any> {
    return this.http.get<Assignment[]>(this.uri + "?page=" + page + "&limit=" + limit);
  }

    // ajoute un assignment et retourne une confirmation
    noterAssignment(assignments: any): Observable<any> {
      return this.http.patch(`${this.uri}/assignments`, assignments);
    }

  // renvoie un assignment par son id, renvoie undefined si pas trouvé
  getAssignment(id: number): Observable<Assignment | undefined> {
    return this.http.get<Assignment>(this.uri + "/" + id)
      .pipe(
        catchError(this.handleError<any>('### catchError: getAssignments by id avec id=' + id))
        /*
        map(a => {
          a.nom += " MODIFIE PAR LE PIPE !"
          return a;
        }),
        tap(a => console.log("Dans le pipe avec " + a.nom)),
        map(a => {
          a.nom += " MODIFIE UNE DEUXIEME FOIS PAR LE PIPE !";
          return a;
        })
        */
      );
    //let a = this.assignments.find(a => a.id === id);
    //return of(a);
  }

  // Methode appelée par catchError, elle doit renvoyer
  // i, Observable<T> où T est le type de l'objet à renvoyer
  // (généricité de la méthode)
  private handleError<T>(operation: any, result?: T) {
    return (error: any): Observable<T> => {
      console.log(error); // pour afficher dans la console
      console.log(operation + ' a échoué ' + error.message);

      return of(result as T);
    }
  };

  // ajoute un assignment et retourne une confirmation
  addAssignment(assignment: any): Observable<any> {
    //this.assignments.push(assignment);
    this.logService.log(assignment.nom, "ajouté");
    //return of("Assignment ajouté avec succès");
    return this.http.post(`${this.uri}/assignments`, assignment);
  }

  updateAssignment(assignment: any): Observable<any> {
    // l'assignment passé en paramètre est le même objet que dans le tableau
    // plus tard on verra comment faire avec une base de données
    // il faudra faire une requête HTTP pour envoyer l'objet modifié
    this.logService.log(assignment.nom, "modifié");
    const uri =`${this.uri}/assignments`;
    return this.http.put<Assignment>(uri, assignment);
  }

  deleteAssignment(assignment: Assignment): Observable<any> {
    // on va supprimer l'assignment dans le tableau
    //let pos = this.assignments.indexOf(assignment);
    //this.assignments.splice(pos, 1);
    this.logService.log(assignment.nom, "supprimé");
    //return of("Assignment supprimé avec succès");
    return this.http.delete(this.uri + "/" + assignment._id);
  }

  // VERSION NAIVE (on ne peut pas savoir quand l'opération des 1000 insertions est terminée)
  peuplerBD() {
    // on utilise les données de test générées avec mockaroo.com pour peupler la base
    // de données
    bdInitialAssignments.forEach(a => {
      let nouvelAssignment = new Assignment();
      nouvelAssignment.nom = a.nom;
      nouvelAssignment.dateDeRendu = new Date(a.dateDeRendu);
      nouvelAssignment.rendu = a.rendu;

      this.addAssignment(nouvelAssignment)
        .subscribe(() => {
          console.log("Assignment " + a.nom + " ajouté");
        });
    });
  }

  peuplerBDavecForkJoin(): Observable<any> {
    let appelsVersAddAssignment: Observable<any>[] = [];

    bdInitialAssignments.forEach(a => {
      const nouvelAssignment = new Assignment();
      nouvelAssignment.nom = a.nom;
      nouvelAssignment.dateDeRendu = new Date(a.dateDeRendu);
      nouvelAssignment.rendu = a.rendu;

      appelsVersAddAssignment.push(this.addAssignment(nouvelAssignment))
    });

    return forkJoin(appelsVersAddAssignment);
  }


}
