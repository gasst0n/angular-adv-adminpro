import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  of,
  tap,
  map,
  catchError,
  delay
} from 'rxjs';

import { RegisterForm } from '../interfaces/register-form.interface';
import { CargarUsuarioResponse } from '../interfaces/cargar-usuarios.interface';
import { UsuarioModel } from '../models/usuario.model';
import { enviroment } from '../../environments/enviroments';
import Swal from 'sweetalert2';

declare const google: any;

const base_url = enviroment.base_url;

interface ApiAuthResponse {
  ok?: boolean;
  token?: string;
  usuario?: any;
  user?: any;
  usuarioActualizado?: any;
}

@Injectable({ providedIn: 'root' })
export class Usuario {

  // 🔥 Estado global reactivo
  private _usuario$ = new BehaviorSubject<UsuarioModel | null>(null);
  public usuario$ = this._usuario$.asObservable();

  get usuario(): UsuarioModel {
    return this._usuario$.value!;
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) {}

  // 🔐 Token / UID
  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this._usuario$.value?.uid ?? '';
  }

  get headers() {
    return {
      headers: { 'x-token': this.token }
    };
  }

  /* =====================================================
     ✅ EMISIONES SIEMPRE DENTRO DE ANGULAR (clave)
     ===================================================== */

  private emitirUsuario(usuario: UsuarioModel | null): void {
    this.ngZone.run(() => {
      this._usuario$.next(usuario);
    });
  }

  actualizarUsuarioLocal(usuario: UsuarioModel): void {
    this.emitirUsuario(usuario);
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  /* =====================================================
     AUTH
     ===================================================== */

  // 🔐 LOGIN
  login(formData: RegisterForm): Observable<ApiAuthResponse> {
    return this.http
      .post<ApiAuthResponse>(`${base_url}/login`, formData)
      .pipe(
        tap(resp => {
          if (resp?.token) {
            localStorage.setItem('token', resp.token);
          }

          const u = resp?.usuario ?? resp?.user;
          if (u) {
            this.emitirUsuario(this.toUsuarioModel(u));
          }
        })
      );
  }

  // 🔐 LOGIN GOOGLE (restaurado)
  loginGoogle(idToken: string): Observable<ApiAuthResponse> {
    const body = { token: idToken };

    return this.http
      .post<ApiAuthResponse>(`${base_url}/login/google`, body)
      .pipe(
        tap(resp => {
          if (resp?.token) {
            localStorage.setItem('token', resp.token);
          }

          const u = resp?.usuario ?? resp?.user;
          if (u) {
            this.emitirUsuario(this.toUsuarioModel(u));
          }
        })
      );
  }

  // 🆕 REGISTER (restaurado)
  crearUsuario(formData: RegisterForm): Observable<ApiAuthResponse> {
    return this.http
      .post<ApiAuthResponse>(`${base_url}/usuarios`, formData)
      .pipe(
        tap(resp => {
          if (resp?.token) {
            localStorage.setItem('token', resp.token);
          }

          const u = resp?.usuario ?? resp?.user;
          if (u) {
            this.emitirUsuario(this.toUsuarioModel(u));
          }
        })
      );
  }

  // 🔄 VALIDAR TOKEN
  validarToken(): Observable<boolean> {
    return this.http
      .get<ApiAuthResponse>(`${base_url}/login/renew`, this.headers)
      .pipe(
        tap(resp => {
          if (resp?.token) {
            localStorage.setItem('token', resp.token);
          }

          const u = resp?.usuario ?? resp?.user;
          if (u) {
            this.emitirUsuario(this.toUsuarioModel(u));
          }
        }),
        map(resp => Boolean(resp?.token)),
        catchError(() => of(false))
      );
  }

  // ✏️ ACTUALIZAR PERFIL
  actualizarPerfil(data: { email: string; nombre: string }): Observable<ApiAuthResponse> {
    return this.http
      .put<ApiAuthResponse>(
        `${base_url}/usuarios/${this.uid}`,
        { ...data, role: this.usuario.role },
        this.headers
      )
      .pipe(
        tap(resp => {
          const u = resp?.usuarioActualizado ?? resp?.usuario ?? resp?.user;
          if (!u) return;

          const actualizado = this.toUsuarioModel({
            ...this.usuario,
            ...u
          });

          this.emitirUsuario(actualizado);
        })
      );
  }

  // 👥 LISTAR USUARIOS

cargarUsuario(desde: number = 0): Observable<CargarUsuarioResponse> {
  return this.http
    .get<CargarUsuarioResponse>(`${base_url}/usuarios?desde=${desde}`, this.headers)
    .pipe(
      delay(1000),
      map(resp => {
        const usuarios = resp.usuarios.map(
          user =>
            new UsuarioModel(
              user.nombre,
              user.email,
              '',
              user.img,
              user.google,
              user.role,
              user.uid
            )
        );

        return {
          total: resp.total,
          usuarios
        };
      })
    );
}

  // 🚪 LOGOUT
  logout(): void {
    localStorage.removeItem('token');
    try {
      google?.accounts?.id?.disableAutoSelect?.();
    } catch {}

    this.emitirUsuario(null);

    this.ngZone.run(() => {
      this.router.navigateByUrl('/login');
    });
  }

  /* =====================================================
     HELPERS
     ===================================================== */

  private toUsuarioModel(u: any): UsuarioModel {
    return new UsuarioModel(
      u?.nombre ?? '',
      u?.email ?? '',
      '',
      u?.img ?? '',
      u?.google ?? false,
      u?.role ?? '',
      u?.uid ?? u?._id ?? ''
    );
  }

eliminarUsuario (usuario: UsuarioModel) {

  const url = `${base_url}/usuarios/${usuario.uid}`
  return this.http.delete(url, this.headers)

}

  guardarUsuario(usuario: UsuarioModel): Observable<ApiAuthResponse> {
    return this.http
      .put<ApiAuthResponse>(
        `${base_url}/usuarios/${usuario.uid}`,
         usuario,
        this.headers
      )
      .pipe(
        tap(resp => {
          const u = resp?.usuarioActualizado ?? resp?.usuario ?? resp?.user;
          if (!u) return;

          const actualizado = this.toUsuarioModel({
            ...this.usuario,
            ...u
          });

          this.emitirUsuario(actualizado);
        })
      );
  }


}
``