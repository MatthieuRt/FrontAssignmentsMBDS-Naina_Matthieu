import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Matiere } from '../matiere.model';
import { UtilisateurService } from '../../shared/utilisateur.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Assignment } from '../assignment.model';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { response } from 'express';
@Component({
  selector: 'app-detail-matiere',
  standalone: true,
  imports: [CommonModule,
    MatIcon,
    MatIconModule,
    DragDropModule,
    MatSidenavModule,
  ],
  templateUrl: './detail-matiere.component.html',
  styleUrl: './detail-matiere.component.css'
})
export class DetailMatiereComponent implements OnInit, OnDestroy {
  matiere: any;
  matiereDetail: Matiere | undefined;
  assignmentToRender: Matiere[] = [];
  listAssignment: any[] = [];
  listAssignmentNonRendu: any[] = [];
  listToRender: any[] = [];
  totalNonRendu: number = 0;
  totalAssignment: number = 0;
  professeur: any;

  selectedAssignment: Assignment | undefined;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private userServ: UtilisateurService, private router: Router,
    private _changeDetectorRef: ChangeDetectorRef, public dialog: MatDialog) {
  }
  ngOnInit(): void {
    console.log("Appel  de DetailMatiereComponent ")
    this.userServ.matiere$.pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response) => {
        this.matiere = response;
        this.userServ.getUserById(this.matiere.professeur_id).subscribe((resp) => {
          this.professeur = resp
          console.log(this.professeur)
        })
      })
      this.getAssignmentsEtudiantsFromService();
  }
  getAssignmentsEtudiantsFromService() {
    this.userServ.assignmentStudent$.pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response: any) => {
        if (response != null && response != undefined) {
          this.listAssignment = response.docs;
          this.totalAssignment = this.listAssignment.length
          this.listAssignment.forEach((devoir: any) => {
            if (!devoir.rendu) {
              this.listAssignmentNonRendu.push(devoir)
            }
          })
          this.totalNonRendu = this.listAssignmentNonRendu.length
          console.log(this.listAssignment)
        }
        this._changeDetectorRef.detectChanges();
      })
  }
  /**
    * On destroy
    */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
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
    ${JSON.stringify(this.listAssignment, null, ' ')}

    listTorender:
    ${JSON.stringify(this.listToRender, null, ' ')}`;
  }
  pre = `
    listeAssignment:
    ${JSON.stringify(this.listAssignment, null, ' ')}

    listTorender:
    ${JSON.stringify(this.listToRender, null, ' ')}`;
  enleverAssignmentToRender(torender: Matiere) {
    const index = this.listToRender.indexOf(torender);
    if (index !== -1) {
      this.listAssignmentNonRendu.push(torender);
      this.listToRender.splice(index, 1);
    }
  }
  selectAssignmentForDetail(assignment: Assignment) {
    this.selectedAssignment = assignment;
  }
  resetSelectedAssignment() {
    this.selectedAssignment = undefined;
  }
  rendreOneOrManyAssignment() {
    const ids_assignments = this.listToRender.map(assignment => assignment._id);
    // console.log(ids_assignments)
    this.userServ.rendreAssignments(ids_assignments).subscribe((response: any) => {
      this.userServ.getAssignmentByIdStudent_IdMatiere(this.matiere._id)
      .subscribe((response: any) => {
        if (response != null && response != undefined) {
          this.listAssignment = response.docs;
          this.totalAssignment = this.listAssignment.length
          this.listAssignment.forEach((devoir: any) => {
            if (!devoir.rendu) {
              this.listAssignmentNonRendu.push(devoir)
            }
          })
          this.totalNonRendu = this.listAssignmentNonRendu.length
          console.log(this.listAssignment)
        }
        this.openDialog(response.n)
        this._changeDetectorRef.detectChanges();
      })
    })
  }

  openDialog(nbRender: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        nbAssignmentRendu: nbRender,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.listToRender = []
    });
  }
}
