import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { Usuario } from '../../services/usuario.service';
import Swal from 'sweetalert2';

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, RouterModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['login.css']
})
export class Login implements AfterViewInit {

  @ViewChild('googleBtn') googleBtn!: ElementRef;

  public formSubmitted = false;
  public loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usuarioService: Usuario
  ) {
    this.loginForm = this.fb.group({
      email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      remember: [false]
    });
  }

  ngAfterViewInit(): void {
    this.googleInit();
  }

  // =========================
  // GOOGLE INIT
  // =========================
  googleInit() {

    if (!this.googleBtn) return;

    // Limpia por si se renderiza más de una vez
    this.googleBtn.nativeElement.innerHTML = '';

    google.accounts.id.initialize({
      client_id: "449461293111-n0k388lgoj25jmh3gfdr82137pt13ven.apps.googleusercontent.com",
      callback: (response: any) => this.handleCredentialResponse(response),
        auto_select: window.location.hostname !== 'localhost'  // ⚡ solo auto_select en producción
    });

    google.accounts.id.renderButton(
      this.googleBtn.nativeElement,
      { theme: "outline", size: "large" }
    );

    // Opcional: mostrar popup automático
    // google.accounts.id.prompt();
  }

  // =========================
  // GOOGLE LOGIN
  // =========================
 handleCredentialResponse(response: any) {
  console.log('[GIS] response:', response);
  if (!response?.credential) {
    console.warn('[GIS] Sin credential');
    return;
  }

  this.usuarioService.loginGoogle(response.credential)
    .subscribe({
      next: () => {
        console.log('[API] loginGoogle OK, redirigiendo…');
        this.router.navigateByUrl('/dashboard');
      },
      error: (err: any) => {
        console.error('[API] loginGoogle ERROR:', err);
        Swal.fire('Error', err?.error?.msg || 'No se pudo iniciar con Google', 'error');
      }
    });
}

  // =========================
  // LOGIN NORMAL
  // =========================
  login() {

    this.formSubmitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.usuarioService.login(this.loginForm.value)
      .subscribe({
        next: () => {

          // recordar email
          if (this.loginForm.get('remember')?.value) {
            localStorage.setItem('email', this.loginForm.get('email')?.value);
          } else {
            localStorage.removeItem('email');
          }

          // 👇 REDIRECCIÓN (LO QUE TE FALTABA)
          this.router.navigateByUrl('/dashboard');
        },
        error: (err: any) => {
          Swal.fire('Error', err.error.msg || 'Credenciales incorrectas', 'error');
        }
      });
  }
}