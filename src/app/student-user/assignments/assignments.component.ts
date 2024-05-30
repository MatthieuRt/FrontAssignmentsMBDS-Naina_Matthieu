import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UtilisateurService } from '../../shared/utilisateur.service';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatTable, MatTableModule } from '@angular/material/table';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDialog,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { DetailAssignmentModalComponent } from './detail-assignment-modal/detail-assignment-modal.component';
import { EditAssignmentComponent } from '../../assignments/edit-assignment/edit-assignment.component';

@Component({
  selector: 'app-assignments',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatTable,
    MatTableModule,
    MatPaginatorModule,
    MatSliderModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,

  ],
  templateUrl: './assignments.component.html',
  styleUrl: './assignments.component.css'
})
export class AssignmentsComponent implements OnInit {
  page = 1;
  limit = 10;
  totalDocs !: number;
  totalPages !: number;
  nextPage !: number;
  prevPage !: number;
  hasNextPage !: boolean;
  hasPrevPage !: boolean;
  listAssignments: any;
  filtreControl = new FormControl('');
  resetList: any;
  user: any;
  title:string = 'Liste de vos assignments'
  constructor(private userServ: UtilisateurService, private _changeDetectorRef: ChangeDetectorRef, public dialog: MatDialog) { }
  ngOnInit() {
    const userstring: string | null = localStorage.getItem("USER");
    if (userstring) {
      this.user = JSON.parse(userstring);
      this.getAssignmentsFromService();
      this.filtreControl.valueChanges.subscribe(value => {
        if (value != null) {
          this.handleFilterChange(value);
        }
      });
    }

  }
  getAssignmentsFromService() {
    if (this.user.role == "admin") {
      this.title = "Liste de tous les assignments"
      this.userServ.getAllAssignments(this.page, this.limit)
        .subscribe((response: any) => {
          console.log(response)
          this.listAssignments = response.docs;
          this.resetList = this.listAssignments;
          this.totalDocs = response.totalDocs;
          this.totalPages = response.totalPages;
          this.nextPage = response.nextPage;
          this.prevPage = response.prevPage;
          this.hasNextPage = response.hasNextPage;
          this.hasPrevPage = response.hasPrevPage;
          console.log('List All of assignments:', this.listAssignments);
        })
    } else {
      this.userServ.getAssignmentByIdStudent(this.user._id, this.page, this.limit)
        .subscribe((response: any) => {
          // console.log(response)
          this.listAssignments = response.docs;
          this.resetList = this.listAssignments;
          this.totalDocs = response.totalDocs;
          this.totalPages = response.totalPages;
          this.nextPage = response.nextPage;
          this.prevPage = response.prevPage;
          this.hasNextPage = response.hasNextPage;
          this.hasPrevPage = response.hasPrevPage;
          console.log('List of assignments:', this.listAssignments);

          // this.totalDocs = response.totalDocs;
          // console.log('Total docs:', this.totalDocs);

          // this.totalPages = response.totalPages;
          // console.log('Total pages:', this.totalPages);

          // this.nextPage = response.nextPage;
          // console.log('Next page:', this.nextPage);

          // this.prevPage = response.prevPage;
          // console.log('Previous page:', this.prevPage);

          // this.hasNextPage = response.hasNextPage;
          // console.log('Has next page:', this.hasNextPage);

          // this.hasPrevPage = response.hasPrevPage;
          // console.log('Has previous page:', this.hasPrevPage);
        })
    }
  }
  
  pagePrecedente() {
    this.page = this.prevPage;
    this.getAssignmentsFromService();
  }
  pageSuivante() {
    this.page = this.nextPage;
    this.getAssignmentsFromService();
  }

  premierePage() {
    this.page = 1;
    this.getAssignmentsFromService();
  }

  dernierePage() {
    this.page = this.totalPages;
    this.getAssignmentsFromService();
  }

  handlePageEvent(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    console.log("handlePageEvent/ limit = " + this.limit)
    this.getAssignmentsFromService();
  }

  handleFilterChange(value: string | null): void {
    this.listAssignments = this.resetList
    switch (value) {
      case "note":
        this.listAssignments = this.listAssignments.filter((assignment: any) => assignment.remarques != null)
        break
      case "enAttente":
        this.listAssignments = this.listAssignments.filter((assignment: any) => assignment.rendu == true && assignment.remarques == null)
        break
      case "toNote":
        this.listAssignments = this.listAssignments.filter((assignment: any) => assignment.rendu == false)
        break
      default:
        this.listAssignments = this.resetList
        break
    }
  }
  reset() {
    this.listAssignments = this.resetList
    this._changeDetectorRef.detectChanges();
  }
  openDialog(idAssignment: string) {
    const assign = this.listAssignments.find((assignment: any) => assignment._id == idAssignment);
    console.log(assign)
    console.log("____________________________")
    this.dialog.open(DetailAssignmentModalComponent, {
      data: {
        assignment: assign,
      },
    });
  }
  openEditDialog(idAssignment: string) {
    const assign = this.listAssignments.find((assignment: any) => assignment._id == idAssignment);
    this.dialog.open(EditAssignmentComponent, {
      data: {
        assignment: assign,
        user : this.user
      },
    });
  }
}
