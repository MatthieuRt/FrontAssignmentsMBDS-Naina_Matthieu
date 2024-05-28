import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialogTitle,
  MatDialogContent, MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { UtilisateurService } from '../../../shared/utilisateur.service';
import { CommonModule } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-detail-assignment-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogTitle,
    MatDialogContent,
    MatIconModule,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,],
  templateUrl: './detail-assignment-modal.component.html',
  styleUrl: './detail-assignment-modal.component.css'
})
export class DetailAssignmentModalComponent implements OnInit {
  professeur: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private userServ: UtilisateurService
  ) {
  }
  ngOnInit(): void {
    this.userServ.getUserById(this.data.assignment.prof_id).subscribe((resp) => {
      this.professeur = resp
      console.log(this.professeur)
    })
  }

}
