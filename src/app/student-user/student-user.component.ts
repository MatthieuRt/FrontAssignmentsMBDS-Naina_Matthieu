import { Component, OnInit } from '@angular/core';
import { UtilisateurService } from '../shared/utilisateur.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-student-user',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './student-user.component.html',
  styleUrl: './student-user.component.css'
})
export class StudentUserComponent implements OnInit{
  user: any = [];
  constructor(private userServ: UtilisateurService, private router: Router) { }
  ngOnInit() {
    this.getUserByIdFromService();
  }
  getUserByIdFromService() {
    this.userServ.getUserById('663a52b9946fa30b7711db7d').subscribe(
      (data) => {
        this.user = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }
  versMatiereDetail(id: string) {
    this.router.navigate(['matiere/detail/' + id]);
  }
}
