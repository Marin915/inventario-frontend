import { Component } from '@angular/core';
import { AuthService } from '../auth-service.service';
import { CanActivate, Router } from '@angular/router';

@Component({
  selector: 'app-auth-guard',
  imports: [],
  templateUrl: './auth-guard.component.html',
  styleUrl: './auth-guard.component.css'
})
export class AuthGuardComponent implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.auth.isLoggedIn()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
