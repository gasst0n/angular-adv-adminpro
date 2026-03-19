import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { RegisterForm } from '../interfaces/register-form.interface';
import { enviroment } from '../../environments/enviroments';
import { map, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

declare const google:any;

const base_url = enviroment.base_url;

@Injectable({
  providedIn: 'root',
})
export class Usuario {

constructor (private http: HttpClient,
            private router: Router,
            private ngZone: NgZone
) {}

logout() {
localStorage.removeItem('token');
  // NO borrar theme
  // NO borrar preferencias
  google.accounts.id.disableAutoSelect();

  this.ngZone.run(() => {
    this.router.navigateByUrl('/login');
  });
}

validarToken(): Observable<boolean> {
  const token = localStorage.getItem('token') || '';

  return this.http.get(`${base_url}/login/renew`, {
    headers: {
      'x-token': token
    }
  }).pipe(
    tap((resp:any) => {
      localStorage.setItem('token', resp.token)
    }),map(resp => true )
  )
}
//LOCALSTORAGE
crearUsuario(formData: RegisterForm){
return this.http.post(`${base_url}/usuarios`, formData).pipe(
  tap((resp: any) => {
localStorage.setItem('token', resp.token)  })
)
}

login(formData: RegisterForm){
return this.http.post(`${base_url}/login`, formData).pipe(
  tap((resp: any) => {
localStorage.setItem('token', resp.token)  })
)
}

loginGoogle(token: string ) {
  return this.http.post(`${base_url}/login/google`,{token}).pipe(
    tap((resp:any)=> {
      console.log(resp)
      localStorage.setItem('token', resp.token)
    })
  )
}

}
