import { Component, OnInit, ChangeDetectorRef, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { delay, finalize } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

import { UsuarioModel } from '../../../models/usuario.model';
import { Usuario } from '../../../services/usuario.service';
import { Busquedas } from '../../../services/busquedas.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';

import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.html',
})
export class Usuarios implements OnInit, OnDestroy {
  totalUsuarios = 0;
  usuarios: UsuarioModel[] = [];
  usuariosTemp: UsuarioModel[] = [];

  desde = 0;
  cargando = true;

  public imgSubs!: Subscription;

  constructor(
    private usuarioService: Usuario,
    private busquedasService: Busquedas,
    private modalImagenService: ModalImagenService,
    private cdr: ChangeDetectorRef,
  ) {
    /* =========================================
       ✅ CUANDO SE CIERRA EL MODAL
       RECARGAMOS LA LISTA
    ========================================= */
    effect(() => {
      const abierto = this.modalImagenService.open();
      if (!abierto) {
        this.cargarUsuarios();
      }
    });
  }
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarUsuarios();

    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe((img) => this.cargarUsuarios());
  }

  /* =========================================
     Cargar usuarios desde el backend
  ========================================= */
  cargarUsuarios(): void {
    this.cargando = true;

    this.usuarioService
      .cargarUsuario(this.desde)
      .pipe(
        finalize(() => {
          this.cargando = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: ({ total, usuarios }) => {
          this.totalUsuarios = total;

          // ✅ CLAVE: reconstruimos el modelo
          this.usuarios = usuarios.map(
            (u) => new UsuarioModel(u.nombre, u.email, u.password, u.img, u.google, u.role, u.uid),
          );

          // respaldo para búsquedas
          this.usuariosTemp = [...this.usuarios];

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error cargando usuarios', err);
          this.usuarios = [];
          this.cargando = false;
          this.cdr.detectChanges();
        },
      });
  }

  /* =========================================
     Paginación
  ========================================= */
  cambiarPagina(valor: number): void {
    const nuevoDesde = this.desde + valor;

    if (nuevoDesde < 0 || nuevoDesde >= this.totalUsuarios) return;

    this.desde = nuevoDesde;
    this.cargarUsuarios();
  }

  /* =========================================
     Buscador
  ========================================= */
  buscar(termino: string): void {
    if (!termino.length) {
      this.usuarios = [...this.usuariosTemp];
      return;
    }

    this.busquedasService.buscar('usuarios', termino).subscribe((resultados) => {
      this.usuarios = resultados.map(
        (u) => new UsuarioModel(u.nombre, u.email, u.password, u.img, u.google, u.role, u.uid),
      );
    });
  }

  /* =========================================
     Eliminar usuario
  ========================================= */
  eliminarUsuario(usuario: UsuarioModel): void {
    if (usuario.uid === this.usuarioService.uid) {
      Swal.fire('Error', 'No puede borrarse a sí mismo', 'error');
      return;
    }

    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Está a punto de borrar a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrarlo',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario(usuario).subscribe(() => {
          this.cargarUsuarios();
          Swal.fire('Usuario borrado', `${usuario.nombre} fue eliminado correctamente`, 'success');
        });
      }
    });
  }

  /* =========================================
     Cambiar rol
  ========================================= */
  cambiarRole(usuario: UsuarioModel): void {
    this.usuarioService.guardarUsuario(usuario).subscribe();
  }

  /* =========================================
     Abrir modal imagen
  ========================================= */
  abrirModal(usuario: UsuarioModel): void {
    this.modalImagenService.abrirModal('usuarios', usuario.uid, usuario.img);
  }
}
