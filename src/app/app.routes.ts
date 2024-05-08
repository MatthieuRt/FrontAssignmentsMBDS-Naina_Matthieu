import { Routes } from '@angular/router';
import { AssignmentsComponent } from './assignments/assignments.component';
import { AddAssignmentComponent } from './assignments/add-assignment/add-assignment.component';
import { AssignmentDetailComponent } from './assignments/assignment-detail/assignment-detail.component';
import { EditAssignmentComponent } from './assignments/edit-assignment/edit-assignment.component';
import { authGuard } from './shared/auth.guard';
import { TemplateComponent } from './template/template/template.component';
import { ToolbarComponent } from './template/toolbar/toolbar.component';
import { ContainerComponent } from './template/container/container.component';
import { ListAssignmentsComponent } from './assignments/list-assignments/list-assignments.component';
import { LoginComponent } from './login/login.component';
import { UtilisateurRoutes } from './assignments/utilisateur.routing';
import { DetailMatiereComponent } from './assignments/list-assignments/detail-matiere/detail-matiere.component';
import { MatiereResolver } from './assignments/utilisateur.resolvers';

export const routes: Routes = [
  {
    path: 'login', component: LoginComponent
  },
  {
    path: '', component: TemplateComponent, children:
      [
        {
          path: 'home', component: AssignmentsComponent
        },
        {
          path: 'test/:id', component: DetailMatiereComponent,
          resolve: {
            matiere: MatiereResolver
          }
        },
        {
          path: 'list', component: ListAssignmentsComponent,
          children: [
            {
              path: ':id',
              component: DetailMatiereComponent,
              resolve: {
                matiere: MatiereResolver
              }
            }
          ]
        }
      ]
  },
  { path: "add", component: AddAssignmentComponent },
  { path: "assignment/:id", component: AssignmentDetailComponent },
  {
    path: "assignment/:id/edit",
    component: EditAssignmentComponent,
    canActivate: [authGuard]
  }
];
