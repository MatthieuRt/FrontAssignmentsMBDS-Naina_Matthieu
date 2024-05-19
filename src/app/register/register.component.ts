import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatInputModule,
    HttpClientModule,
    MatFormField,
    MatOption,
    MatSelectModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  name: string=''
  email: string='';
  password: string='';
  confirmPassword: string='';
  role: string=''

  constructor(private router: Router,private authService: AuthService) { }

  ngOnInit(){
    if(localStorage.getItem("USER")){
      this.router.navigate(['/'])
    }
  }

  register(): void {
    // Vérifier si les mots de passe correspondent
    if (this.password !== this.confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }

    this.authService.register(this.name,this.email,this.password,this.role).subscribe(
      (response)=>{
        this.router.navigate(['/'])
      },(error)=>{
        alert('Une erreur est survenue, veuillez réessayer')
      }
    )
  }
}
