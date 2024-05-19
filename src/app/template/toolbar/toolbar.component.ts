import { Component } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent {
  userConnected : any = {}
  constructor(private authService: AuthService,private router: Router){}

  ngOnInit(){
    const local = localStorage.getItem("USER")
    if(local){
      this.userConnected = JSON.parse(local)
    }
    
  }

  logOut(){
    this.authService.logOut()
    this.router.navigate(['/login'])
  }
}
