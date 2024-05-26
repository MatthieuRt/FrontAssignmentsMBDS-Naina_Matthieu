import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { DropzoneCdkModule, FileInputValidators, FileInputValue } from '@ngx-dropzone/cdk';
import { DropzoneMaterialModule } from '@ngx-dropzone/material';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ImageService } from '../shared/image.service';
import { MatSelectModule } from '@angular/material/select';
import { UtilisateurService } from '../shared/utilisateur.service';
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
    MatButtonModule,
    MatSelectModule],
  templateUrl: './matiere.component.html',
  styleUrl: './matiere.component.css'
})
export class MatiereComponent implements OnInit{
  validators = [FileInputValidators.accept("image/*"),Validators.required];
  matiereImg = new FormControl<any>(null, this.validators);
  eleves = new FormControl('');

  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  listEtudiant :any;
  createMatiereForm: FormGroup = this.formBuilder.group({
    nomMatiere: ['', Validators.required],
    matiereImg : this.matiereImg,
    etudiants : [this.eleves,Validators.required]
  });;

  constructor(private formBuilder: FormBuilder,private imgServ : ImageService,
              private userServ : UtilisateurService
  ) {
  }
  ngOnInit(): void {
    this.userServ.getListEtudiants().subscribe((response:any)=>{
      this.listEtudiant = response
    })
  }
  clear() {
    console.log(this.matiereImg.value)
    this.matiereImg.setValue(null);
  }
  onSubmit() {
    if (this.createMatiereForm.valid && this.eleves.valid) {
      console.log('Formulaire soumis avec succès !');
      let listEtudiantTemp : any = this.eleves.value
      const listEleveToAssign = listEtudiantTemp.map((idEtudiant :string) => idEtudiant.split('_')[0]);
      const fileData = this.createMatiereForm.controls['matiereImg'].value
      this.imgServ.convertFileToBase64(fileData)
      .then(base64String => {
        const base64Image = 'data:' + fileData.type + ';base64,' + base64String;
        const data = {
          nom : this.createMatiereForm.value.nomMatiere,
          toAssign : listEleveToAssign,
          matiere_img : base64Image
        }
        console.log(data)
      }).catch(error => {
        console.error('Erreur lors de la conversion du fichier:', error);
      });
    } else {
      console.log('Veuillez remplir tous les champs requis.');
    }
  }
 
  affiche(chaine : string | undefined){
    return (chaine)  ? chaine.split("_")[1] : ''
  }
}
