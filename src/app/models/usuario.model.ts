import { enviroment } from "../../environments/enviroments"

const base_url = enviroment.base_url

export class UsuarioModel {

  constructor(
    public nombre: string,
    public email: string,
    public password?: string,
    public img?: string,
    public google?: boolean,
    public role?: string,
    public uid?: string,
  ) {}

  imprimirUsuario() {
    console.log(this.nombre)
  }

  get imagenURL(): string {

    // Imagen de Google (mejorar resolución)
    if (this.img?.includes('googleusercontent')) {
      return this.img.replace(/=s\d+-c$/, '=s400-c');
    }

    // Imagen externa (http/https)
    if (this.img?.startsWith('http')) {
      return this.img;
    }

    // Imagen subida a tu backend
    if (this.img) {
      return `${base_url}/upload/usuarios/${this.img}`;
    }

    // Imagen por defecto
    return `${base_url}/upload/usuarios/noimg.jpg`;
  }
}