import { Component, OnInit } from '@angular/core';
import { UtilisateurService } from '../shared/utilisateur.service';
import { Router, RouterLink } from '@angular/router';
import { Matiere } from './matiere.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-user',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './student-user.component.html',
  styleUrl: './student-user.component.css'
})
export class StudentUserComponent implements OnInit {

  listMatiere: Matiere[] = [];
  MatieresFiltree: Matiere[] = [];
  page = 1;
  limit = 10;
  user: any;
  totalDocs !: number;
  totalPages !: number;
  nextPage !: number;
  prevPage !: number;
  hasNextPage !: boolean;
  hasPrevPage !: boolean;
  searchTerm: string = '';

  constructor(private userServ: UtilisateurService, private router: Router) { }
  ngOnInit() {
    this.getMatiereByUserIdFromService();
  }
  getMatiereByUserIdFromService() {
    const userstring: string | null = localStorage.getItem("USER");
    if (userstring) {
      this.user = JSON.parse(userstring);
      // this.userServ.getMatieresByIduser('663a52b9946fa30b7711db7d').subscribe(
      this.userServ.getMatieresByIduser(this.user._id).subscribe(
        (data) => {
          this.listMatiere = data;
          this.MatieresFiltree = this.listMatiere
          console.log(this.listMatiere)
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  versMatiereDetail(id: string) {
    this.router.navigate(['matiere/detail/' + id]);
  }
  filterMatieres(): void {
    if (this.searchTerm) {
      this.MatieresFiltree = this.listMatiere.filter(matiere =>
        matiere.Matiere.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.MatieresFiltree = this.listMatiere
    }

  }
}
