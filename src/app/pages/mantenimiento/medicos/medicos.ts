import { ChangeDetectorRef, Component, effect, NgZone, OnInit } from '@angular/core';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { Busquedas } from '../../../services/busquedas.service';
import { delay, finalize, Subscription, switchMap } from 'rxjs';
import { MedicosModel } from '../../../models/medicos.model';
import Swal from 'sweetalert2';
import { MedicoService } from '../../../services/medico.service';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImagenPipe } from '../../../pipes/imagen-pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-medicos',
  imports: [NgForOf, NgIf, FormsModule, ImagenPipe, RouterLink],
  templateUrl: './medicos.html',
  styles: ``,
})
export class Medicos implements OnInit {
  /** Lista renderizada en la UI */
  public medicos: MedicosModel[] = [];

  /** Loader de la vista */
  public cargando = false;

  public imgSubs: Subscription = new Subscription();

  constructor(
    private medicosService: MedicoService,
    private modalImagenService: ModalImagenService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone, // ✅ CLAVE ABSOLUTA
    private busquedasService: Busquedas,
  ) {
    /**
     * ✅ EFFECT REACTIVO
     * Este effect se ejecuta cada vez que el modal notifica
     * que una imagen fue actualizada.
     *
     * IMPORTANTE:
     * Los signals desde servicios pueden ejecutarse FUERA
     * de Angular, por eso usamos NgZone.run().
     */
    effect(() => {
      this.modalImagenService.imagenActualizada();

      // ✅ Volvemos explícitamente al contexto Angular
      this.ngZone.run(() => {
        this.cargarMedicos();
      });
    });
  }

  ngOnInit(): void {
    this.cargarMedicos();

    this.imgSubs = this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(1000))
      .subscribe((img) => this.cargarMedicos());
  }

  //BUSCADOR GLOBAL

  buscar(termino: string): void {
    if (!termino.length) {
      this.cargarMedicos();
      return;
    }

    this.busquedasService.buscar<MedicosModel>('medicos', termino).subscribe((medicos) => {
      this.medicos = medicos;
    });
  }

  /**
   * ✅ CARGA CENTRALIZADA DE HOSPITALES
   * - Maneja loader
   * - Es reutilizada por CRUD y modal
   * - Garantiza que Angular se entere del cambio
   */
  cargarMedicos(): void {
    this.cargando = true;

    this.medicosService
      .cargarMedicos()
      .pipe(
        finalize(() => {
          this.cargando = false;

          // ✅ Forzamos chequeo visual SIN romper el árbol
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (medicos) => {
          this.medicos = medicos;
        },
        error: (err) => {
          console.error('Error cargando medicos:', err);
        },
      });
  }

  /**
   * ✅ ACTUALIZAR NOMBRE
   * No recargamos lista completa: el objeto ya está en memoria
   */

  // guardarCambios(medico: MedicosModel): void {
  //   this.medicosService.actualizarMedicos(medico._id, medico.nombre).subscribe(() => {
  //     Swal.fire('Actualizado', medico.nombre, 'success');
  //   });
  // }

  /**
   * ✅ ELIMINAR + RECARGAR
   * switchMap evita subscribes anidados
   */
  eliminarMedico(medico: MedicosModel): void {
    Swal.fire({
      title: '¿Borrar Medico?',
      text: `Esta a punto de borrar a ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo',
    }).then((result) => {
      if (result.value) {
        this.medicosService.borrarMedicos(medico._id).subscribe((resp) => {
          this.cargarMedicos();
          Swal.fire('Usuario borrado', `${medico.nombre} fue eliminado correctamente`, 'success');
        });
      }
    });
  }

  /**
   * ✅ CREAR + RECARGAR
   * SweetAlert funciona con promesas (fuera de zone)
   */

  /**
   * ✅ ABRIR MODAL DE IMÁGENES
   * El refresh NO se hace acá
   * Se hace SOLO cuando el modal notifica
   */
  abrirModal(medico: MedicosModel): void {
    this.modalImagenService.abrirModal('medicos', medico._id, medico.img);
  }
}
