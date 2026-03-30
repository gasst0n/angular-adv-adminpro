import { UsuarioModel } from "../models/usuario.model";


export interface CargarUsuarioResponse {
    total: number;
    usuarios: UsuarioModel[]

}