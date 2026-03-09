import { Routes } from "@angular/router";
import { Dashboard } from "./dashboard/dashboard";
import { Grafica1 } from "./grafica1/grafica1";
import { Pages } from "./pages";
import { Progress } from "./progress/progress";
import { AccountSettings } from "./account-settings/account-settings";

export const PAGES_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    component: Pages, // debe contener <router-outlet>
    children: [
      { path: '', component: Dashboard },                 // /dashboard
      { path: 'progress', component: Progress },          // /dashboard/progress
      { path: 'grafica1', component: Grafica1 },
      { path: 'account-settings', component: AccountSettings}          // /dashboard/grafica1

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
  { path: '**', redirectTo: 'dashboard' },
];