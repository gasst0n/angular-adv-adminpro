import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-incrementador',
  standalone: true,
  imports: [CommonModule],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Incrementador),
    multi: true,
  }],
  template: `
    <div class="input-group">
      <button
        type="button"
        [class]="computedBtnClass"
        (click)="inc(-step)"
        [disabled]="disabled || value <= min"
        aria-label="Restar {{step}}">
        <i class="fa fa-minus"></i>
      </button>

      <input
        type="number"
        class="form-control text-center"
        placeholder="Progreso"
        [value]="value"
        [attr.min]="min"
        [attr.max]="max"
        [disabled]="disabled"
        (input)="onInput($any($event.target).value)"
        (change)="onchange($event)"
        (blur)="onTouched()"
        [class.is-invalid]="outOfRange"
      >

      <button
        type="button"
        [class]="computedBtnClass"
        (click)="inc(step)"
        [disabled]="disabled || value >= max"
        aria-label="Sumar {{step}}">
        <i class="fa fa-plus"></i>
      </button>
    </div>
  `,
})
export class Incrementador implements ControlValueAccessor, OnInit {
  /** Variante del botón: 'btn-primary', 'btn-outline-primary', etc. (sin el prefijo 'btn') */
  @Input() btnClass: string = 'btn-primary';
  @Input() min = 0;
  @Input() max = 100;
  @Input() step = 5;

  /** Estado del control (CVA) */
  value = 0;
  disabled = false;

  /** Clase final computada para los botones */
  computedBtnClass = 'btn btn-primary';

  /** Flag para mostrar el borde rojo de Bootstrap antes del clamp */
  outOfRange = false;

  ngOnInit(): void {
    this.computedBtnClass = `btn ${this.btnClass}`;
  }

  // ====== CVA ======
  private onChange: (v: number) => void = () => {};
  private onTouchedCb: () => void = () => {};

  registerOnChange(fn: (v: number) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouchedCb = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }

  writeValue(v: number | null): void {
    const n = Number(v ?? 0);
    this.value = this.clamp(Number.isFinite(n) ? n : 0);
  }

  // ====== Helpers ======
  private clamp(n: number) {
    return Math.min(this.max, Math.max(this.min, n));
  }

  // ====== Interacción UI ======
  inc(delta: number) {
    this.value = this.clamp(this.value + delta);
    this.onChange(this.value);
    this.onTouchedCb();
    // Los botones ya aplican clamp, por lo que no hay "fuera de rango"
    this.outOfRange = false;
  }

  onInput(v: any) {
    // 1) Detectamos fuera de rango con el valor crudo del input
    const raw = Number(v);
    this.outOfRange = Number.isFinite(raw) && (raw > this.max || raw < this.min);

    // 2) Normalizamos (clamp) y notificamos al form
    this.value = this.clamp(Number.isFinite(raw) ? raw : this.min);
    this.onChange(this.value);
  }

  onchange(event: Event) {
    const input = event.target as HTMLInputElement;
    const raw = Number(input.value);

    // Flag antes del clamp
    this.outOfRange = Number.isFinite(raw) && (raw > this.max || raw < this.min);

    // Normalizamos y notificamos
    this.value = this.clamp(Number.isFinite(raw) ? raw : this.min);
    this.onChange(this.value);
    this.onTouchedCb();
  }

  onTouched() {
    this.onTouchedCb();
  }
}