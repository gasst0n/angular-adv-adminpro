import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
    standalone:true,

  templateUrl: './header.html',
  styles: ``,
  imports:[RouterLink, RouterLinkActive]
})
export class Header {}
