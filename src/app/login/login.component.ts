import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../shared/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatInputModule,
    HttpClientModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService,private router:Router) { }

  ngOnInit(){
    if(localStorage.getItem("USER")){
      this.router.navigate(['/'])
    }
  }

  login() {
    //logique de connexion
    this.authService.logIn(this.email,this.password).subscribe(
      (response)=>{
        if(response){
          let userConnected = localStorage.getItem("USER")
          if(userConnected){   
            if(JSON.parse(userConnected).role=='eleve'){
              this.router.navigate(['/student'])
            }else if(JSON.parse(userConnected).role=='prof'){
              this.router.navigate(['/dashboard'])
            }else{
              this.router.navigate(['/student/assignment'])
            }
          }
        }
      },(error)=>{
        alert('Nom d utilisateur ou mdp erroné')
      }
    )
  }
}
