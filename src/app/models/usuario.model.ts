import { enviroment } from '../../environments/enviroments';

const base_url = enviroment.base_url;

/**
 * Modelo Usuario
 * ✅ Compatible con TODO el proyecto original
 */
export class UsuarioModel {
  /** Evita cache de imagen */
  private cacheBust = Date.now();

  constructor(
    public nombre: string,
    public email: string,
    public password?: string,
    public img?: string,
    public google?: boolean,
    public role?: string, // ✅ string simple
    public uid: string = '',
  ) {}

  /**
   * URL de imagen segura
   */
  get imagenURL(): string {
    if (this.img?.includes('googleusercontent')) {
      return this.img.replace(/=s\d+-c$/, '=s400-c');
    }

    if (this.img?.startsWith('http')) {
      return this.img;
    }

    if (this.img) {
      return `${base_url}/upload/usuarios/${this.img}?v=${this.cacheBust}`;
    }

    return `${base_url}/upload/usuarios/noimg.jpg`;
  }
}
