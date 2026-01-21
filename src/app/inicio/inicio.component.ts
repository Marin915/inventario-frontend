import { Component } from '@angular/core';
import { AuthService } from '../auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  imports: [],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
  template: `
    <h1>Página protegida</h1>
    <button (click)="logout()">Cerrar sesión</button>
  `
})
export class LoginComponent {
  username = '';
  password = '';
  error = false;

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.error = false;
    if (this.auth.login(this.username, this.password)) {
      this.router.navigate(['/inicio']);
    } else {
      this.error = true;
    }
  }
}