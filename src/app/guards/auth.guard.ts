import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthenticationService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise<boolean>(async (res, rej) => {
      const isLogged = await this.authService.isLogged();

      if(isLogged) {
        res(true);
      }
      else {
        if(state.url=='/') {
          this.router.navigate(['/login']);
        }
        else {
          this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        }

        res(false);
      }
    });
  }
}
