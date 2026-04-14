import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

// Services
import { HospitalService } from '../../../services/hospital.service';
import { MedicoService } from '../../../services/medico.service';

// Models
import { HospitalModel } from '../../../models/hospital.model';
import { MedicosModel } from '../../../models/medicos.model';

// Pipes
import { ImagenPipe } from '../../../pipes/imagen-pipe';
import { delay, timer } from 'rxjs';

@Component({
  selector: 'app-medico',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ImagenPipe],
  templateUrl: './medico.html',
  styles: [],
})
export class Medico implements OnInit {
  // ✅ Formulario reactivo
  public medicoForm!: FormGroup;

  // ✅ Catálogo de hospitales
  public hospitales: HospitalModel[] = [];

  // ✅ Hospital seleccionado (tarjeta derecha)
  public hospitalSeleccionado: HospitalModel | null = null;

  // ✅ Médico cargado si estamos editando
  public medicoSeleccionado: MedicosModel | null = null;

  constructor(
    private fb: FormBuilder,
    private hospitalService: HospitalService,
    private medicoService: MedicoService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    /* ======================================================
       1️⃣ CREAR EL FORMULARIO (SIEMPRE PRIMERO)
    ====================================================== */
    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required],
    });

    /* ======================================================
       2️⃣ CARGAR HOSPITALES (async)
    ====================================================== */
    this.cargarHospitales();

    /* ======================================================
       3️⃣ ESCUCHAR CAMBIOS EN LA URL
       /dashboard/medico/:id
    ====================================================== */
    this.activatedRoute.params.subscribe(({ id }) => {
      if (id && id !== 'nuevo') {
        this.cargarMedico(id);
      }
    });

    /* ======================================================
       4️⃣ ESCUCHAR CAMBIO DE HOSPITAL EN EL SELECT
       (para mostrar tarjeta derecha)
    ====================================================== */
    this.medicoForm.get('hospital')?.valueChanges.subscribe((hospitalId) => {
      this.hospitalSeleccionado = this.hospitales.find((h) => h._id === hospitalId) ?? null;
    });
  }

  /* ======================================================
     CARGAR MÉDICO POR ID (MODO EDICIÓN)
  ====================================================== */
  cargarMedico(id: string): void {
    this.medicoService.getMedicoporId(id).subscribe({
      next: (medico) => {
        this.medicoSeleccionado = medico;

        if (!medico.hospital) return;

        this.medicoForm.patchValue({
          nombre: medico.nombre,
          hospital: medico.hospital._id,
        });

        this.hospitalSeleccionado = medico.hospital;
      },
      error: () => {
        // ✅ acá entra si no existe el médico
        this.router.navigateByUrl('/dashboard/medicos');
      },
    });
  }

  /* ======================================================
     CARGAR LISTA DE HOSPITALES
  ====================================================== */
  cargarHospitales(): void {
    this.hospitalService.cargarHospitales().subscribe((hospitales) => {
      this.hospitales = hospitales;

      // ✅ Re-sincronizar select si el médico ya estaba cargado
      if (this.medicoSeleccionado?.hospital) {
        this.medicoForm.patchValue({
          hospital: this.medicoSeleccionado.hospital._id,
        });
        this.hospitalSeleccionado = this.medicoSeleccionado.hospital;
      }
    });
  }

  /* ======================================================
     GUARDAR (CREAR / ACTUALIZAR)
  ====================================================== */
  guardarMedico(): void {
    if (this.medicoForm.invalid) {
      return;
    }

    const medicoData = this.medicoForm.value;

    // ✅ MODO EDICIÓN
    if (this.medicoSeleccionado) {
      this.medicoService
        .actualizarMedicos(this.medicoSeleccionado._id, medicoData.nombre)
        .subscribe(() => {
          Swal.fire('Actualizado', medicoData.nombre, 'success');
        });
      this.router.navigateByUrl(`/dashboard/medicos`);

      return;
    }

    // ✅ MODO CREACIÓN
    this.medicoService.crearMedicos(medicoData).subscribe((resp: any) => {
      Swal.fire('Creado', medicoData.nombre, 'success');
      timer(1000).subscribe(() => {
        this.router.navigateByUrl(`/dashboard/medico/${resp.medico._id}`);
      });
    });
  }
}
