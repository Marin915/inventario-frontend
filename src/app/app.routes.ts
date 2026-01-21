import { Routes } from '@angular/router';
import { MaterialesComponent } from './pages/materiales/materiales.component';
import { HomeComponent } from './Home/home/home.component';
import { LotesComponent } from './casa/lotes/lotes.component';
import { DuplexComponent } from './duplex/duplex/duplex.component';
import { RentaComponent } from './renta/renta/renta.component';
import { AuthGuardComponent } from './auth-guard/auth-guard.component';
import { LoginService } from './login.service';
import { InicioComponent } from './inicio/inicio.component';
import { LoginComponent } from './login/login.component';
export const routes: Routes = [

   { path: 'login', component: LoginComponent},
  
  { path: 'inicio', component: InicioComponent, canActivate: [AuthGuardComponent] },

  // Aquí otras rutas protegidas
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardComponent] },
  { path: 'home/casa', component: LotesComponent, data: { modeloId: 3, titulo: 'Lotes' }, canActivate: [AuthGuardComponent] },
  { path: 'home/duplex', component: LotesComponent, data: { modeloId: 4, titulo: 'Dúplex' }, canActivate: [AuthGuardComponent] },
  { path: 'home/renta', component: LotesComponent, data: { modeloId: 5, titulo: 'Renta' }, canActivate: [AuthGuardComponent] },
  { path: 'home/materiales', component: MaterialesComponent, canActivate: [AuthGuardComponent] },

  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: '**', redirectTo: 'inicio' }

/*  { path: '', redirectTo: 'home', pathMatch: 'full' }, // HOME por defecto
  { path: 'home', component: HomeComponent },
  { path: 'home/casa', component: LotesComponent},
  { path: 'home/duplex', component:DuplexComponent},
  { path: 'home/renta', component:RentaComponent},
  { path: 'home/materiales', component: MaterialesComponent },
  { path: '**', redirectTo: 'home' } // rutas inválidas*/

  



  
];

