// src/app/services/settings.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private linkTheme: HTMLLinkElement | null = null;

  private readonly STORAGE_KEY = 'theme';
  private readonly THEME_DIR = 'assets/css/colors/';

  /**
   * Inicializa el manejo de tema:
   * - Limpia <link> de themes que no sean #theme (por si quedaron estáticos)
   * - Crea/obtiene <link id="theme">
   * - Aplica el tema guardado o el default
   * - Marca el botón .selector correspondiente (clase 'working')
   */
  init(defaultTheme: string = 'default'): void {
    this.removeStrayThemeLinks();

    // Obtener o crear #theme
    this.linkTheme = document.querySelector<HTMLLinkElement>('#theme');
    if (!this.linkTheme) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.id = 'theme';
      document.head.appendChild(link);
      this.linkTheme = link;
    }

    // Aplicar saved/default
    const saved = this.getTheme() || defaultTheme;
    this.applyTheme(saved);
    this.markWorking(saved);
  }

  /** Devuelve el nombre del tema actual guardado (p.ej. 'default', 'default-dark') */
  getTheme(): string | null {
    return localStorage.getItem(this.STORAGE_KEY);
  }

  /** Cambia el tema, lo persiste y marca el botón correspondiente */
  setTheme(theme: string): void {
    localStorage.setItem(this.STORAGE_KEY, theme);
    this.applyTheme(theme);
    this.markWorking(theme);
  }

  /** Aplica el CSS de theme y setea la clase global para modo oscuro */
  private applyTheme(theme: string): void {
    if (!this.linkTheme) {
      console.error('SettingsService: <link id="theme"> no inicializado. Llamá init() primero.');
      return;
    }

    const url = `${this.THEME_DIR}${theme}.css`;
    this.linkTheme.setAttribute('href', url);

    // Clase global para logos/estilos oscuros
    if (theme.toLowerCase().includes('dark')) {
      document.body.classList.add('theme-dark');
    } else {
      document.body.classList.remove('theme-dark');
    }
  }

  /**
   * Marca con 'working' el .selector cuyo data-theme === themeName
   * (Buscamos en el DOM actual, útil si los botones están en Pages, AccountSettings, Sidebar, etc.)
   */
  markWorking(themeName: string): void {
    const links = document.querySelectorAll<HTMLElement>('.selector');
    links.forEach(elem => {
      elem.classList.remove('working');
      const btnTheme = elem.getAttribute('data-theme') ?? '';
      if (btnTheme === themeName) {
        elem.classList.add('working');
      }
    });
  }

  /**
   * Elimina <link rel="stylesheet"> que apunten a assets/css/colors/*
   * y que no sean #theme. Evita que queden themes cargados “duros”.
   */
  private removeStrayThemeLinks(): void {
    const links = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'));
    for (const l of links) {
      const href = l.getAttribute('href') || '';
      const isThemeLink = href.includes(this.THEME_DIR);
      const isMainTheme = l.id === 'theme';
      if (isThemeLink && !isMainTheme) {
        l.parentElement?.removeChild(l);
      }
    }
  }
}