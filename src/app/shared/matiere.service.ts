import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MatiereService {

  uri = "http://localhost:8010/api/";

  constructor(private http: HttpClient) { }

  insertMatiere(body:any){
    return this.http.post(this.uri+'matiere',body)
  }
}
