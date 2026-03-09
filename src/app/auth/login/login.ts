import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls:['login.css']
})
export class Login {

  constructor( private router: Router) {}


login(){


this.router.navigateByUrl('/dashboard');
}


}
