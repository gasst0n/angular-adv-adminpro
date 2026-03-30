import { EventEmitter, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ModalImagenService {
  /* ========= Estado del modal ========= */
  private _open = signal<boolean>(false);
  readonly open = this._open;

  /* ========= Evento explícito ✅ ========= */
  private _imagenActualizada = signal<number>(0);
  readonly imagenActualizada = this._imagenActualizada;

  /* ========= Contexto ========= */
  public tipo: 'usuarios' | 'medicos' | 'hospitales' | '' = '';
  public id: string = '';
  public img: string = ''; // SOLO nombre del archivo

  public nuevaImagen: EventEmitter<string> = new EventEmitter<string>();

  abrirModal(tipo: 'usuarios' | 'medicos' | 'hospitales', id: string, img?: string): void {
    this.tipo = tipo;
    this.id = id;
    this.img = img ?? '';
    this._open.set(true);
  }

  cerrarModal(): void {
    this._open.set(false);
  }

  /* ✅ ESTE ES EL PUNTO CLAVE */
  notificarImagenActualizada(nombreImg: string): void {
    this.img = nombreImg; // guardamos nombre real
    this._imagenActualizada.update((v) => v + 1); // emitimos evento
  }
}
