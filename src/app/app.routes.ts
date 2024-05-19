import { Routes } from '@angular/router';
// import { AssignmentsComponent } from './assignments/assignments.component';
import { AddAssignmentComponent } from './assignments/add-assignment/add-assignment.component';
import { AssignmentDetailComponent } from './assignments/assignment-detail/assignment-detail.component';
import { EditAssignmentComponent } from './assignments/edit-assignment/edit-assignment.component';
import { authGuard } from './shared/auth.guard';
import { TemplateComponent } from './template/template/template.component';
import { ToolbarComponent } from './template/toolbar/toolbar.component';
import { ContainerComponent } from './template/container/container.component';
import { LoginComponent } from './login/login.component';
import { StudentUserComponent } from './student-user/student-user.component';
import { DetailMatiereComponent } from './student-user/detail-matiere/detail-matiere.component';
import { MatiereResolver } from './student-user/utilisateur.resolvers';
import { AssignmentsComponent } from './student-user/assignments/assignments.component';
import { RegisterComponent } from './register/register.component';
import { adminGuard } from './shared/admin.guard';

export const routes: Routes = [
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'register', component: RegisterComponent
  },
  {
    path: '', component: TemplateComponent,canActivate: [authGuard], children:
      [
        // {
        //   path: 'home', component: AssignmentsComponent
        // },
        {
          path: 'student', component: StudentUserComponent,
        },
        {
          path: 'matiere/detail/:id', component: DetailMatiereComponent,
          resolve: {
            matiere: MatiereResolver
          }
        },
        {
          path: 'student/assignment', component: AssignmentsComponent,
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
