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
      const fileData = this.createMatiereForm.controls['matiereImg'].value
      const blob = new Blob([fileData], { type: fileData.type });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileData.name;
      link.click();
      // window.URL.revokeObjectURL(url);
      this.moveFileToAssetsFolder()
    } else {
      console.log('Veuillez remplir tous les champs requis.');
    }
  }
  moveFileToAssetsFolder() {
    // Récupérez les données du fichier à partir du formulaire
    const fileData = this.createMatiereForm.controls['matiereImg'].value;

    // Déplacez le fichier vers le dossier "assets"
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const uint8Array = new Uint8Array(arrayBuffer);
      // Ensuite, vous pouvez envoyer ce tableau d'octets vers votre serveur si nécessaire
      console.log('File moved to assets folder:', uint8Array);
    };
    reader.onerror = error => console.error('Error reading file:', error);
    reader.readAsArrayBuffer(fileData);
  }
}
