// src/app/auth/auth.routes.ts
import { Routes } from '@angular/router';
import { Login } from './login/login';         // standalone component
import { Register } from './register/register'; // standalone component

// (Opcional) guest guard para bloquear si ya está logueado


export const AUTH_ROUTES: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register},
];