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
import { MatiereService } from '../shared/matiere.service';
import Swal from 'sweetalert2';
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
export class MatiereComponent implements OnInit {
  validators = [FileInputValidators.accept("image/*"), Validators.required];
  matiereImg = new FormControl<any>(null, this.validators);
  professeurImg = new FormControl<any>(null, this.validators);
  eleves = new FormControl('');

  listEtudiant: any;
  createMatiereForm: FormGroup = this.formBuilder.group({
    nomMatiere: ['', Validators.required],
    matiereImg: this.matiereImg,
    etudiants: [this.eleves, Validators.required],
    professeur_img: this.professeurImg
  });;

  constructor(private formBuilder: FormBuilder, private imgServ: ImageService,
    private userServ: UtilisateurService, private matiereServ: MatiereService
  ) {
  }
  ngOnInit(): void {
    this.userServ.getListEtudiants().subscribe((response: any) => {
      this.listEtudiant = response
    })
  }
  clear(form: string) {
    if (form == 'matiereImg') {
      console.log(this.matiereImg.value)
      this.matiereImg.setValue(null);
    } else {
      this.professeurImg.setValue(null);
    }
  }
  onSubmit() {
    if (this.createMatiereForm.valid && this.eleves.valid) {
      console.log('Formulaire soumis avec succès !');
      let listEtudiantTemp: any = this.eleves.value
      const listEleveToAssign = listEtudiantTemp.map((idEtudiant: string) => idEtudiant.split('_')[0]);
      const fileDataMatiere = this.createMatiereForm.controls['matiereImg'].value
      const fileDataProf = this.createMatiereForm.controls['professeur_img'].value
      this.imgServ.convertFileToBase64(fileDataMatiere)
        .then(base64Matiere => {
          const base64Image_Matiere = 'data:' + fileDataMatiere.type + ';base64,' + base64Matiere;
          this.imgServ.convertFileToBase64(fileDataProf).then(base64Prof => {
            const base64Image_Prof = 'data:' + fileDataMatiere.type + ';base64,' + base64Prof;
            const userItem = localStorage.getItem("USER");
            let prof_id = ''
            if (userItem) {
              prof_id = JSON.parse(userItem)._id
            }
            const data = {
              nom: this.createMatiereForm.value.nomMatiere,
              toAssign: listEleveToAssign,
              matiere_img: base64Image_Matiere,
              professeur_id: prof_id,
              prof_img: base64Image_Prof
            }
            console.log(data)
            this.matiereServ.insertMatiere(data).subscribe(
              (res:any)=>{
                Swal.fire({
                  text: "Matière ajoutée avec succès!",
                  icon: "success",
                  showConfirmButton: false
                });
                window.location.reload();
              }
            )
          }).catch(erreur => {
            console.error('Erreur lors de la conversion du fichier du professeur:', erreur);
          })
        }).catch(error => {
          console.error('Erreur lors de la conversion du fichier de la matiere:', error);
        });
    } else {
      console.log('Veuillez remplir tous les champs requis.');
    }
  }

  affiche(chaine: string | undefined) {
    return (chaine) ? chaine.split("_")[1] : ''
  }
}
