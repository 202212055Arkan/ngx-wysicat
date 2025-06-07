import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlockCreateButtonService {
  private optionSelectedSubject = new Subject<string>();
  public optionSelected$ = this.optionSelectedSubject.asObservable();

  public handleMenuOption(option: string): void {
    this.optionSelectedSubject.next(option);
  }
}
