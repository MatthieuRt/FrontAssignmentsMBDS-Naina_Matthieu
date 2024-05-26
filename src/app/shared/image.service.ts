import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor() { }

  // Fonction pour transformer un fichier en Base64
  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1]; // Récupération de la chaîne Base64
        resolve(base64String);
      };

      // Callback en cas d'erreur
      reader.onerror = error => reject(error);

      // La lecture du fichier
      reader.readAsDataURL(file);
    });
  }
}
