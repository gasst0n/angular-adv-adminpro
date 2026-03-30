import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

import { UsuarioModel } from '../../models/usuario.model';
import { Usuario } from '../../services/usuario.service';
import { FileUpload } from '../../services/file-upload.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './perfil.html',
})
export class Perfil implements OnInit, OnDestroy {
  public perfilForm!: FormGroup;
  public usuario!: UsuarioModel;
  public imgTemp: string | null = null;
  public imagenSubir!: File;
  private usuarioSub!: Subscription;

  constructor(
    private fb: FormBuilder,
    public usuarioService: Usuario,
    private fileUploadService: FileUpload,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    this.usuarioSub = this.usuarioService.usuario$.subscribe((usuarioData) => {
      if (!usuarioData) return;

      this.usuario = new UsuarioModel(
        usuarioData.nombre,
        usuarioData.email,
        usuarioData.password,
        usuarioData.img,
        usuarioData.google,
        usuarioData.role,
        usuarioData.uid,
      );

      this.perfilForm.setValue({
        nombre: this.usuario.nombre,
        email: this.usuario.email,
      });
    });
  }

  actualizarPerfil(): void {
    if (this.perfilForm.invalid) return;

    this.usuarioService.actualizarPerfil(this.perfilForm.value).subscribe({
      next: () => {
        Swal.fire('Guardado', 'Cambios fueron guardados', 'success').then(() => {
          this.reiniciarVista();
        });
      },
      error: (err) => {
        Swal.fire('Error', err.error?.msg || 'Error al actualizar', 'error');
      },
    });
  }

  cambiarImagen(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) return;

    this.imagenSubir = target.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.imgTemp = reader.result as string;
      this.cdr.detectChanges();
    };

    reader.readAsDataURL(this.imagenSubir);
  }

  subirImagen(): void {
    if (!this.imagenSubir || !this.usuario?.uid) return;

    this.fileUploadService
      .actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid)
      .then((resp) => {
        this.usuario.img = resp.img;
        this.imgTemp = null;

        Swal.fire('Cambio realizado', 'Foto de perfil actualizada', 'success').then(() => {
          this.reiniciarVista();
        });
      })
      .catch(() => {
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');
      });
  }

  private reiniciarVista(): void {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['/perfil']));
  }

  ngOnDestroy(): void {
    this.usuarioSub.unsubscribe();
  }
}
``;
