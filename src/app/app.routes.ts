import { Routes } from '@angular/router';
import { MaterialesComponent } from './pages/materiales/materiales.component';
import { HomeComponent } from './Home/home/home.component';
import { LotesComponent } from './casa/lotes/lotes.component';
import { DuplexComponent } from './duplex/duplex/duplex.component';
import { RentaComponent } from './renta/renta/renta.component';

export const routes: Routes = [

  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: HomeComponent },

  {
    path: 'home/casa',
    component: LotesComponent,
    data: { modeloId: 3, titulo: 'Lotes' }
  },
  {
    path: 'home/duplex',
    component: LotesComponent,
    data: { modeloId: 4, titulo: 'Dúplex' }
  },
  {
    path: 'home/renta',
    component: LotesComponent,
    data: { modeloId: 5, titulo: 'Renta' }
  },

  { path: 'home/materiales', component: MaterialesComponent },
  { path: '**', redirectTo: 'home' }

/*  { path: '', redirectTo: 'home', pathMatch: 'full' }, // HOME por defecto
  { path: 'home', component: HomeComponent },
  { path: 'home/casa', component: LotesComponent},
  { path: 'home/duplex', component:DuplexComponent},
  { path: 'home/renta', component:RentaComponent},
  { path: 'home/materiales', component: MaterialesComponent },
  { path: '**', redirectTo: 'home' } // rutas inválidas*/

  



  
];

