import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { AdminprofService } from '../shared/adminprof.service';
import { Subject, takeUntil } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { Assignment } from '../assignments/assignment.model';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Matiere } from '../student-user/matiere.model';
import Swal from 'sweetalert2';
import { AssignmentsService } from '../shared/assignments.service';

@Component({
  selector: 'app-admin-prof',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, MatIconModule, CommonModule, DragDropModule],
  templateUrl: './admin-prof.component.html',
  styleUrl: './admin-prof.component.css'
})
export class AdminProfComponent {

  @Output() selectionChange = new EventEmitter<number>();

  listeMatieres: any;
  userConnected: any;
  listeAssignments: any = []
  selected: any;
  selectedAssignment: any
  listeAssignmentsNonNotes: any;
  listToRender: any = []

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private _unsubscribeAssignments: Subject<any> = new Subject<any>();

  constructor(private adminprofService: AdminprofService, private _changeDetectorRef: ChangeDetectorRef,private assignmentService : AssignmentsService) { }

  ngOnInit() {
    const userItem = localStorage.getItem("USER");
    if (userItem) {
      this.userConnected = JSON.parse(userItem);
    }
    console.log(this.userConnected)

    this.adminprofService.getMatieresByProf(this.userConnected._id).subscribe();

    this.adminprofService.listMatieres$.pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response: any) => {
        this.listeMatieres = response;
      })
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  select(event: MatSelectChange) {
    this.listeAssignments = null;
    const selectedMatiereId = event.value;
    this.selectionChange.emit(selectedMatiereId);

    this.adminprofService.getAssignmentsByMatiere(selectedMatiereId).subscribe();

    this.adminprofService.listAssignments$.pipe(takeUntil(this._unsubscribeAssignments))
      .subscribe((response: any[]) => {
        this.listeAssignments = response;
        if (response) {
          this.listeAssignmentsNonNotes = response.filter(assignment => assignment.note === 0 && assignment.rendu && assignment.remarques === '')
        }

      })
  }

  selectAssignmentForDetail(assignment: Assignment) {
    this.selectedAssignment = assignment;
  }

  resetSelectedAssignment() {
    this.selectedAssignment = undefined;
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      console.log('dropped Event', `> dropped '${event.item.data}' into '${event.container.id}'`);
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      console.log('dropped Event', `> dropped '${event.item.data}' into '${event.container.id}'`);
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this._changeDetectorRef.detectChanges();
    }

    this.pre = `
    listeAssignment:
    ${JSON.stringify(this.listeAssignments, null, ' ')}

    listTorender:
    ${JSON.stringify(this.listToRender, null, ' ')}`;
  }

  pre = `
  listeAssignment:
  ${JSON.stringify(this.listeAssignments, null, ' ')}

  listTorender:
  ${JSON.stringify(this.listToRender, null, ' ')}`;

  enleverAssignmentToRender(torender: Matiere) {
    const index = this.listToRender.indexOf(torender);
    if (index !== -1) {
      this.listeAssignmentsNonNotes.push(torender);
      this.listToRender.splice(index, 1);
    }
  }

  async noter() {
    const assignments = this.listToRender.map((element: any) => element._id);
    const { value: formValues } = await Swal.fire({
      title: "Note et remarques",
      html: `
      <div style="display: flex; flex-direction: column;">
        <label for="swal-input1">Note:</label>
        <input id="swal-input1" class="swal2-input">
        <label for="swal-input2">Remarque:</label>
        <textarea id="swal-input2" class="swal2-input"></textarea>
      </div>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const input1 = document.getElementById("swal-input1") as HTMLInputElement;
        const input2 = document.getElementById("swal-input2") as HTMLTextAreaElement;
        if (input1 && input2) {
          return [
            input1.value,
            input2.value
          ];
        }
        return;
      }
    });
    if (formValues) {
      let note = formValues[0];
      let remarques = formValues[1]

      let body = { assignments, note, remarques }
      this.assignmentService.noterAssignment(body).subscribe(
        (res:any)=>{
          Swal.fire("Assignment(s) noté(s) avec succès !");
        }
      )
    }
  }
}
