import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Grafica1 } from './grafica1/grafica1';
import { Pages } from './pages';
import { Progress } from './progress/progress';
import { AccountSettings } from './account-settings/account-settings';
import { Promesas } from './promesas/promesas';
import { Rxjs } from './rxjs/rxjs';
import { AuthGuard } from '../guards/auth-guard';
import { Perfil } from './perfil/perfil';
import { Usuarios } from './mantenimiento/usuarios/usuarios';
import { Hospitales } from './mantenimiento/hospitales/hospitales';
import { Nopagefound } from './nopagefound/nopagefound';
import { Medicos } from './mantenimiento/medicos/medicos';
import { Medico } from './mantenimiento/medicos/medico';
import { Busqueda } from './busqueda/busqueda';
import { AdminGuard } from '../guards/admin-guard';

export const PAGES_ROUTES: Routes = [
  // { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    component: Pages, // debe contener <router-outlet>
    canActivate: [AuthGuard],
    children: [
      { path: '', component: Dashboard, data: { titulo: 'Dashboard' } }, // /dashboard
      { path: 'progress', component: Progress, data: { titulo: 'Progress' } }, // /dashboard/progress
      { path: 'grafica1', component: Grafica1, data: { titulo: 'Graficas' } },
      { path: 'account-settings', component: AccountSettings, data: { titulo: 'Ajustes' } }, // /dashboard/grafica1
      { path: 'buscar/:termino', component: Busqueda, data: { titulo: 'Busquedas' } }, // /dashboard/grafica1
      { path: 'promesas', component: Promesas, data: { titulo: 'Promesas' } }, // /dashboard/grafica1
      { path: 'rxjs', component: Rxjs, data: { titulo: 'RXJS' } }, // /dashboard/grafica1
      { path: 'perfil', component: Perfil, data: { titulo: 'Perfil' } }, // /dashboard/grafica1

      // Mantenimiento

      // RUTAS ADMINISTRATIVAS - ADMINGUARD

      {
        path: 'usuarios',
        canActivate: [AdminGuard],
        component: Usuarios,
        data: { titulo: 'Usuario de Aplicación' },
      }, // /dashboard/grafica1
      { path: 'hospitales', component: Hospitales, data: { titulo: 'Hospitales' } }, // /dashboard/grafica1
      { path: 'medicos', component: Medicos, data: { titulo: 'Medicos' } }, // /dashboard/grafica1
      { path: 'medico/:id', component: Medico, data: { titulo: 'Mantenimiendo de Medicos' } }, // /dashboard/grafica1

      // Si usás estos en el menú, creá sus componentes y descomentalos:
      // { path: 'analytical', component: Analytical },
      // { path: 'demographical', component: Demographical },
      // { path: 'modern', component: Modern },
      // { path: 'profile', component: Profile },
      // { path: 'balance', component: Balance },
      // { path: 'inbox', component: Inbox },
      // { path: 'account', component: AccountSettings },
    ],
  },
  { path: '**', component: Nopagefound },
];
