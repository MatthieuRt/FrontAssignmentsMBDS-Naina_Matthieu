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
  constructor(){
    const userstring: string | null = localStorage.getItem("USER");
    if (userstring) {
      this.user = JSON.parse(userstring);
      if(this.user.role=='eleve'){
        this.assigmentRouteLabel = 'Vos assignments'
      }
    }
  }
}
