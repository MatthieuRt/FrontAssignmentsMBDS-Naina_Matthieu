import { Component, OnInit } from '@angular/core';
import { UtilisateurService } from '../../shared/utilisateur.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-list-assignments',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './list-assignments.component.html',
  styleUrl: './list-assignments.component.css'
})
export class ListAssignmentsComponent implements OnInit {

  user:any = [];
  constructor(private userServ : UtilisateurService,private router:Router){}
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
  versDetail(id:string){
    this.router.navigate(['/list/'+id]);
  }
}
