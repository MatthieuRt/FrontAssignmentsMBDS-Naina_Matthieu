import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { UtilisateurService } from "../shared/utilisateur.service";
import { Observable, catchError, map, throwError } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class MatiereResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _userService: UtilisateurService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        // alert("MatiereResolver")
        return this._userService.getMatiere(route.paramMap.get('id'))
            .pipe(
                map(()=>{
                    this._userService.getAssignmentByIdStudent_IdMatiere(route.paramMap.get('id')).subscribe();
                }),
                // Error here means the requested task is not available
                catchError((error) => {

                    // Log the error
                    console.error(error);

                    // Get the parent url
                    const parentUrl = state.url.split('/').slice(0, -1).join('/');
                    this._router.navigateByUrl("/student");

                    // Throw an error
                    return throwError(error);
                })
            );
    }
}