// src/app/pages/account-settings/account-settings.ts
import { Component, AfterViewInit } from '@angular/core';
import { SettingsService } from '../../services/settings';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  templateUrl: './account-settings.html',
})
export class AccountSettings implements AfterViewInit {
  constructor(private settings: SettingsService) {}

  ngAfterViewInit(): void {
    const current = this.settings.getTheme() || 'default';
    this.settings.markWorking(current);
  }

  changeTheme(theme: string) {
    this.settings.setTheme(theme);
  }
}