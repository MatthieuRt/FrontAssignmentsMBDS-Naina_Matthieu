import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Matiere } from '../matiere.model';
import { UtilisateurService } from '../../shared/utilisateur.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
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
export class DetailMatiereComponent implements OnInit, OnDestroy  {
  matiere: any;
  matiereDetail: Matiere | undefined;
  assignmentToRender: Matiere[] = [];
  listAssignment: any[] = [];
  listToRender: any[] = [];

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private userServ: UtilisateurService, private router: Router,
    private _changeDetectorRef: ChangeDetectorRef,) {
  }
  ngOnInit(): void {
    console.log("Appel  de DetailMatiereComponent ")
    this.userServ.matiere$.pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response) => {
        this.matiere = response;
        this.matiere.assignments.forEach((devoir: any) => {
          if (!devoir.rendu) {
            this.listAssignment.push(devoir)
          }
        });
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
      this.listAssignment.push(torender);
      this.listToRender.splice(index, 1);
    }
  }
}
