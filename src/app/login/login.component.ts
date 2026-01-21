import { Component } from '@angular/core';
import { AuthService } from '../auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
   template: `
  <form (submit)="login()">
    <input type="text" [(ngModel)]="username" name="username" placeholder="Usuario" required />
    <input type="password" [(ngModel)]="password" name="password" placeholder="Contraseña" required />
    <button type="submit">Entrar</button>
    <p *ngIf="error" style="color:red;">Usuario o contraseña incorrectos</p>
  </form>
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
