import { AfterViewInit, Component, ElementRef, ViewChild, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { Usuario } from '../../services/usuario.service';
import Swal from 'sweetalert2';

declare const google:any

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, RouterModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls:['login.css']
})
export class Login implements AfterViewInit{

  @ViewChild('googleBtn') googleBtn!: ElementRef


public formSubmitted = false

  public loginForm!: FormGroup;


  // VALIDACION

  constructor(private fb: FormBuilder,
              private router: Router,
              private usuarioService: Usuario
  ) {
    this.loginForm = this.fb.group({
      email:[localStorage.getItem('email') || '', [Validators.required, Validators.email]],
      password:['', [Validators.required]],
      remember: [false]
    })


    }

    ngAfterViewInit(): void {
      this.googleInit()
    }

googleInit() {

  if (!this.googleBtn) return;

  this.googleBtn.nativeElement.innerHTML = '';

  google.accounts.id.initialize({
    client_id: "449461293111-n0k388lgoj25jmh3gfdr82137pt13ven.apps.googleusercontent.com",
    callback: (response:any) => this.handleCredentialResponse(response),
  });

  google.accounts.id.renderButton(
    this.googleBtn.nativeElement,
    { theme: "outline", size: "large" }
  );
}
    handleCredentialResponse(response: any){
            console.log({esto: this})

      // console.log("Encoded JWT ID token: " + response.credential);
      this.usuarioService.loginGoogle(response.credential).subscribe(resp => {
        // console.log({login: resp})
              this.router.navigateByUrl('/dashboard');

      })
    }


login() {

  this.usuarioService.login(this.loginForm.value).subscribe(
    resp => {

      if (this.loginForm.get('remember')?.value) {
        localStorage.setItem('email', this.loginForm.get('email')?.value);
      } else {
        localStorage.removeItem('email');
      }


    },
    (err: any) => {
      Swal.fire('Error', err.error.msg, 'error');
    }
  );

}

}
