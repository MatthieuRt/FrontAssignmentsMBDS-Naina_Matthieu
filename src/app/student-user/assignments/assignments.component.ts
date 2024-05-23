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
import { BrowserModule } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';

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
    MatIconModule
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
  resetList :any;
  constructor(private userServ: UtilisateurService,private _changeDetectorRef: ChangeDetectorRef) { }
  ngOnInit() {
    this.getAssignmentsFromService();
    this.filtreControl.valueChanges.subscribe(value => {
      if (value != null) {
        this.handleFilterChange(value);
      }
    });
  }
  getAssignmentsFromService() {
    this.userServ.getAssignmentByIdStudent(this.page, this.limit)
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
    // this.getAssignmentsFromService();
  }

  handleFilterChange(value: string | null): void {
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
  reset(){
    this.listAssignments = this.resetList
    this._changeDetectorRef.detectChanges();
  }
}
