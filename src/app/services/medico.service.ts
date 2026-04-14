import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroment } from '../../environments/enviroments';
import { MedicosModel } from '../models/medicos.model';
import { delay, map } from 'rxjs';

const base_url = enviroment.base_url;

@Injectable({
  providedIn: 'root',
})
export class MedicoService {
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

  cargarMedicos(desde: number = 0) {
    return this.http
      .get<{
        ok: boolean;
        medicos: MedicosModel[];
      }>(`${base_url}/medicos?desde=${desde}`, this.headers)
      .pipe(
        delay(1000),
        map((resp: { ok: boolean; medicos: MedicosModel[] }) => resp.medicos),
      );
  }

  // CARGAR MEDICOS POR ID

  getMedicoporId(id: string) {
    return this.http
      .get<{
        ok: boolean;
        medico: MedicosModel;
      }>(`${base_url}/medicos/${id}`, this.headers)
      .pipe(map((resp) => resp.medico));
  }

  // CREATE HOSPITAL

  crearMedicos(medico: { nombre: string; hospital: string }) {
    const url = `${base_url}/medicos/`;

    const headers = new HttpHeaders({
      'x-token': this.token,
      'Content-Type': 'application/json',
    });

    return this.http.post(url, medico, { headers });
  }

  // ACTUALIZAR HOSPITAL

  actualizarMedicos(_id: string, nombre: string) {
    const url = `${base_url}/medicos/${_id}`;
    return this.http.put(url, { nombre }, this.headers);
  }

  // ELIMINAR HOSPITAL

  borrarMedicos(_id: string) {
    const url = `${base_url}/medicos/${_id}`;

    return this.http.delete(url, this.headers);
  }
}
