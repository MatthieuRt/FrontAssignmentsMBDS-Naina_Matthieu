import { Component, OnInit } from '@angular/core';
import { UtilisateurService } from '../../../shared/utilisateur.service';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Matiere } from '../../matiere.model';

@Component({
  selector: 'app-detail-matiere',
  standalone: true,
  imports: [CommonModule,MatIconModule,],
  templateUrl: './detail-matiere.component.html',
  styleUrl: './detail-matiere.component.css'
})
export class DetailMatiereComponent implements OnInit {

  matiere: any;
  matiereDetail:Matiere | undefined;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private userServ: UtilisateurService, private router: Router) {
  }
  ngOnInit(): void {
    console.log("Appel  de DetailMatiereComponent ")
    this.userServ.matiere$.pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response) => {
        this.matiere = response;
        console.log("-----------------------------------------")
        console.log(response);
        console.log("--------------------------------------------------------")
      })


  }

}
