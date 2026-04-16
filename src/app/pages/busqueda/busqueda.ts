import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Busquedas } from '../../services/busquedas.service';
import { UsuarioModel } from '../../models/usuario.model';
import { MedicosModel } from '../../models/medicos.model';
import { HospitalModel } from '../../models/hospital.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ImagenPipe } from '../../pipes/imagen-pipe';

@Component({
  selector: 'app-busqueda',
  standalone: true,
  imports: [FormsModule, CommonModule, ImagenPipe, ReactiveFormsModule, RouterLink],
  templateUrl: './busqueda.html',
})
export class Busqueda implements OnInit {
  public usuarios: UsuarioModel[] = [];
  public medicos: MedicosModel[] = [];
  public hospitales: HospitalModel[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private busquedasService: Busquedas,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ termino }) => {
      console.log('Término recibido:', termino);
      this.busquedaGlobal(termino);
    });
  }

  busquedaGlobal(termino: string): void {
    if (!termino || !termino.trim()) {
      this.limpiarResultados();
      return;
    }

    this.busquedasService.busquedaGlobal(termino).subscribe((resp: any) => {
      console.log('Respuesta búsqueda global:', resp);

      this.usuarios = resp.usuarios || [];
      this.medicos = resp.medicos || [];
      this.hospitales = resp.hospitales || [];

      // ✅ Forzamos detección de cambios
      this.cdr.detectChanges();
    });
  }

  private limpiarResultados(): void {
    this.usuarios = [];
    this.medicos = [];
    this.hospitales = [];
    this.cdr.detectChanges();
  }

  abrirMedico(medico: MedicosModel) {}
}
