import { CommonModule } from '@angular/common';
import { Component, HostBinding } from '@angular/core';
import { ModalImagenService } from '../../services/modal-imagen.service';
import Swal from 'sweetalert2';
import { FileUpload } from '../../services/file-upload.service';
import { enviroment } from '../../../environments/enviroments';

const base_url = enviroment.base_url;

@Component({
  selector: 'app-modal-imagen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-imagen.html',
  styles: [
    `
      .modal-backdrop-custom {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.45);
        z-index: 99998;
      }

      .custom-modal {
        display: block;
      }

      .preview-img {
        max-width: 220px;
        max-height: 220px;
        object-fit: cover;
        border-radius: 10px;
        border: 1px solid #ddd;
        padding: 4px;
      }
    `,
  ],
})
export class ModalImagen {
  public imagenSubir!: File;
  public imgTemp: string | null = null;

  constructor(
    public modalSrv: ModalImagenService,
    private fileUpload: FileUpload,
  ) {}

  /* ===== Estado del modal ===== */
  get open(): boolean {
    return this.modalSrv.open();
  }

  @HostBinding('style.position') get pos() {
    return this.open ? 'fixed' : null;
  }
  @HostBinding('style.inset') get inset() {
    return this.open ? '0' : null;
  }
  @HostBinding('style.zIndex') get z() {
    return this.open ? '99999' : null;
  }
  @HostBinding('style.pointerEvents') get pe() {
    return this.open ? 'auto' : 'none';
  }

  /* ✅ URL COMPLETA PARA LA IMAGEN EXISTENTE */
  get imagenActualUrl(): string | null {
    if (!this.modalSrv.img) return null;
    return `${base_url}/upload/${this.modalSrv.tipo}/${this.modalSrv.img}`;
  }

  cambiarImagen(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.imagenSubir = input.files[0];
    if (this.imgTemp) URL.revokeObjectURL(this.imgTemp);
    this.imgTemp = URL.createObjectURL(this.imagenSubir);
  }

  subirImagen(): void {
    const { id, tipo } = this.modalSrv;
    if (!this.imagenSubir || !id || !tipo) return;

    this.fileUpload
      .actualizarFoto(this.imagenSubir, tipo, id)
      .then((resp) => {
        Swal.fire('Cambio realizado', 'Foto actualizada correctamente', 'success');
        this.modalSrv.notificarImagenActualizada(resp.img);
        this.modalSrv.nuevaImagen.emit(resp);
        this.cerrarModal();
      })
      .catch(() => {
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');
      });
  }

  cerrarModal() {
    this.imgTemp = null;
    this.modalSrv.cerrarModal();
  }
}
