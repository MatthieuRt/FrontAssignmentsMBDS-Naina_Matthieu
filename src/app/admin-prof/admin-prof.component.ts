import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AdminprofService } from '../shared/adminprof.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-admin-prof',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule],
  templateUrl: './admin-prof.component.html',
  styleUrl: './admin-prof.component.css'
})
export class AdminProfComponent {
  
  listeMatieres : any;
  userConnected : any;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private adminprofService: AdminprofService){}

  ngOnInit(){
    const userItem = localStorage.getItem("USER");
    if (userItem) {
      this.userConnected = JSON.parse(userItem);
    }
    console.log(this.userConnected)

    this.adminprofService.getMatieresByProf(this.userConnected._id).subscribe();

    this.adminprofService.listMatieres$.pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response: any) => {
        this.listeMatieres = response;
      })
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
