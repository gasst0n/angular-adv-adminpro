interface _HospitalUser {
  _id: string;
  nombre: string;
  img: string;
}

export class HospitalModel {
  constructor(
    public nombre: string,
    public _id: string,
    public img?: string,
    public usuario?: _HospitalUser,
  ) {}
}
