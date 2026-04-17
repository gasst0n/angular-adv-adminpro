import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanLoad,
  GuardResult,
  MaybeAsync,
  Route,
  UrlSegment,
} from '@angular/router';
import { Usuario } from '../services/usuario.service';
import { map, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private usuarioService: Usuario,
    private router: Router,
  ) {}
  canLoad(route: Route, segments: UrlSegment[]): MaybeAsync<GuardResult> {
    return this.usuarioService.validarToken().pipe(
      map((resp: any) => {
        console.log('Token válido', resp);
        return true; // permite acceso
      }),

      catchError((err) => {
        console.log('Token inválido');

        this.router.navigateByUrl('/login');

        return of(false); // bloquea acceso
      }),
    );
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.usuarioService.validarToken().pipe(
      map((resp: any) => {
        console.log('Token válido', resp);
        return true; // permite acceso
      }),

      catchError((err) => {
        console.log('Token inválido');

        this.router.navigateByUrl('/login');

        return of(false); // bloquea acceso
      }),
    );
  }
}
