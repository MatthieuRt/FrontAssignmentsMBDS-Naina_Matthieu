import { Component, OnInit } from '@angular/core';
import { UtilisateurService } from '../../../shared/utilisateur.service';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detail-matiere',
  standalone: true,
  imports: [],
  templateUrl: './detail-matiere.component.html',
  styleUrl: './detail-matiere.component.css'
})
export class DetailMatiereComponent implements OnInit {

  matiere: any;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private userServ: UtilisateurService, private router: Router) {
  }
  ngOnInit(): void {
    console.log("Appel  de DetailMatiereComponent ")
    this.userServ.user$.pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response) => {
        this.matiere = response;
        console.log(response);
      })


  }

}
