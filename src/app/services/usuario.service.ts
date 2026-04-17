import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, tap, map, catchError, delay } from 'rxjs';

import { RegisterForm } from '../interfaces/register-form.interface';
import { CargarUsuarioResponse } from '../interfaces/cargar-usuarios.interface';
import { UsuarioModel } from '../models/usuario.model';
import { enviroment } from '../../environments/enviroments';

declare const google: any;

// URL base del backend (Render / local)
const base_url = enviroment.base_url;

/**
 * Respuesta genérica del backend para auth
 */
interface ApiAuthResponse {
  ok?: boolean;
  token?: string;
  usuario?: any;
  user?: any;
  menu?: any;
  usuarioActualizado?: any;
}

@Injectable({ providedIn: 'root' })
export class Usuario {
  /**
   * Estado global del usuario autenticado
   */
  private _usuario$ = new BehaviorSubject<UsuarioModel | null>(null);
  public usuario$ = this._usuario$.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone,
  ) {}

  /* ===========================
     GETTERS
     =========================== */

  get usuario(): UsuarioModel {
    return this._usuario$.value!;
  }

  get uid(): string {
    return this._usuario$.value?.uid ?? '';
  }

  get role(): string | null {
    return this._usuario$.value?.role ?? null;
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: { 'x-token': this.token },
    };
  }

  /**
   * Emite el usuario dentro de Angular Zone
   * (evita problemas de detección de cambios)
   */
  private emitirUsuario(usuario: UsuarioModel | null): void {
    this.ngZone.run(() => {
      this._usuario$.next(usuario);
    });
  }

  /* ===========================
     AUTH
     =========================== */

  /**
   * ✅ LOGIN NORMAL
   * Recibe SOLO email y password
   */
  login(data: { email: string; password: string }): Observable<ApiAuthResponse> {
    return this.http
      .post<ApiAuthResponse>(`${base_url}/login`, data)
      .pipe(tap((resp) => this.procesarAuth(resp)));
  }

  /**
   * ✅ LOGIN CON GOOGLE
   */
  loginGoogle(token: string): Observable<ApiAuthResponse> {
    return this.http
      .post<ApiAuthResponse>(`${base_url}/login/google`, { token })
      .pipe(tap((resp) => this.procesarAuth(resp)));
  }

  /**
   * ✅ REGISTRO
   */
  crearUsuario(formData: RegisterForm): Observable<ApiAuthResponse> {
    return this.http
      .post<ApiAuthResponse>(`${base_url}/usuarios`, formData)
      .pipe(tap((resp) => this.procesarAuth(resp)));
  }

  /**
   * ✅ RENOVAR TOKEN
   */
  validarToken(): Observable<boolean> {
    return this.http.get<ApiAuthResponse>(`${base_url}/login/renew`, this.headers).pipe(
      tap((resp) => this.procesarAuth(resp)),
      map((resp) => Boolean(resp?.token)),
      catchError(() => of(false)),
    );
  }

  /**
   * ✅ LOGOUT
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('menu');

    try {
      google?.accounts?.id?.disableAutoSelect?.();
    } catch {}

    this.emitirUsuario(null);
    this.router.navigateByUrl('/login');
  }

  /* ===========================
     CRUD USUARIOS
     =========================== */

  cargarUsuario(desde: number = 0): Observable<CargarUsuarioResponse> {
    return this.http
      .get<CargarUsuarioResponse>(`${base_url}/usuarios?desde=${desde}`, this.headers)
      .pipe(
        delay(1000),
        map((resp) => ({
          total: resp.total,
          usuarios: resp.usuarios.map(
            (u: any) => new UsuarioModel(u.nombre, u.email, '', u.img, u.google, u.role, u.uid),
          ),
        })),
      );
  }

  eliminarUsuario(usuario: UsuarioModel) {
    return this.http.delete(`${base_url}/usuarios/${usuario.uid}`, this.headers);
  }

  guardarUsuario(usuario: UsuarioModel) {
    return this.http.put(`${base_url}/usuarios/${usuario.uid}`, usuario, this.headers);
  }

  actualizarPerfil(data: { nombre: string; email: string }) {
    return this.http.put(
      `${base_url}/usuarios/${this.uid}`,
      { ...data, role: this.usuario.role },
      this.headers,
    );
  }

  /* ===========================
     HELPERS
     =========================== */

  /**
   * Procesa login / register / renew
   * Guarda token, menú y usuario en memoria
   */
  private procesarAuth(resp: ApiAuthResponse): void {
    if (resp?.token) {
      localStorage.setItem('token', resp.token);
      localStorage.setItem('menu', JSON.stringify(resp.menu));
    }

    const u = resp?.usuario ?? resp?.user;
    if (u) {
      this.emitirUsuario(
        new UsuarioModel(u.nombre, u.email, '', u.img, u.google, u.role, u.uid ?? u._id),
      );
    }
  }
}
