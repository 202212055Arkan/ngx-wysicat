import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlockSettingsButtonService {
  private optionSelectedSubject = new Subject<string>();
  public optionSelected$ = this.optionSelectedSubject.asObservable();

  handleMenuOption(option: string): void {
    this.optionSelectedSubject.next(option);
  }
}
