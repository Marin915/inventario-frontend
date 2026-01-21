import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { eraseSessionStorage, getSessionStorage, setSessionStorage } from '../../Api/OAuth';
import { ENDPOINTS_API_PRIVATE, URL_LOGOUT, URL_REDIRECT } from '../../Api/ApiServiceCore';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth-service.service';


interface AdmGral {
  Descripcion: string;
  Id_admgeneral: string;
}


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  selectedMenuOption = '';

  isOpen = false;
  capturaVisible = false;
  adminAGP = false;
  comboAGs = false;
  showModal = false;
  selectAdm = false;

  adminSelected = '';
  selectedDropdownOption = '';
  nameAdmin = '';
  idAdmin = '';

  catAdmGral = [];
  catAdmGralUsu: AdmGral[] = [];
  pasoLogin: string | null = null;
  token: string | null = null;
  idCountUsu: string | null = '';

  navOptions = [
    { page: 'home' },
    { page: 'cartaInvitacion' },
  ];

  

  constructor(private router: Router, private  auth: AuthService) { }

  ngOnInit(): void {
    this.pasoLogin = getSessionStorage('loginSGE');
    this.token = getSessionStorage('token');
    if (this.pasoLogin === '1' || this.pasoLogin === '2') {
      this.handleLogin(this.pasoLogin);
    }
  }

  navigateTo(page: string) {
   
    this.selectedMenuOption = page;
    console.log('selectedMenuOption:', this.selectedMenuOption);
    this.router.navigate([page]);
  }

  toggleSubmenu(menuOption: string) {
    this.selectedMenuOption = this.selectedMenuOption === menuOption ? '' : menuOption;
  }

  selectMenu(option: string) {
  this.selectedMenuOption = option;
  this.navigateTo('/home');
}



  redirectToLogout() {
    eraseSessionStorage('token');
    eraseSessionStorage('loginSGE');
    this.router.navigate([`${URL_LOGOUT}`]);
  }

  async loginPrivado() {
    console.log("login");
    const vlogin = getSessionStorage("loginSGE");
    const code = getSessionStorage("code");
    console.log(code);
    console.log(vlogin);
    this.eraseVlogin();
    // Verificamos si ya redirigió a Oauth
    if (!vlogin) {
      this.redirectToLogin();
    } else {
      this.handleLogin(vlogin);
    }
  }

  eraseVlogin() {
    const vlogin = getSessionStorage("loginSGE");
    const code = getSessionStorage("code");

    if (vlogin === "1" && !code || code === "null") {
      console.log("login 1 y code null");
      eraseSessionStorage("loginSGE");
      eraseSessionStorage("code");
      this.loginPrivado();
      // window.location.reload();
    }
  }

  redirectToLogin() {
    console.log("redirect login")
    setSessionStorage("loginSGE", "1");
    window.location.href = `${ENDPOINTS_API_PRIVATE.identidad.login}?redirect_uri=${URL_REDIRECT}`;
  }

  handleLogin(vlogin: string | null) {
    if (vlogin === "1") {
      const code = new URLSearchParams(window.location.search).get('code');
      const state = new URLSearchParams(window.location.search).get('state');
      const scope = new URLSearchParams(window.location.search).get('scope');

      setSessionStorage('code', code || '');

      if (code && state && scope) {
        console.log("entra callIdentityAPI");
        this.callIdentityAPI(code, state, scope);
      }
    }
    if (vlogin === "2") {
      setSessionStorage("loginSGE", "done");
      const tkn3 = new URLSearchParams(window.location.search).get('tkn');
      if (tkn3) setSessionStorage("token", tkn3);
      const jwtToken = getSessionStorage("token");
      window.location.reload();
    }
  }

  callIdentityAPI(code: string, state: string, scope: string) {
    console.log('redirect token 1');
    window.location.href = `${ENDPOINTS_API_PRIVATE.identidad.token}?Code=${code}&State=${state}&Scope=${scope}`;
    const tkn = new URLSearchParams(window.location.search).get('tkn');

    if (tkn) {
      setSessionStorage('token', tkn);
    } else {
      this.redirectToToken(code, state, scope);
    }
  }

  redirectToToken(code: string, state: string, scope: string) {
    setSessionStorage('loginSGE', '2');
    console.log('redirect token 2');
    window.location.href = `${ENDPOINTS_API_PRIVATE.identidad.token}?Code=${code}&State=${state}&Scope=${scope}`;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
