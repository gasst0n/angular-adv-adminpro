import { Component, OnDestroy } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { filter, map, Subscription } from 'rxjs';

type RutaData = { titulo: string }; // Tipamos el data esperado

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  templateUrl: './breadcrumbs.html',
  styles: ``,
})
export class Breadcrumbs implements OnDestroy {

  public titulo: string = '';
  public tituloSub$: Subscription;

  constructor(private router: Router) {
    this.tituloSub$ = this.getArgumentosRuta()
      .subscribe(({ titulo }: RutaData) => {   // <-- tipamos el parámetro
        this.titulo = titulo;
        document.title = `Admin - ${titulo}`;
      });
  }

  // Devolvemos un Observable<RutaData>
  private getArgumentosRuta() {
    return this.router.events.pipe(
      // Type guard: de acá en adelante 'e' es ActivationEnd
      filter((event): event is ActivationEnd => event instanceof ActivationEnd),
      // Solo eventos hoja (sin firstChild)
      filter((event) => event.snapshot.firstChild === null),
      // Tomamos los datos de la ruta
      map((event) => event.snapshot.data as RutaData)
    );
  }

  ngOnDestroy(): void {
    this.tituloSub$?.unsubscribe();
  }
}