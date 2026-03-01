// src/app/pages/pages.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../shared/header/header';
import { Sidebar } from '../shared/sidebar/sidebar';
import { Breadcrumbs } from '../shared/breadcrumbs/breadcrumbs';

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [
    RouterOutlet,
    Header,
    Sidebar,
    Breadcrumbs,
  ],
  templateUrl: './pages.html',
})
export class Pages {}