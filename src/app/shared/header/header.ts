import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Usuario } from '../../services/usuario.service';

@Component({
  selector: 'app-header',
    standalone:true,

  templateUrl: './header.html',
  styles: ``,
  imports:[RouterLink, RouterLinkActive]
})
export class Header {
constructor (private usuarioService: Usuario){}

logout() {
  this.usuarioService.logout()
}

}
