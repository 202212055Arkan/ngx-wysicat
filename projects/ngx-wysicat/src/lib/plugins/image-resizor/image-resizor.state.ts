import { Injectable, signal } from '@angular/core';
import Quill from 'quill';
import { BehaviorSubject, Subject } from 'rxjs';

import { ImageResizorOptions } from './image-resizor.models';

export interface ImageResizorState {
  overlay?: HTMLDivElement;
  img?: HTMLImageElement;
  options: ImageResizorOptions | null;
  quill?: Quill | null;
  moduleClasses?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class ImageResizorStateService {
  private readonly stateSignal = signal<ImageResizorState>({
    overlay: undefined,
    img: undefined,
    options: null,
  });

  private stateSubject = new BehaviorSubject<ImageResizorState>({
    overlay: undefined,
    img: undefined,
    options: null,
  });

  state$ = this.stateSubject.asObservable();

  private windowResizeSubject = new Subject<void>();
  windowResize$ = this.windowResizeSubject.asObservable();

  getState(): ImageResizorState {
    return this.stateSignal();
  }

  updateState(newState: Partial<ImageResizorState>): void {
    this.stateSignal.update((state) => {
      const updatedState = { ...state, ...newState };
      this.stateSubject.next(updatedState);
      return updatedState;
    });
  }

  emitWindowResize(): void {
    this.windowResizeSubject.next();
  }
}
