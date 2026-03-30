import { enviroment } from '../../environments/enviroments';
const base_url = enviroment.base_url;

export class UsuarioModel {
  /**
   * Token estable de cache-busting
   * Se regenera solo cuando cambia la imagen
   */
  private cacheBust = Date.now();

  constructor(
    public nombre: string,
    public email: string,
    public password?: string,
    public img?: string,
    public google?: boolean,
    public role?: string,
    public uid: string = '',
  ) {}

  imprimirUsuario() {
    console.log(this.nombre);
  }

  /**
   * URL SEGURA para el template
   * (no cambia durante detección de cambios)
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

  /**
   * Se llama cuando el backend confirma cambio de imagen
   */
  refrescarImagen(nombreImg: string): void {
    this.img = nombreImg;
    this.cacheBust = Date.now();
  }
}
