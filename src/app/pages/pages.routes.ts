import { RouterModule, Routes } from '@angular/router';
import { Pages } from './pages';
import { AuthGuard } from '../guards/auth-guard';
import { Nopagefound } from './nopagefound/nopagefound';
import { NgModule } from '@angular/core';

export const PAGES_ROUTES: Routes = [
  // { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    component: Pages, // debe contener <router-outlet>
    canActivate: [AuthGuard],
    canLoad: [AuthGuard],
    loadChildren: () => import('./child-routes-module').then((modulo) => modulo.ChildRoutesModule),
  },
  { path: '**', component: Nopagefound },
];

@NgModule({
  imports: [RouterModule.forChild(PAGES_ROUTES)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
