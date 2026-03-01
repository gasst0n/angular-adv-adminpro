import { Routes } from '@angular/router';

import { Pages } from './pages/pages';
import { Dashboard } from './pages/dashboard/dashboard';
import { Progress } from './pages/progress/progress';
import { Grafica1 } from './pages/grafica1/grafica1';

import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Nopagefound } from './pages/nopagefound/nopagefound';

export const routes: Routes = [
  // Rutas públicas (fuera del layout)
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  // Layout con children
  {
    path: '',
    component: Pages,        // <-- Asegurate que Pages tenga <router-outlet>
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'progress', component: Progress },
      { path: 'grafica1', component: Grafica1 },

      // Redirección SOLO cuando estás en la ruta vacía del layout
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // relativo
    ],
  },

  // Siempre al final
  { path: '**', component: Nopagefound },
];