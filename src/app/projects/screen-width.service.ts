import { Injectable } from '@angular/core';
import { fromEvent, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScreenWidthService {

  isMobile = false

  private width$ = new BehaviorSubject<number>(window.innerWidth);
  width = this.width$.asObservable();


  constructor() {
      fromEvent(window, 'resize')
        .subscribe( () => {
          this.width$.next(window.innerWidth)
        })
  }
}

