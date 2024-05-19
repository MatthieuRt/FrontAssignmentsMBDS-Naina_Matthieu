import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  uri = "http://localhost:8010/api/users";

  // propriété pour savoir si l'utilisateur est connecté
  loggedIn = false;

  constructor(private http: HttpClient) { }

  // méthode pour connecter l'utilisateur
  // Typiquement, il faudrait qu'elle accepte en paramètres
  // un nom d'utilisateur et un mot de passe, que l'on vérifierait
  // auprès d'un serveur...
  logIn(email: string, password: string): Observable<any> {
    let body = { email, password };
    return this.http.post<any>(this.uri + "/login", body)
      .pipe(
        map((response) => {
          let user = JSON.stringify(response.user);
          localStorage.setItem("TOKEN_KEY", response.token);
          localStorage.setItem("USER", user);
          this.loggedIn = true;
          return true;
        }),
        catchError((error) => {
          return error;
        })
      );
  }

  // méthode pour déconnecter l'utilisateur
  logOut() {
    this.loggedIn = false;
    localStorage.clear();
  }

  // methode qui indique si on est connecté en tant qu'admin ou pas
  // pour le moment, on est admin simplement si on est connecté
  // En fait cette méthode ne renvoie pas directement un booleén
  // mais une Promise qui va renvoyer un booléen (c'est imposé par
  // le système de securisation des routes de Angular)
  //
  // si on l'utilisait à la main dans un composant, on ferait:
  // this.authService.isAdmin().then(....) ou
  // admin = await this.authService.isAdmin()
  isAdmin() {
    const promesse = new Promise((resolve, reject) => {
      // ici accès BD? Web Service ? etc...
      resolve(this.loggedIn);
      // pas de cas d'erreur ici, donc pas de reject
    });

    return promesse;
  }

  isLoggedIn(){
    const promesse = new Promise((resolve, reject) => {
      // vérifie si USER existe dans localStorage
      resolve(localStorage.getItem("USER")!==null);
      // pas de cas d'erreur ici, donc pas de reject
    });

    return promesse;
  }
}
