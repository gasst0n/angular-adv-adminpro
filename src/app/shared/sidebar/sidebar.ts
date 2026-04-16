import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgFor } from '@angular/common';
import { SidebarService, SidebarMenuSection } from '../../services/sidebar.service';
import { Usuario } from '../../services/usuario.service';
import { UsuarioModel } from '../../models/usuario.model'; // ajustá ruta si cambia
import { enviroment } from '../../../environments/enviroments';

const base_url = enviroment.base_url;

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.html',
  styles: ``,
  imports: [RouterLink, RouterLinkActive, NgFor],
})
export class Sidebar {
  public usuario!: UsuarioModel;
  menuItems: SidebarMenuSection[] = [];

  constructor(
    public sidebarService: SidebarService,
    private usuarioService: Usuario,
  ) {
    this.usuario = this.usuarioService.usuario;
    // this.menuItems = this.sidebarService.menu;
  }

  get imagenUrl(): string {
    return this.usuario?.imagenURL || `${base_url}/upload/usuarios/noimg.jpg`;
  }

  onImgError(event: any) {
    const img = event.target;

    if (img.src.includes('noimg.jpg')) return;

    // retry simple para Google
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
}
