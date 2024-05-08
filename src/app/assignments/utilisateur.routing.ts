import { Route } from '@angular/router';
import { ListAssignmentsComponent } from "./list-assignments/list-assignments.component";
import { DetailMatiereComponent } from './list-assignments/detail-matiere/detail-matiere.component';
import { MatiereResolver } from './utilisateur.resolvers';


export const UtilisateurRoutes: Route[] = [
    {
        path     : '',
        component: ListAssignmentsComponent,
        children : [
            {
                path     : ':id',
                component: DetailMatiereComponent,
                resolve  : {
                    matiere: MatiereResolver
                }
            },
                
        ]
    }
];
