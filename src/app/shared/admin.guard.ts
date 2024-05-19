import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const adminGuard: CanActivateFn = (route, state) => {

  // injection du service d'authentification
  const authService = inject(AuthService);
  // injection du router
  const router = inject(Router);

  return authService.isAdmin()
    .then(admin => {
        if (admin) {
            
          console.log("Admin");
          return true;
        } else {
          console.log("Pas admin");
          router.navigate(['/']);
          return false;
        }
      }
    );

};
