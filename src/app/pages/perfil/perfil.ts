import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UsuarioModel } from '../../models/usuario.model';
import { Usuario } from '../../services/usuario.service';
import { FileUpload } from '../../services/file-upload.service';
import { NgIf } from '@angular/common'; // necesario para *ngIf
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './perfil.html',
  styles: ``
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
    private cdr: ChangeDetectorRef // 🔹 inyectamos ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.usuarioSub = this.usuarioService.usuario$.subscribe(usuarioData => {
      if (!usuarioData) return;

      this.usuario = new UsuarioModel(
        usuarioData.nombre,
        usuarioData.email,
        usuarioData.password,
        usuarioData.img,
        usuarioData.google,
        usuarioData.role,
        usuarioData.uid
      );

      this.perfilForm.setValue({
        nombre: this.usuario.nombre,
        email: this.usuario.email
      });
    });
  }

  actualizarPerfil() {
    if (this.perfilForm.invalid) return;

    this.usuarioService.actualizarPerfil(this.perfilForm.value)
      .subscribe(() => {
        console.log('Perfil actualizado correctamente');
        Swal.fire('Guardado','Cambios fueron guardados', 'success')
        setTimeout(() => window.location.reload(), 3000);
      }, (err) => {
        Swal.fire('Error',err.error.msg, 'error')
        console.log(err)
      });
  }

  cambiarImagen(event: Event) {
    const target = event.target as HTMLInputElement;

    if (!target.files || target.files.length === 0) return;

    this.imagenSubir = target.files[0];

    const reader = new FileReader();

    reader.onload = () => {
      // 🔹 asignamos imgTemp y forzamos detección de cambios
      this.imgTemp = reader.result as string;
      this.cdr.detectChanges(); // 🔹 fuerza que Angular actualice la vista
    };

    reader.readAsDataURL(this.imagenSubir);
  }

  subirImagen() {
    if (!this.imagenSubir) return;

    const uid = this.usuario.uid;
    if (!uid) return console.error('El usuario no tiene UID definido');

    this.fileUploadService.actualizarFoto(this.imagenSubir, 'usuarios', uid)
      .then(resp => {
        console.log('Imagen subida correctamente', resp);
        this.usuario.img = resp.img;
        this.imgTemp = null;
        Swal.fire('Cambio realizado','Foto de perfil actualizada', 'success')
        setTimeout(() => window.location.reload(), 3000)
       
        }).catch(err => {
          console.log(err)
        Swal.fire('Error','No se pudo subir la imagen', 'error')

      });
  }

  ngOnDestroy(): void {
    this.usuarioSub.unsubscribe();
  }
}