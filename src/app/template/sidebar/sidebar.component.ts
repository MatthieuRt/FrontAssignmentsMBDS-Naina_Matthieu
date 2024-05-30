import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  user:any;
  assigmentRouteLabel:string='Tous les assignments ';
  isProf : boolean = false;
  isAdmin : boolean = false;
  isEtudiant : boolean = false;
  constructor(){
    const userstring: string | null = localStorage.getItem("USER");
    if (userstring) {
      this.user = JSON.parse(userstring);
      if(this.user.role=='eleve'){
        this.isEtudiant = true;
        this.assigmentRouteLabel = 'Vos assignments'
      }
      if(this.user.role=='prof'){
        this.isProf=true
      }
      if(this.user.role=='admin'){
        this.isAdmin = true;
      }
    }
  }
}
