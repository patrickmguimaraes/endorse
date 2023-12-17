import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthNegativoGuard implements CanActivate {
  
  constructor(private authService: AuthenticationService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise<boolean>(async (res, rej) => {
      const isLogged = await this.authService.isLogged();

      if(isLogged) {
        this.router.navigate(['']);
        res(false);
      }
      else {
        res(true);
      }
    });
  }
}
