import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Nopagefound } from './pages/nopagefound/nopagefound';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  {
    path: '',
    loadChildren: () =>
      import('./pages/pages.routes').then(m => m.PAGES_ROUTES),
  },

  { path: '**', component: Nopagefound },
];