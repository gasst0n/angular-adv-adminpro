// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Nopagefound } from './pages/nopagefound/nopagefound';

export const routes: Routes = [
  // Rutas públicas
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  // Lazy load del layout Pages + children (standalone)
  {
    path: '',
    loadChildren: () =>
      import('./pages/pages.routes').then(m => m.PAGES_ROUTES),
  },

  // Comodín SIEMPRE al final
  { path: '**', component: Nopagefound },
 { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

];