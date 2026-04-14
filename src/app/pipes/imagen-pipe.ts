import { Pipe, PipeTransform } from '@angular/core';
import { enviroment } from '../../environments/enviroments';

const base_url = enviroment.base_url;

@Pipe({
  name: 'imagen',
  standalone: true, // 👈 CLAVE
})
export class ImagenPipe implements PipeTransform {
  transform(img: string | undefined, tipo: 'usuarios' | 'medicos' | 'hospitales'): string {
    if (!img) {
      return `${base_url}/upload/usuarios/no-image`;
    }

    if (img.includes('https')) {
      return img;
    }

    return `${base_url}/upload/${tipo}/${img}`;
  }
}
