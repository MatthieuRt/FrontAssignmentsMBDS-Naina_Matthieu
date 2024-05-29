import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { AdminprofService } from '../shared/adminprof.service';
import { Subject, takeUntil } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { Assignment } from '../assignments/assignment.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-prof',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, MatIconModule,CommonModule],
  templateUrl: './admin-prof.component.html',
  styleUrl: './admin-prof.component.css'
})
export class AdminProfComponent {
  
  @Output() selectionChange = new EventEmitter<number>();

  listeMatieres : any;
  userConnected : any;
  listeAssignments : any;
  selected : any;
  selectedAssignment : any

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private _unsubscribeAssignments: Subject<any> = new Subject<any>();

  constructor(private adminprofService: AdminprofService){}

  ngOnInit(){
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

  select(event: MatSelectChange){
    this.listeAssignments = null;
    const selectedMatiereId = event.value;
    this.selectionChange.emit(selectedMatiereId);

    this.adminprofService.getAssignmentsByMatiere(selectedMatiereId).subscribe();

    this.adminprofService.listAssignments$.pipe(takeUntil(this._unsubscribeAssignments))
      .subscribe((response: any) => {
        this.listeAssignments = response;
      })
  }

  selectAssignmentForDetail(assignment: Assignment) {
    this.selectedAssignment = assignment;
  }

  resetSelectedAssignment() {
    this.selectedAssignment = undefined;
  }
}
