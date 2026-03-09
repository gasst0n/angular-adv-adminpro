import { Component, OnDestroy } from '@angular/core';
import { filter, interval, map, Observable, retry, Subscription, take } from 'rxjs';

@Component({
  selector: 'app-rxjs',
  imports: [],
  standalone:true,
  templateUrl: './rxjs.html',
  styles: ``,
})
export class Rxjs implements OnDestroy {

public intervalSubs: Subscription;

constructor () {
  

  // this.retornaObservable().pipe(
  //   retry(2)
  // )
  // .subscribe(
  //   valor => console.log('Subs:',valor), 
  //   (error) => console.warn('Error', error),
  //   () => console.info('OBS TERMINADO')
  // )

this.intervalSubs = this.retornaIntervalo()
    .subscribe( console.log )
    

}

// imporntate para cortar los observables sino te consumen la RAM

ngOnDestroy(): void {
  this.intervalSubs.unsubscribe();
}


retornaIntervalo(): Observable<number> {

  return interval(100) //RESPETAR POSICIONES Y PRIORIDADES VAN EN ORDEN
        .pipe(
          // take(10),
          map(valor => valor +1),
          filter(valor => (valor % 2 === 0) ? true: false),
        )


}

retornaObservable(): Observable<number> {
    let i = -1; // I SIEMPRE MANTIENE ESETE VALOR AL INICIO
  
return new Observable<number> ( observer => {
    
    
    
    const intervalo = setInterval(() => {
      
      i++;

      observer.next(i);

      if (i === 4 ) {

        clearInterval( intervalo);
        observer.complete();

      }

      if (i === 2 ) {
        clearInterval( intervalo);
        observer.error('i llego al valor');

      }

    }, 1000);


  })



}

}
