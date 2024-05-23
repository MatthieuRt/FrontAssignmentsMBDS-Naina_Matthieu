import { Component, ElementRef, Renderer2 } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { DropzoneCdkModule, FileInputValidators, FileInputValue } from '@ngx-dropzone/cdk';
import { DropzoneMaterialModule } from '@ngx-dropzone/material';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-matiere',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    DropzoneCdkModule,
    DropzoneMaterialModule,
    MatChipsModule,
    MatInputModule,
    MatButtonModule,],
  templateUrl: './matiere.component.html',
  styleUrl: './matiere.component.css'
})
export class MatiereComponent {
  validators = [FileInputValidators.accept("image/*"),Validators.required];
  matiereImg = new FormControl<any>(null, this.validators);
  createMatiereForm: FormGroup = this.formBuilder.group({
    nomMatiere: ['', Validators.required],
    matiereImg : this.matiereImg
  });;

  constructor(private formBuilder: FormBuilder) {
  }
  clear() {
    console.log(this.matiereImg.value)
    this.matiereImg.setValue(null);
  }
  onSubmit() {
    if (this.createMatiereForm.valid) {
      console.log('Formulaire soumis avec succès !');
      console.log(this.createMatiereForm)
    } else {
      console.log('Veuillez remplir tous les champs requis.');
    }
  }
}
