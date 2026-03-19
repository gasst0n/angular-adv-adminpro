import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink, RouterModule } from "@angular/router";
import { NgIf } from "@angular/common";
import { Usuario } from '../../services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink, RouterModule, NgIf],
  templateUrl: './register.html',
  styleUrls:['register.css']
})
export class Register {

public formSubmitted = false

  public registerForm!: FormGroup;


  // VALIDACION

  constructor(private fb: FormBuilder,
              private usuarioService: Usuario,
              private router: Router
  ) {
    this.registerForm = this.fb.group({
      nombre:['fernando', [Validators.required]],
      email:['fernando@fernando.com', [Validators.required, Validators.email]],
      password:['1234', [Validators.required]],
      password2:['12345', [Validators.required]],
      terminos:[false, [Validators.required]],
    }, {
      validators: this.passwordsIguales('password',"password2")
    });


  }

  crearUsuario() {
    this.formSubmitted = true
    console.log(this.registerForm.value);

    if (this.registerForm.invalid) {
return;      
    }

// Realizar el postel si el form es valido

this.usuarioService.crearUsuario(this.registerForm.value).subscribe(resp => {
  console.log("usuario creado")
                this.router.navigateByUrl('/dashboard');

  console.log(resp);
},(err) => {
  //si sucede un error
  Swal.fire('Error',err.error.msg, 'error')
} )

  }

  campoNoValido(campo: string): boolean {

    if (this.registerForm.get(campo)?.invalid && this.formSubmitted) {
      return true
    } else {
      return false
    }
  }


  contrasenasNoValidas() {
    const pass1 = this.registerForm.get('password')?.value
    const pass2 = this.registerForm.get('password2')?.value

    if ((pass1 !== pass2) && this.formSubmitted) {
      return true
    } else {
      return false
    }
  }

  aceptaTerminos() {
    return !this.registerForm.get('terminos')?.value && this.formSubmitted
  }


passwordsIguales(pass1Name: string, pass2Name: string) {
return (FormGroup: FormGroup) => {

  const pass1Control = FormGroup.get(pass1Name)
  const pass2Control = FormGroup.get(pass2Name)

  if (pass1Control?.value === pass2Control?.value) {
    pass2Control?.setErrors(null)
  } else {
    pass2Control?.setErrors({ noEsIgual: true})
  }

}
}

}