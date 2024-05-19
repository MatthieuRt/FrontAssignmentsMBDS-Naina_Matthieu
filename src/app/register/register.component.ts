import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

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
  email: string='';
  password: string='';
  confirmPassword: string='';
  role: string=''

  constructor() { }

  register(): void {
    // Vérifier si les mots de passe correspondent
    if (this.password !== this.confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }

    // Si les mots de passe correspondent, procédez à l'enregistrement de l'utilisateur
    // Vous pouvez implémenter ici la logique pour envoyer les données du formulaire au backend
    // et traiter la réponse
    console.log('Email:', this.email);
    console.log('Mot de passe:', this.password);
    console.log('Confirmation du mot de passe:', this.confirmPassword);

    // Réinitialiser les champs du formulaire après l'enregistrement
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
  }
}
