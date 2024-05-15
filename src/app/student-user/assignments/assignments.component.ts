import { Component, OnInit } from '@angular/core';
import { UtilisateurService } from '../../shared/utilisateur.service';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import {MatTable, MatTableModule} from '@angular/material/table';
import {PageEvent, MatPaginatorModule} from '@angular/material/paginator';
import {MatCardModule} from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'
@Component({
  selector: 'app-assignments',
  standalone: true,
  imports: [ 
    CommonModule,
    FormsModule, 
    MatButtonModule,
    MatTable, MatTableModule, MatPaginatorModule,
    MatSliderModule,MatCardModule],
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
  listAssignments : any;

  constructor(private userServ: UtilisateurService){}
  ngOnInit() {
    this.getAssignmentsFromService();
  }
  getAssignmentsFromService(){
    this.userServ.getAssignmentByIdStudent(this.page, this.limit)
    .subscribe((response:any)=>{
      // console.log(response)
      this.listAssignments = response.docs;
      this.totalDocs = response.totalDocs;
      this.totalPages = response.totalPages;
      this.nextPage = response.nextPage;
      this.prevPage = response.prevPage;
      this.hasNextPage = response.hasNextPage;
      this.hasPrevPage = response.hasPrevPage;

      console.log('List of assignments:', this.listAssignments);

      this.totalDocs = response.totalDocs;
      console.log('Total docs:', this.totalDocs);

      this.totalPages = response.totalPages;
      console.log('Total pages:', this.totalPages);

      this.nextPage = response.nextPage;
      console.log('Next page:', this.nextPage);

      this.prevPage = response.prevPage;
      console.log('Previous page:', this.prevPage);

      this.hasNextPage = response.hasNextPage;
      console.log('Has next page:', this.hasNextPage);

      this.hasPrevPage = response.hasPrevPage;
      console.log('Has previous page:', this.hasPrevPage);
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
    this.getAssignmentsFromService();
  }
}
