import { Injectable, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { ImageResizorOptions } from '../image-resizor.models';
import { ImageResizorStateService } from '../image-resizor.state';

@Injectable({
  providedIn: 'root',
})
export class DisplaySize implements OnDestroy {
  display: HTMLDivElement | null = null;
  private destroy$ = new Subject<void>();

  constructor(private stateService: ImageResizorStateService) {
    this.stateService.state$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.display) {
        this.onUpdate();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCreate(): void {
    this.display = document.createElement('div');
    const state = this.stateService.getState();
    const options = state.options as ImageResizorOptions;
    const overlay = state.overlay;

    if (options?.displayStyles && this.display && overlay) {
      Object.assign(this.display.style, options.displayStyles);
      overlay.appendChild(this.display);
    }
  }

  onUpdate(): void {
    if (!this.display) {
      return;
    }

    const state = this.stateService.getState();
    const img = state.img;
    if (!img) {
      return;
    }

    const size = this.getCurrentSize();
    this.display.innerHTML = size.join(' &times; ');
    const rect = img.getBoundingClientRect();

    this.display.style.right = '4px';
    this.display.style.bottom = '4px';
    this.display.style.left = 'auto';

    if (img.style.float === 'right') {
      this.display.style.right = 'auto';
      this.display.style.left = '4px';
    }

    const widthDiff = rect.width - parseInt(this.display.style.width, 10);
    const heightDiff = rect.height - parseInt(this.display.style.height, 10);
    const floatVal = img.style.float;

    if (widthDiff < 0 || heightDiff < 0 || floatVal === 'right') {
      this.display.style.right = 'auto';
      this.display.style.left = '4px';
    }
  }

  getCurrentSize(): number[] {
    const state = this.stateService.getState();
    const img = state.img;
    return img ? [img.width, img.height] : [0, 0];
  }
}
