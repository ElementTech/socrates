import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, ActivatedRoute, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private auth: AuthenticationService, private router: Router,private actRoute: ActivatedRoute) {
  
  }


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let url: string = state.url;
    return this.checkUserLogin(next, url);
  }

  checkUserLogin(route: ActivatedRouteSnapshot, url: any): boolean {
      if (this.auth.isLoggedIn()) {
        if (!this.auth.isAdmin() && route.data['role'] == 'ROLE_ADMIN') {
          this.router.navigate(['/unauthorized']);
          return false;
        }
        return true;
      }
      else
      {
        this.router.navigate(['/login']);
        return false;
      }
    }
}