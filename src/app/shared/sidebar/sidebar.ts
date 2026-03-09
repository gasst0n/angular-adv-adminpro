import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { SidebarService, SidebarMenuSection } from '../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.html',
  styles: ``,
  imports: [RouterLink, RouterLinkActive, NgFor, NgIf],
})
export class Sidebar {
  menuItems: SidebarMenuSection[] = [];

  constructor(private sidebarService: SidebarService) {
    this.menuItems = this.sidebarService.menu;
  }
}