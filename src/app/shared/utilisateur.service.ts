import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin, from, of, throwError } from 'rxjs';
import { catchError, map, mergeMap, switchMap, take, tap } from 'rxjs/operators';
import { Matiere } from '../student-user/matiere.model';
import { Assignment } from '../student-user/assignment.model';
@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  //uri = "http://localhost:8010/api/";
  uri = "https://backassignmentsmdbs-naina-matthieu.onrender.com/api/"
  private _user: BehaviorSubject<any | null> = new BehaviorSubject(null);
  private _listMatieres: BehaviorSubject<Matiere[] | null> = new BehaviorSubject<Matiere[] | null>(null);
  private _matiere: BehaviorSubject<Matiere | null> = new BehaviorSubject<Matiere | null>(null);
  private _assignmentStudent: BehaviorSubject<Assignment[] | null> = new BehaviorSubject<Assignment[] | null>(null);
  constructor(private http: HttpClient) { }

  get user$(): Observable<any> {
    return this._user.asObservable();
  }
  get matiere$(): Observable<any> {
    return this._matiere.asObservable();
  }
  get assignmentStudent$(): Observable<Assignment[] | null> {
    return this._assignmentStudent;
  }

  getUserById(id: string): Observable<any> {
    const url = this.uri + "users/" + id
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
  getMatieresByIduser(id: string): Observable<any> {
    const url = `${this.uri}users/matiere/${id}`;
    console.log(url);

    return this.http.get<any[]>(url).pipe(
      switchMap(matieres => {
        if (!matieres) {
          return throwError(`Matière(s) introuvable pour l'utilisateur avec l'id => ${id} !`);
        }

        return forkJoin(
          matieres.map(matiere => 
            this.getUserById(matiere.professeur_id).pipe(
              map(prof => ({
                ...matiere,
                prof_name: prof.nom,
                prof_mail: prof.email
              }))
            )
          )
        );
      }),
      tap(updatedMatieres => this._listMatieres.next(updatedMatieres))
    );
  }

  getMatiere(id: string | null): Observable<Matiere | null> {
    return this._listMatieres.pipe(
      take(1),
      map((matieres: Matiere[] | null) => {
        const matiere = matieres?.find((mat: Matiere) => mat._id === String(id)) || null;
        this._matiere.next(matiere);
        return matiere;
      })
    );
  }
  getAssignmentByIdStudent_IdMatiere(idMatiere: string | null): Observable<Assignment> {
    // let idEtudiant =  sessionStorage.getItem("idEtudiant");
    let idEtudiant = "663a52b9946fa30b7711db7d";
    // const url = this.uri + "/assignments/663a52b9946fa30b7711db7d/66433f5b0c3e8e917d4e9a6a"
    const url = this.uri + "users/assignments/" + idEtudiant + "/" + idMatiere;
    this._assignmentStudent.next(null);
    console.log(url)
    return this.http.get<any>(url).pipe(
      map((reponse) => {
        this._assignmentStudent.next(reponse);
        return reponse;
      }),
      switchMap((assignments) => {

        if (!assignments) {
          return throwError('Il n\'y a pas d\'assignment pour {idEtudiant:  ' + idEtudiant + ',idMatiere: ' + idMatiere);
        }

        return of(assignments);
      })
    );
  }
  getAssignmentByIdStudent(idEtudiant:string,page: number, limit: number): Observable<any> {
    //let idEtudiant = "663a52b9946fa30b7711db7d";
    const matiereList: any = [];
    const matiereSet = new Set<string>(); // Utilisation d'un ensemble pour suivre les matières demandées
    let count = 0;
    const url = `${this.uri}users/assignments/${idEtudiant}?page=${page}&limit=${limit}`;
  
    return this.http.get<any>(url).pipe(
      mergeMap((response: any) => {
        const listAssignment = response.docs;
        const reponse = response;
  
        const assignmentPromises = listAssignment.map(async (assignment: any) => {
          let matiereIN = matiereList.find((mat: any) => mat._id === assignment.idMatiere);
  
          if (!matiereIN && !matiereSet.has(assignment.idMatiere)) {
            count += 1;
            console.log("Appel à getMatiereById : " + count);
            matiereSet.add(assignment.idMatiere); // Ajout de l'ID de la matière à l'ensemble
  
            const matiereResponse :any= await this.getMatiereById(assignment.idMatiere).toPromise();
  
            // On s'assure qu'il n'y a pas de doublons après avoir récupéré la réponse
            if (!matiereList.some((mat: any) => mat._id === matiereResponse._id)) {
              matiereList.push(matiereResponse);
              console.log("Ajouté à matiereList :", matiereResponse);
            } else {
              console.log("Doublon détecté et évité :", matiereResponse);
            }
  
            assignment.matiere = matiereResponse.Matiere;
            assignment.matiere_img = matiereResponse.image;
            assignment.prof_img = matiereResponse.prof_img;
            assignment.prof_id = matiereResponse.professeur_id;
          } else if (matiereIN) {
            assignment.matiere = matiereIN.Matiere;
            assignment.matiere_img = matiereIN.image;
            assignment.prof_img = matiereIN.prof_img;
            assignment.prof_id = matiereIN.professeur_id;
          }
  
          return assignment;
        });
  
        // Utilisation de Promise.all pour attendre toutes les promesses des assignments
        return from(Promise.all(assignmentPromises)).pipe(
          map((updatedAssignments) => {
            reponse.docs = updatedAssignments;
            console.log("Final matiereList :", matiereList); // Vérification qu'on ait pas de doublons de matiere List c'est à dire qu'on a seulement appeler getMatiereById si la matière n'est pas encore presente
            return reponse;
          })
        );
      })
    );
  }
  getMatiereById(idMatiere: string): Observable<Matiere> {
    const url = this.uri + "matiere/" + idMatiere;
    return this.http.get<any>(url);
  }
  getListEtudiants(): Observable<any>{
    const url = this.uri + "eleves";
    return this.http.get<any>(url);
  }
  rendreAssignments(assignments:any): Observable<any>{
    const url = `${this.uri}user/rendre`;
    const data = {
      listAssignment : assignments
    }
    return this.http.post<any>(url,data);
  }
  getAllAssignments(page: number, limit: number): Observable<any>{
    const matiereList: any = [];
    const matiereSet = new Set<string>(); // Utilisation d'un ensemble pour suivre les matières demandées
    let count = 0;
    const url = `${this.uri}assignments?page=${page}&limit=${limit}`;
    return this.http.get<any>(url).pipe(
      mergeMap((response: any) => {
        const listAssignment = response.docs;
        const reponse = response;
  
        const assignmentPromises = listAssignment.map(async (assignment: any) => {
          let matiereIN = matiereList.find((mat: any) => mat._id === assignment.idMatiere);
  
          if (!matiereIN && !matiereSet.has(assignment.idMatiere)) {
            count += 1;
            console.log("(ALL ASIGN)Appel à getMatiereById : " + count);
            matiereSet.add(assignment.idMatiere); // Ajout de l'ID de la matière à l'ensemble
  
            const matiereResponse :any= await this.getMatiereById(assignment.idMatiere).toPromise();
  
            // On s'assure qu'il n'y a pas de doublons après avoir récupéré la réponse
            if (!matiereList.some((mat: any) => mat._id === matiereResponse._id)) {
              matiereList.push(matiereResponse);
              console.log("(ALL ASIGN) Ajouté à matiereList :", matiereResponse);
            } else {
              console.log("(ALL ASIGN) Doublon détecté et évité :", matiereResponse);
            }
  
            assignment.matiere = matiereResponse.Matiere;
            assignment.matiere_img = matiereResponse.image;
            assignment.prof_img = matiereResponse.prof_img;
            assignment.prof_id = matiereResponse.professeur_id;
          } else if (matiereIN) {
            assignment.matiere = matiereIN.Matiere;
            assignment.matiere_img = matiereIN.image;
            assignment.prof_img = matiereIN.prof_img;
            assignment.prof_id = matiereIN.professeur_id;
          }
  
          return assignment;
        });
  
        // Utilisation de Promise.all pour attendre toutes les promesses des assignments
        return from(Promise.all(assignmentPromises)).pipe(
          map((updatedAssignments) => {
            reponse.docs = updatedAssignments;
            console.log("(ALL ASIGN)Final matiereList :", matiereList); // Vérification qu'on ait pas de doublons de matiere List c'est à dire qu'on a seulement appeler getMatiereById si la matière n'est pas encore presente
            return reponse;
          })
        );
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
