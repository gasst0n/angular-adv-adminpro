import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Usuario } from '../services/usuario.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private usuarioService: Usuario,
    private router: Router,
  ) {}

  /**
   * Guard de Admin
   * ✅ Permite acceso solo a ADMIN_ROLE
   * ✅ Muestra SweetAlert si no tiene permisos
   * ✅ Al hacer click en OK:
   *    - Si hay token → /dashboard
   *    - Si no hay token → /login
   */
  canActivate(): boolean {
    // ✅ Si es admin, pasa directamente
    if (this.usuarioService.role === 'ADMIN_ROLE') {
      return true;
    }

    console.warn('[AdminGuard] Acceso denegado', {
      role: this.usuarioService.role,
      token: !!this.usuarioService.token,
    });

    // 🚫 Acceso denegado
    Swal.fire({
      icon: 'error',
      title: 'Acceso denegado',
      text: 'No tenés permisos para acceder',
      confirmButtonText: 'OK',
      allowOutsideClick: false,
    }).then(() => {
      // ✅ Al cerrar el alert, evaluamos el token
      const token = this.usuarioService.token;

      if (token) {
        // Usuario logueado pero sin permisos
        this.router.navigateByUrl('/dashboard');
      } else {
        // Usuario no logueado
        this.router.navigateByUrl('/login');
      }
    });

    // ⛔ Bloquea la navegación SIEMPRE
    return false;
  }
}
