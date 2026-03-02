// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';


// 👇 IMPORTANTE: esto hace funcionar Chart.js en Angular standalone
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    // 👉 Habilitamos ng2-charts en toda la app
    provideCharts(withDefaultRegisterables()),
  ],
};