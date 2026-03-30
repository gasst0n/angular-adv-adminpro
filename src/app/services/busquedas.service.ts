import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CargarUsuarioResponse } from '../interfaces/cargar-usuarios.interface';
import { enviroment } from '../../environments/enviroments';
import { map } from 'rxjs';
import { UsuarioModel } from '../models/usuario.model';

const base_url = enviroment.base_url;


@Injectable({
  providedIn: 'root',
})
export class Busquedas {

  constructor(private http: HttpClient){}

    get token(): string {
    return localStorage.getItem('token') || '';
  }

    get headers() {
    return {
      headers: { 'x-token': this.token }
    };
  }

private transformarUsuarios (resultados: any[]): UsuarioModel[] {
  return resultados.map(
    user => new UsuarioModel( user.nombre,
              user.email,
              '',
              user.img,
              user.google,
              user.role,
              user.uid)
  )
}

  buscar(tipo: 'usuarios'|'medicos'|'hospitales',
    termino: string = ''
  ){
        const url = `${base_url}/todo/coleccion/${tipo}/${termino}`;
        return this.http.get<any[]>(url, this.headers)
        .pipe(
          map((resp:any) => {
            switch (tipo) {
              case 'usuarios':
                return this.transformarUsuarios(resp.resultados)
                break;
            
              default:
                return [];
            }
          })
        )
  }

}
