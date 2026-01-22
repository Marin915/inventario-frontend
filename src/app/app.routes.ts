import { RouterModule, Routes } from '@angular/router';
import { MaterialesComponent } from './pages/materiales/materiales.component';
import { HomeComponent } from './Home/home/home.component';
import { LotesComponent } from './casa/lotes/lotes.component';
import { DuplexComponent } from './duplex/duplex/duplex.component';
import { RentaComponent } from './renta/renta/renta.component';
import { AuthGuardComponent } from './auth-guard/auth-guard.component';
import { LoginService } from './login.service';
import { InicioComponent } from './inicio/inicio.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { AuthGuard } from './auth-guard.service';


export const routes: Routes = [

   // LOGIN (PÚBLICO)
  { path: 'login', component: LoginComponent },

  // RUTA INICIAL → LOGIN
  { path: '', redirectTo: 'login', pathMatch: 'full' },


  // Aquí otras rutas protegidas
   { path: 'inicio', component: InicioComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'home/casa', component: LotesComponent, data: { modeloId: 3, titulo: 'Lotes' }, canActivate: [AuthGuard] },
  { path: 'home/duplex', component: LotesComponent, data: { modeloId: 4, titulo: 'Dúplex' }, canActivate: [AuthGuard] },
  { path: 'home/renta', component: LotesComponent, data: { modeloId: 5, titulo: 'Renta' }, canActivate: [AuthGuard] },
  { path: 'home/materiales', component: MaterialesComponent, canActivate: [AuthGuard] },

  // CUALQUIER RUTA INVÁLIDA → LOGIN
  { path: '**', redirectTo: 'login' }

/*  { path: '', redirectTo: 'home', pathMatch: 'full' }, // HOME por defecto
  { path: 'home', component: HomeComponent },
  { path: 'home/casa', component: LotesComponent},
  { path: 'home/duplex', component:DuplexComponent},
  { path: 'home/renta', component:RentaComponent},
  { path: 'home/materiales', component: MaterialesComponent },
  { path: '**', redirectTo: 'home' } // rutas inválidas*/

  



  
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }