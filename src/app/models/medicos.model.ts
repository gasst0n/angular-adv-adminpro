import { HospitalModel } from './hospital.model';

interface MedicosUser {
  _id: string;
  nombre: string;
  img?: string;
}

export class MedicosModel {
  constructor(
    public nombre: string,
    public _id: string,
    public img?: string,
    public usuario?: MedicosUser,
    public hospital?: HospitalModel, // ✅ CLAVE
  ) {}
}
