import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { Usuario } from '../../services/usuario.service';
import Swal from 'sweetalert2';

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, RouterModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['login.css'],
})
export class Login implements AfterViewInit {
  // Referencia al botón de Google Sign-In
  @ViewChild('googleBtn') googleBtn!: ElementRef;

  public formSubmitted = false;
  public loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usuarioService: Usuario,
  ) {
    // Formulario reactivo de login
    this.loginForm = this.fb.group({
      email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      remember: [false],
    });
  }

  ngAfterViewInit(): void {
    this.googleInit();
  }

  // =========================
  // GOOGLE INIT
  // =========================
  googleInit(): void {
    if (!this.googleBtn) return;

    // Limpia el contenedor (por si se renderiza más de una vez)
    this.googleBtn.nativeElement.innerHTML = '';

    google.accounts.id.initialize({
      client_id: '449461293111-n0k388lgoj25jmh3gfdr82137pt13ven.apps.googleusercontent.com',
      callback: (response: any) => this.handleCredentialResponse(response),

      // Auto select solo en producción
      auto_select: window.location.hostname !== 'localhost',
    });

    google.accounts.id.renderButton(this.googleBtn.nativeElement, {
      theme: 'outline',
      size: 'large',
    });
  }

  // =========================
  // GOOGLE LOGIN
  // =========================
  handleCredentialResponse(response: any): void {
    if (!response?.credential) {
      Swal.fire('Error', 'No se pudo autenticar con Google', 'error');
      return;
    }

    this.usuarioService.loginGoogle(response.credential).subscribe({
      next: () => {
        this.router.navigateByUrl('/dashboard');
      },
      error: (err: any) => {
        Swal.fire('Error', err?.error?.msg || 'No se pudo iniciar sesión con Google', 'error');
      },
    });
  }

  // =========================
  // LOGIN NORMAL
  // =========================
  login(): void {
    this.formSubmitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    // ✅ EXTRAEMOS SOLO LO QUE EL BACKEND ESPERA
    const { email, password } = this.loginForm.value;

    this.usuarioService.login({ email, password }).subscribe({
      next: () => {
        // Recordar email si corresponde
        if (this.loginForm.get('remember')?.value) {
          localStorage.setItem('email', email);
        } else {
          localStorage.removeItem('email');
        }

        // Redirección post-login
        this.router.navigateByUrl('/dashboard');
      },
      error: (err: any) => {
        Swal.fire('Error', err?.error?.msg || 'Credenciales incorrectas', 'error');
      },
    });
  }
}
``;
