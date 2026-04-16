import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Usuario } from '../../services/usuario.service';
import { UsuarioModel } from '../../models/usuario.model'; // ajustá ruta
import { enviroment } from '../../../environments/enviroments';

const base_url = enviroment.base_url;

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  styles: ``,
  imports: [RouterLink, RouterLinkActive],
})
export class Header {
  public usuario!: UsuarioModel;

  constructor(
    private usuarioService: Usuario,
    private router: Router,
  ) {
    this.usuario = this.usuarioService.usuario;
  }

  get imagenUrl(): string {
    return this.usuario?.imagenURL || `${base_url}/upload/usuarios/noimg.jpg`;
  }

  onImgError(event: any) {
    const img = event.target;

    if (img.src.includes('noimg.jpg')) return;

    if (img.src.includes('googleusercontent') && !img.dataset.retry) {
      img.dataset.retry = 'true';
      setTimeout(() => (img.src = img.src), 200);
      return;
    }

    img.src = `${base_url}/upload/usuarios/noimg.jpg`;
  }

  logout() {
    this.usuarioService.logout();
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      return;
    }

    console.log(termino);
    this.router.navigateByUrl(`/dashboard/buscar/${termino}`);
  }
}
