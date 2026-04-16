import { Injectable } from '@angular/core';

export interface SidebarMenuItem {
  titulo: string;
  url: string;
  icono?: string;
}
export interface SidebarMenuSection {
  titulo: string;
  icono: string;
  submenu: SidebarMenuItem[];
}

@Injectable({ providedIn: 'root' })
export class SidebarService {
  public menu: SidebarMenuSection[] = [];

  cargarMenu(): void {
    const menu = localStorage.getItem('menu');
    this.menu = menu ? (JSON.parse(menu) as SidebarMenuSection[]) : [];
  } // OJO: Asegurate que las URLs coincidan con tus rutas reales (/dashboard/...)
  // menu: SidebarMenuSection[] = [
  //   {
  //     titulo: 'Principal',
  //     icono: 'mdi mdi-gauge',
  //     submenu: [
  //       { titulo: 'Main',        url: '/dashboard' },
  //       { titulo: 'ProgressBar', url: '/dashboard/progress' },
  //       { titulo: 'Gráficas',    url: '/dashboard/grafica1' },
  //       { titulo: 'Promesas',    url: '/dashboard/promesas' },
  //       { titulo: 'Rxjs',    url: '/dashboard/rxjs' },
  //     ]
  //   },

  //   {
  //     titulo: 'Mantenimiento',
  //     icono: 'mdi mdi-folder-lock-open',
  //     submenu: [
  //       { titulo: 'Usuarios',        url: 'usuarios' },
  //       { titulo: 'Hospitales', url: 'hospitales' },
  //       { titulo: 'Medicos',    url: 'medicos' },
  //     ]
  //   }

  // ];
}
