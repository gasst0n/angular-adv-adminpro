import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { RegisterForm } from '../interfaces/register-form.interface';
import { enviroment } from '../../environments/enviroments';
import { catchError, map, Observable, of, tap, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { UsuarioModel } from '../models/usuario.model';

declare const google: any;

// ⚙️ Base URL de tu API
const base_url = enviroment.base_url;

/**
 * CLAVE 0:
 * Algunos backends esperan { token }, otros { credential } en /login/google.
 * Cambiá esta constante a 'token' o 'credential' según tu backend.
 */
const GOOGLE_BODY_KEY: 'token' | 'credential' = 'token';

// Tipos flexibles para las respuestas del backend (para no romper si cambian)
interface ApiAuthResponse {
  ok?: boolean;
  token?: string;
  usuario?: any;
  user?: any;
  usuarioActualizado?: any;
}

@Injectable({
  providedIn: 'root',
})
export class Usuario {

  // 🔥 Estado reactivo del usuario (toda la app se actualiza al emitir)
  private _usuario$ = new BehaviorSubject<UsuarioModel | null>(null);
  public  usuario$  = this._usuario$.asObservable();

  /**
   * CLAVE 1:
   * Este getter asume que ya tenés usuario cargado (validarToken/login).
   * Si preferís evitar '!' podés cambiar el tipo a UsuarioModel | null y
   * manejar null en donde lo uses.
   */
  get usuario(): UsuarioModel {
    return this._usuario$.value!;
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) {}

  // 🔐 TOKEN guardado en localStorage
  get token(): string {
    return localStorage.getItem('token') || '';
  }

  // 🆔 UID del usuario actual (o string vacío si no hay)
  get uid(): string {
    return this._usuario$.value?.uid ?? '';
  }

  // 🚪 LOGOUT
  logout(): void {
    localStorage.removeItem('token');

    // CLAVE 2: GIS puede no estar definido en SSR/tests → envolvemos en try/catch
    try {
      google?.accounts?.id?.disableAutoSelect?.();
    } catch (_) {}

    this._usuario$.next(null);

    // CLAVE 3: Siempre navegamos dentro de NgZone para evitar problemas de detección
    this.ngZone.run(() => {
      this.router.navigateByUrl('/login');
    });
  }

  // 🔄 VALIDAR TOKEN (refresh)
  /**
   * CLAVE 4:
   * - No asumimos que siempre viene resp.usuario.
   * - Si viene token lo guardamos.
   * - Emitimos UsuarioModel sólo si hay datos de usuario válidos.
   * - Retornamos boolean con éxito/fracaso.
   */
  validarToken(): Observable<boolean> {
    return this.http.get<ApiAuthResponse>(`${base_url}/login/renew`, {
      headers: { 'x-token': this.token }
    }).pipe(
      tap((resp) => {
        if (resp?.token) {
          localStorage.setItem('token', resp.token);
        }

        const rawUser = resp?.usuario ?? resp?.user;
        if (rawUser) {
          this._usuario$.next(this.toUsuarioModel(rawUser));
        } else {
          // No hay usuario en la respuesta → mantenemos el usuario actual o lo limpiamos
          this._usuario$.next(this._usuario$.value); // no hacemos nada
          console.warn('[AUTH] /login/renew sin usuario en body');
        }
      }),
      map((resp) => Boolean(resp?.token)),  // éxito si recibimos un token nuevo
      catchError((err) => {
        console.warn('[AUTH] validarToken error', err);
        return of(false);
      })
    );
  }

  // 🆕 REGISTER
  crearUsuario(formData: RegisterForm): Observable<ApiAuthResponse> {
    return this.http.post<ApiAuthResponse>(`${base_url}/usuarios`, formData).pipe(
      tap((resp) => {
        if (resp?.token) {
          localStorage.setItem('token', resp.token);
        } else {
          console.warn('[AUTH] /usuarios sin token en body');
        }

        const u = resp?.usuario ?? resp?.user;
        if (u) {
          this._usuario$.next(this.toUsuarioModel(u));
        } else {
          console.warn('[AUTH] /usuarios sin usuario en body');
          this._usuario$.next(null);
        }
      })
    );
  }

  // 🔐 LOGIN NORMAL
  login(formData: RegisterForm): Observable<ApiAuthResponse> {
    return this.http.post<ApiAuthResponse>(`${base_url}/login`, formData).pipe(
      tap((resp) => {
        if (resp?.token) {
          localStorage.setItem('token', resp.token);
        } else {
          console.warn('[AUTH] /login sin token en body');
        }

        const u = resp?.usuario ?? resp?.user;
        if (u) {
          this._usuario$.next(this.toUsuarioModel(u));
        } else {
          console.warn('[AUTH] /login sin usuario en body');
          this._usuario$.next(null);
        }
      })
    );
  }

  // 🔐 LOGIN GOOGLE (robusto)
  /**
   * CLAVE 5:
   * - Enviamos { [GOOGLE_BODY_KEY]: token } para adaptarnos al backend.
   * - No asumimos que siempre viene resp.usuario (evitamos el crash).
   * - Guardamos token si aparece.
   * - Emitimos UsuarioModel sólo si hay usuario.
   */
  loginGoogle(idToken: string): Observable<ApiAuthResponse> {
    const body: any = { [GOOGLE_BODY_KEY]: idToken };

    return this.http.post<ApiAuthResponse>(`${base_url}/login/google`, body).pipe(
      tap((resp) => {
        if (resp?.token) {
          localStorage.setItem('token', resp.token);
        } else {
          console.warn('[AUTH] /login/google sin token en body');
        }

        const u = resp?.usuario ?? resp?.user;
        if (u) {
          this._usuario$.next(this.toUsuarioModel(u));
        } else {
          // CLAVE 6: Antes crasheaba acá al intentar leer u.nombre cuando u era undefined
          console.warn('[AUTH] /login/google sin usuario en body (sólo token). No se emite usuario.');
          // No emitimos null para no romper la UI si ya había usuario cargado
        }
      })
    );
  }

  // ✏️ ACTUALIZAR PERFIL
  /**
   * CLAVE 7:
   * - Enviamos role actual (si tu API lo requiere).
   * - Mezclamos datos con el usuario existente si faltan propiedades.
   */
  actualizarPerfil(data: { email: string; nombre: string }): Observable<ApiAuthResponse> {
    const payload = {
      ...data,
      role: this.usuario?.role
    };

    return this.http.put<ApiAuthResponse>(`${base_url}/usuarios/${this.uid}`, payload, {
      headers: { 'x-token': this.token }
    }).pipe(
      tap((resp) => {
        const u = resp?.usuarioActualizado ?? resp?.usuario ?? resp?.user;
        if (!u) {
          console.warn('[AUTH] /usuarios/:id PUT sin usuarioActualizado');
          return;
        }

        // 🔄 Creamos una nueva instancia para disparar detección de cambios
        const usuarioFinal = new UsuarioModel(
          u?.nombre ?? this.usuario?.nombre ?? '',
          u?.email  ?? this.usuario?.email  ?? '',
          '', // password no se maneja acá
          u?.img    ?? this.usuario?.img    ?? '',
          (u?.google ?? this.usuario?.google) ?? false,
          u?.role   ?? this.usuario?.role   ?? '',
          u?.uid    ?? this.usuario?.uid    ?? ''
        );

        this._usuario$.next(usuarioFinal);
      })
    );
  }

  // 🧩 Helper: convierte el objeto crudo de la API al modelo de la app
  /**
   * CLAVE 8:
   * Centralizamos la construcción del UsuarioModel para evitar repetir lógica
   * y tolerar respuestas con keys diferentes (usuario/user).
   */
  private toUsuarioModel(u: any): UsuarioModel {
    return new UsuarioModel(
      u?.nombre ?? u?.name ?? '',
      u?.email ?? '',
      '',                      // password no viaja desde el backend
      u?.img ?? '',            // imagen opcional
      u?.google ?? false,      // si no viene, asumimos false
      u?.role ?? '',           // role opcional
      u?.uid  ?? u?._id ?? ''  // uid puede llegar como _id
    );
  }
}
``