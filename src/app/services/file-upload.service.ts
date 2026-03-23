import { Injectable } from '@angular/core';
import { enviroment } from '../../environments/enviroments';

const base_url = enviroment.base_url;

@Injectable({
  providedIn: 'root',
})
export class FileUpload {

  constructor() {}

  async actualizarFoto(
    archivo: File,
    tipo: 'usuarios'|'medicos'|'hospitales',
    id: string
  ): Promise<any> { // 🔹 siempre indicar tipo de retorno
    try {

      const url = `${base_url}/upload/${tipo}/${id}`;
      const formData = new FormData();
      formData.append('imagen', archivo);

      const resp = await fetch(url, {
        method: 'PUT',
        headers: {
          'x-token': localStorage.getItem('token') || ''
          // ❌ NO pongas 'Content-Type': 'multipart/form-data'
        },
        body: formData
      });

      const data = await resp.json();
      

      if (data.ok) {
        return data.nombreArchivo;
      } else {
        console.log(data.msg)
        return false
      }
      
      console.log(data)
      return 'nombre de la imagen'

      // 🔹 Leer respuesta como JSON

    } catch (error) {
      console.error('Error catch:', error);
      return false;
    }
  }
}