import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroment } from '../../environments/enviroments';
import { delay, map } from 'rxjs';
import { HospitalModel } from '../models/hospital.model';

const base_url = enviroment.base_url;

@Injectable({
  providedIn: 'root',
})
export class HospitalService {
  constructor(private http: HttpClient) {}

  // 🔐 Token / UID
  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: { 'x-token': this.token },
    };
  }

  // READ HOSPITALES

  cargarHospitales(desde: number = 0) {
    return this.http
      .get<{
        ok: boolean;
        hospitales: HospitalModel[];
      }>(`${base_url}/hospitales?desde=${desde}`, this.headers)
      .pipe(
        delay(1000),
        map((resp: { ok: boolean; hospitales: HospitalModel[] }) => resp.hospitales),
      );
  }

  // CREATE HOSPITAL

  crearHospitales(nombre: string) {
    const url = `${base_url}/hospitales/`;

    return this.http.post(url, { nombre }, this.headers);
  }

  // ACTUALIZAR HOSPITAL

  actualizarHospitales(_id: string, nombre: string) {
    const url = `${base_url}/hospitales/${_id}`;

    return this.http.put(url, { nombre }, this.headers);
  }

  // ELIMINAR HOSPITAL

  borrarHospitales(_id: string) {
    const url = `${base_url}/hospitales/${_id}`;

    return this.http.delete(url, this.headers);
  }
}
