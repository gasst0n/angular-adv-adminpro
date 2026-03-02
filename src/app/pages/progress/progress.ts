import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Incrementador } from '../../components/incrementador/incrementador';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule, FormsModule, Incrementador],
  templateUrl: './progress.html',
  styles: ``,
})
export class Progress {
  progreso:  number = 15;
  progreso2: number = 10;

  get getPorcentaje()  { return `${this.progreso}%`;  }
  get getPorcentaje2() { return `${this.progreso2}%`; }

  // (opcionales) por si usás botones en el padre
  cambiarValor(delta: number)  { this.progreso  = Math.max(0, Math.min(100, this.progreso  + delta)); }
  cambiarValor2(delta: number) { this.progreso2 = Math.max(0, Math.min(100, this.progreso2 + delta)); }
}