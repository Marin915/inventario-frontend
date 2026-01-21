import { Injectable } from '@angular/core';
import { AuthService } from './auth-service.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
  
})


@Component({
  selector: 'app-login',
  template: `
  <form (submit)="login()">
    <input type="text" [(ngModel)]="username" name="username" placeholder="Usuario" required />
    <input type="password" [(ngModel)]="password" name="password" placeholder="Contraseña" required />
    <button type="submit">Entrar</button>
    <p *ngIf="error" style="color:red;">Usuario o contraseña incorrectos</p>
  </form>
  `
})

export class LoginService {
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
  }}
function Component(arg0: { selector: string; template: string; }): (target: typeof LoginService) => void | typeof LoginService {
  throw new Error('Function not implemented.');
}

