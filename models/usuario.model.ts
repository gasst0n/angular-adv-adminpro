
// MODELO PARA CONECTAR LOGIN FRONT CON DB 

export class Usuario {

    constructor(

        public nombre: string,
        public img: string,
        public password: string,
        public google: boolean,
        public role: string,
        public uid?: string,
    ) {}
}