import { Component, OnInit } from '@angular/core';
import { UtilisateurService } from '../../../shared/utilisateur.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-detail-matiere',
  standalone: true,
  imports: [],
  templateUrl: './detail-matiere.component.html',
  styleUrl: './detail-matiere.component.css'
})
export class DetailMatiereComponent implements OnInit {
  
  matiere:any;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(private userServ : UtilisateurService){
  }
  ngOnInit(): void {
    alert("AAAA")
    console.log("Appel  de DetailMatiereComponent ")
    this.userServ.user$.pipe(takeUntil(this._unsubscribeAll))
    .subscribe((response) => {
      this.matiere = response;
      console.log(response);
    })
  }

}
