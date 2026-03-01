// src/app/pages/pages.routes.ts
import { Routes } from '@angular/router';
import { Pages } from './pages';
import { Dashboard } from './dashboard/dashboard';
import { Progress } from './progress/progress';
import { Grafica1 } from './grafica1/grafica1';

export const PAGES_ROUTES: Routes = [
  {
    path: 'dashboard',
    component: Pages, // Pages debe tener <router-outlet>
    children: [
      { path: '', component: Dashboard },
      { path: 'progress', component: Progress },
      { path: 'grafica1', component: Grafica1 },
    ],
  },
];