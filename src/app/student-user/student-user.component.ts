import { Component, OnInit } from '@angular/core';
import { UtilisateurService } from '../shared/utilisateur.service';
import { Router, RouterLink } from '@angular/router';
import { Matiere } from './matiere.model';

@Component({
  selector: 'app-student-user',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './student-user.component.html',
  styleUrl: './student-user.component.css'
})
export class StudentUserComponent implements OnInit{
  
  listMatiere:Matiere[] = [];
  page = 1;
  limit = 10;
  totalDocs !: number;
  totalPages !: number;
  nextPage !: number;
  prevPage !: number;
  hasNextPage !: boolean;
  hasPrevPage !: boolean;

  constructor(private userServ: UtilisateurService, private router: Router) { }
  ngOnInit() {
    this.getMatiereByUserIdFromService();
  }
  getMatiereByUserIdFromService() {
    this.userServ.getMatieresByIduser('663a52b9946fa30b7711db7d').subscribe(
      (data) => {
        this.listMatiere = data;
        console.log(this.listMatiere)
      },
      (error) => {
        console.error(error);
      }
    );
  }

  versMatiereDetail(id: string) {
    console.log("===================================================================")
    console.log(id);
    this.router.navigate(['matiere/detail/' + id]);
  }
}
