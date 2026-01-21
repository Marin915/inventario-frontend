import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private USER_KEY = 'user';

  login(username: string, password: string): boolean {
    if(username === 'Conavi' && password === 'Grupo586') {
      const encoded = btoa(`${username}:${password}`);
      localStorage.setItem(this.USER_KEY, encoded);
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem(this.USER_KEY);
  }

  getAuthHeader(): string | null {
    const credentials = localStorage.getItem(this.USER_KEY);
    return credentials ? 'Basic ' + credentials : null;
  }

  isLoggedIn(): boolean {
    return this.getAuthHeader() !== null;
  }
}