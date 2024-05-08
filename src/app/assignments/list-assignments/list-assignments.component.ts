import { Component } from '@angular/core';
import { UtilisateurService } from '../../shared/utilisateur.service';

@Component({
  selector: 'app-list-assignments',
  standalone: true,
  imports: [],
  templateUrl: './list-assignments.component.html',
  styleUrl: './list-assignments.component.css'
})
export class ListAssignmentsComponent {

  user:any = [];
  constructor(private userServ : UtilisateurService){}
  ngOnInit() {
    this.getUserByIdFromService();
  }
  getUserByIdFromService(){
    this.userServ.getUser('663a52b9946fa30b7711db7d').subscribe(data=>{
      this.user=data;
    })
  }
}
