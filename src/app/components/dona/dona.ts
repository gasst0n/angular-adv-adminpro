import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dona',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dona.html',
})
export class Dona implements OnChanges {

  /** ===== Inputs ===== */
  @Input() title: string = 'Sin titulo';
  @Input() labels: string[] = ['Computadoras', 'Impresoras', 'Servidores'];
  @Input() data: number[] = [500, 250, 100];
  @Input() colors?: string[];
  @Input() legend: 'top' | 'bottom' | 'left' | 'right' = 'bottom';

  /** 🔥 IMPORTANTE: tipo fijo */
  public type: 'doughnut' = 'doughnut';

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  /** Data tipado correctamente */
  public chartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: this.labels,
    datasets: [
      {
        data: this.data,
        backgroundColor: this.colors ?? ['#6857E6', '#009FEE', '#F02059'],
      }
    ]
  };

  /** Options tipado correctamente */
  public options: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: { position: this.legend },
      title: { display: true, text: this.title },
      tooltip: { enabled: true },
    },
    cutout: '60%',
    animation: {
      animateRotate: true,
      animateScale: true,
    },
  };

  ngOnChanges(changes: SimpleChanges): void {

    this.chartData = {
      labels: this.labels,
      datasets: [
        {
          data: this.data,
          backgroundColor: this.colors ?? ['#6857E6', '#009FEE', '#F02059'],
        }
      ]
    };

    this.options = {
      ...this.options,
      plugins: {
        ...this.options.plugins,
        legend: { position: this.legend },
        title: { display: true, text: this.title },
        tooltip: { enabled: true },
      }
    };

    this.chart?.update();
  }
}