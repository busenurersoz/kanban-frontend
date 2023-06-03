import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { User } from '@core/interfaces/user';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = false;
  subjectUser$ = new BehaviorSubject<boolean>(null);
  constructor(private router: Router) {
    
    this.autoLogin();
  }

  login() {
    this.isLoggedIn = true;
    localStorage.setItem('isLoggedIn', 'true');
    // this.router.navigateByUrl('/workspaces/all');
    this.subjectUser$.next(true);
  }

  logout() {
    this.isLoggedIn = false;
    localStorage.clear();
    this.router.navigateByUrl('/auth');
  }

  autoLogin() {
    if (localStorage.getItem('isLoggedIn')) {
      this.login();
    }
  }
}
