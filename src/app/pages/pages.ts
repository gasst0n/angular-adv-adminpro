// src/app/pages/pages.ts
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../shared/header/header';
import { Sidebar } from '../shared/sidebar/sidebar';
import { Breadcrumbs } from '../shared/breadcrumbs/breadcrumbs';
import { SettingsService } from '../services/settings'; // <- tu servicio settings.ts

declare function customInitFuncionts(): void;
  


@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [RouterOutlet, Header, Sidebar, Breadcrumbs],
  templateUrl: './pages.html',
})
export class Pages implements OnInit, AfterViewInit {

  constructor(private settings: SettingsService) {}

  ngOnInit(): void {

    customInitFuncionts();
    // Inicializa: limpia links extra, crea/obtiene #theme, aplica saved/default, marca working
    this.settings.init('default'); // o 'default-dark'
  }

  ngAfterViewInit(): void {
    // Por si los .selector de este layout no existían aún al init, re-marcamos:
    const current = this.settings.getTheme() || 'default';
    this.settings.markWorking(current);
  }

  // Helpers para template
  getTheme(): string | null {
    return this.settings.getTheme();
  }

  setTheme(theme: string): void {
    this.settings.setTheme(theme);
  }
}