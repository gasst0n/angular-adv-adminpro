import { Component, OnInit, ChangeDetectorRef, NgZone, effect } from '@angular/core';

import { HospitalService } from '../../../services/hospital.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { HospitalModel } from '../../../models/hospital.model';

import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { ImagenPipe } from '../../../pipes/imagen-pipe';

import Swal from 'sweetalert2';
import { delay, finalize, switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Busquedas } from '../../../services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, ImagenPipe],
  templateUrl: './hospitales.html',
})
export class Hospitales implements OnInit {
  /** Lista renderizada en la UI */
  public hospitales: HospitalModel[] = [];

  /** Loader de la vista */
  public cargando = false;

  public imgSubs: Subscription = new Subscription();

  constructor(
    private hospitalService: HospitalService,
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
        this.cargarHospitales();
      });
    });
  }

  ngOnInit(): void {
    this.cargarHospitales();

    this.imgSubs = this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(1000))
      .subscribe((img) => this.cargarHospitales());
  }

  //BUSCADOR GLOBAL

  buscar(termino: string): void {
    if (!termino.length) {
      this.cargarHospitales();
      return;
    }

    this.busquedasService.buscar<HospitalModel>('hospitales', termino).subscribe((hospitales) => {
      this.hospitales = hospitales;
    });
  }

  /**
   * ✅ CARGA CENTRALIZADA DE HOSPITALES
   * - Maneja loader
   * - Es reutilizada por CRUD y modal
   * - Garantiza que Angular se entere del cambio
   */
  cargarHospitales(): void {
    this.cargando = true;

    this.hospitalService
      .cargarHospitales()
      .pipe(
        finalize(() => {
          this.cargando = false;

          // ✅ Forzamos chequeo visual SIN romper el árbol
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (hospitales) => {
          this.hospitales = hospitales;
        },
        error: (err) => {
          console.error('Error cargando hospitales:', err);
        },
      });
  }

  /**
   * ✅ ACTUALIZAR NOMBRE
   * No recargamos lista completa: el objeto ya está en memoria
   */
  guardarCambios(hospital: HospitalModel): void {
    this.hospitalService.actualizarHospitales(hospital._id, hospital.nombre).subscribe(() => {
      Swal.fire('Actualizado', hospital.nombre, 'success');
    });
  }

  /**
   * ✅ ELIMINAR + RECARGAR
   * switchMap evita subscribes anidados
   */
  eliminarHospital(hospital: HospitalModel): void {
    this.hospitalService
      .borrarHospitales(hospital._id)
      .pipe(switchMap(() => this.hospitalService.cargarHospitales()))
      .subscribe((hospitales) => {
        this.hospitales = hospitales;
        this.cdr.markForCheck();
        Swal.fire('Borrado', hospital.nombre, 'success');
      });
  }

  /**
   * ✅ CREAR + RECARGAR
   * SweetAlert funciona con promesas (fuera de zone)
   */
  async abrirSweetAlert(): Promise<void> {
    const { value = '' } = await Swal.fire<string>({
      title: 'Crear Hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del Hospital',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value || value.trim().length === 0) {
          return 'Debe ingresar un nombre válido';
        }
        return null;
      },
    });

    if (!value) return;

    this.hospitalService
      .crearHospitales(value.trim())
      .pipe(switchMap(() => this.hospitalService.cargarHospitales()))
      .subscribe((hospitales) => {
        this.hospitales = hospitales;
        this.cdr.markForCheck();
      });
  }

  /**
   * ✅ ABRIR MODAL DE IMÁGENES
   * El refresh NO se hace acá
   * Se hace SOLO cuando el modal notifica
   */
  abrirModal(hospital: HospitalModel): void {
    this.modalImagenService.abrirModal('hospitales', hospital._id, hospital.img);
  }
}
