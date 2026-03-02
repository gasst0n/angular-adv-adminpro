import { Routes } from "@angular/router";
import { Dashboard } from "./dashboard/dashboard";
import { Grafica1 } from "./grafica1/grafica1";
import { Pages } from "./pages";
import { Progress } from "./progress/progress";

export const PAGES_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    component: Pages, // Pages debe tener <router-outlet>
    children: [
      { path: '', component: Dashboard }, // /dashboard
      { path: 'progress', component: Progress }, // /dashboard/progress
      { path: 'grafica1', component: Grafica1 }, // /dashboard/grafica1
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];