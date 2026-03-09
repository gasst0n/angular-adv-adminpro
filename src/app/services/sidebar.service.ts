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
  // OJO: Asegurate que las URLs coincidan con tus rutas reales (/dashboard/...)
  menu: SidebarMenuSection[] = [
    {
      titulo: 'Principal',
      icono: 'mdi mdi-gauge',
      submenu: [
        { titulo: 'Main',        url: '/dashboard' },
        { titulo: 'ProgressBar', url: '/dashboard/progress' },
        { titulo: 'Gráficas',    url: '/dashboard/grafica1' },
        // { titulo: 'Account',     url: '/dashboard/account-settings' },
      ]
    }
  ];
}