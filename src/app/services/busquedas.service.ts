import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroment } from '../../environments/enviroments';
import { map } from 'rxjs';
import { UsuarioModel } from '../models/usuario.model';
import { HospitalModel } from '../models/hospital.model';
import { MedicosModel } from '../models/medicos.model';

const base_url = enviroment.base_url;

@Injectable({
  providedIn: 'root',
})
export class Busquedas {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: { 'x-token': this.token },
    };
  }

  private transformarUsuarios(resultados: any[]): UsuarioModel[] {
    return resultados.map(
      (user) =>
        new UsuarioModel(user.nombre, user.email, '', user.img, user.google, user.role, user.uid),
    );
  }

  private transformarHospitales(resultados: any[]): HospitalModel[] {
    return resultados;
  }
  private transformarMedicos(resultados: any[]): MedicosModel[] {
    return resultados;
  }

  busquedaGlobal(termino: string) {
    const url = `${base_url}/todo/${termino}`;

    return this.http.get(url, this.headers);
  }

  buscar<T>(tipo: 'usuarios' | 'medicos' | 'hospitales', termino: string = '') {
    const url = `${base_url}/todo/coleccion/${tipo}/${termino}`;

    return this.http.get<{ resultados: any[] }>(url, this.headers).pipe(
      map((resp) => {
        switch (tipo) {
          case 'usuarios':
            return this.transformarUsuarios(resp.resultados) as T[];

          case 'hospitales':
            return this.transformarHospitales(resp.resultados) as T[];

          case 'medicos':
            return this.transformarMedicos(resp.resultados) as T[];

          default:
            return [];
        }
      }),
    );
  }
}
