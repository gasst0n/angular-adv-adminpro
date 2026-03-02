// src/app/pages/grafica1/grafica1.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dona } from "../../components/dona/dona";

@Component({
  selector: 'app-grafica1',
  standalone: true,
  imports: [CommonModule, Dona],
  templateUrl: './grafica1.html',
})
export class Grafica1 {

  public labels1: string[] = [
    'Pan',
    'Gaseosa',
    'Carne'
  ];

  public data1: number[] = [
    120,
    150,
    90
  ];

  public labels2: string[] = [
    'Boca',
    'River',
    'Racing'
  ];

  public data2: number[] = [
    200,
    150,
    90
  ];

}