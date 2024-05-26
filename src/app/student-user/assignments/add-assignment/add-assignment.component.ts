import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AssignmentsService } from '../../../shared/assignments.service';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, startWith } from 'rxjs/operators';
import { AsyncPipe, CommonModule } from '@angular/common';


@Component({
  selector: 'app-add-assignment',
  standalone: true,
  imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    AsyncPipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './add-assignment.component.html',
  styleUrl: './add-assignment.component.css'
})
export class AddAssignmentComponent {

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  myControl = new FormControl('');
  listeMatieres: any
  listeEtudiants: any
  filteredOptions: Observable<any> = new Observable;

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl0: ['', Validators.required],
    secondCtrl1: ['', Validators.required],
  });
  thirdFormGroup = this._formBuilder.group({
    thirdCtrl: ['', Validators.required],
  });
  fourthFormGroup = this._formBuilder.group({
    fourthCtrl: ['', Validators.required],
  });
  isLinear = false;

  constructor(private _formBuilder: FormBuilder, private assignmentService: AssignmentsService) { }

  ngOnInit() {
    this.assignmentService.getMatieres().subscribe();
    this.assignmentService.getEtudiants().subscribe();
    this.assignmentService.matieres$.pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response: any) => {
        this.listeMatieres = response;
      })

    this.assignmentService.etudiants$.pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response: any) => {
        this.listeEtudiants = response?.docs;
      })
  }

  loadMatieres() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        if (typeof value === 'string') {
          const filterValue = value.toLowerCase();
          return this.listeMatieres
            .filter((listeMatiere: any) => listeMatiere.Matiere.toLowerCase().includes(filterValue))
            .map((listeMatiere: any) => listeMatiere);
        } else {
          return [];
        }
      })
    );
  }

  enregistrer() {
    const nom = this.firstFormGroup.get('firstCtrl')?.value;
    const dateDeRendu = this.secondFormGroup.get('secondCtrl1')?.value;
    let idMatiere = this.myControl.value
    idMatiere = this.listeMatieres.find((element: any) => element.Matiere === idMatiere)?._id;
    const instruction = this.thirdFormGroup.get('thirdCtrl')?.value;
    const etudiants = this.fourthFormGroup.get('fourthCtrl')?.value;

    const body = {etudiants,idMatiere,nom,instruction,dateDeRendu}
    this.assignmentService.addAssignment(body).subscribe(
      (res: any) => {
        console.log("REUSSI", res);
      }
    );
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
