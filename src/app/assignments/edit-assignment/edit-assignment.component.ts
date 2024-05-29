import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Assignment } from '../assignment.model';
import { AssignmentsService } from '../../shared/assignments.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-assignment',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule,
  ],
  templateUrl: './edit-assignment.component.html',
  styleUrl: './edit-assignment.component.css',
})
export class EditAssignmentComponent implements OnInit {
  assignment: any | undefined;
  // Pour les champs de formulaire
  nomAssignment = '';
  dateDeRendu?: Date = undefined;
  description = ''
  user :any;
  constructor(
    private assignmentsService: AssignmentsService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditAssignmentComponent>
  ) {}

  ngOnInit() {
    this.assignment = this.data.assignment
    this.user = this.data.user
    if(this.assignment){
      this.nomAssignment = this.assignment.nom;
      this.dateDeRendu = this.assignment.dateDeRendu;
      this.description = this.assignment.instruction;
    }
    
  }

  onSaveAssignment() {
    if (!this.assignment) return;
    if (this.nomAssignment == '' || this.description == ''|| this.dateDeRendu === undefined) return;
    console.log(this.nomAssignment+"=>(ancien) : "+this.assignment.nom)
    console.log(this.dateDeRendu+"=>(ancien) : "+this.assignment.dateDeRendu)
    console.log(this.description+"=>(ancien) : "+this.assignment.instruction)
    // on récupère les valeurs dans le formulaire
    this.assignment.nom = this.nomAssignment;
    this.assignment.dateDeRendu = this.dateDeRendu;
    this.assignment.instruction = this.description;
    this.assignmentsService
      .updateAssignment(this.assignment)
      .subscribe((message) => {
        console.log(message);
        //if(this.user.role=='admin'){this.router.navigate(['/student/assignment']);}
        this.dialogRef.close();
      });
  }
}
