import { inject, Injectable, OnDestroy } from '@angular/core';
import Quill from 'quill';
import { fromEvent, Subject, takeUntil } from 'rxjs';

import { WysicatPlugin } from '../plugin-system';

import { DisplaySize } from './modules/display-size';
import { Resize } from './modules/resize';
import { DEFAULT_IMAGE_RESIZOR_CONFIG, ImageResizorOptions } from './image-resizor.models';
import { ImageResizorStateService } from './image-resizor.state';

@Injectable({
  providedIn: 'root',
})
export class ImageResizorPlugin implements WysicatPlugin, OnDestroy {
  id = 'image-resizor';
  name = 'Image Resizor';

  private readonly resizeService = inject(Resize);
  private readonly displaySizeService = inject(DisplaySize);
  private readonly stateService = inject(ImageResizorStateService);
  private quill!: Quill;
  private destroy$ = new Subject<void>();

  initialize(quill: Quill): void {
    this.quill = quill;

    this.stateService.updateState({
      options: DEFAULT_IMAGE_RESIZOR_CONFIG,
      quill: quill,
    });

    const parent = quill.root.parentNode as HTMLElement;

    if (parent && parent.style) {
      parent.style.position = parent.style.position || 'relative';
    }

    fromEvent<MouseEvent>(quill.root, 'click')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => this.handleClick(event));

    fromEvent<KeyboardEvent>(quill.root, 'keyup')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => this.checkImageKeyUp(event));

    fromEvent<Event>(quill.root, 'input')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => this.checkImageInput(event));

    this.stateService.windowResize$.pipe(takeUntil(this.destroy$)).subscribe(() => this.repositionElements());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeModules(): void {
    this.resizeService.onCreate();
    this.displaySizeService.onCreate();

    this.onUpdate();

    this.resizeService.dragChanged$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.onUpdate();
    });
  }

  onUpdate(): void {
    this.repositionElements();
    this.resizeService.onUpdate();
    this.displaySizeService.onUpdate();
  }

  handleClick(evt: Event): void {
    const state = this.stateService.getState();
    const target = evt.target as HTMLImageElement;
    if (target && target.tagName === 'IMG') {
      if (state.img === target) {
        return;
      }
      if (state.img) {
        this.hide();
      }
      this.show(target);
    } else if (state.img) {
      this.hide();
    }
  }

  show(img: HTMLImageElement): void {
    this.stateService.updateState({ img });
    this.showOverlay();
    this.initializeModules();
  }

  showOverlay(): void {
    const state = this.stateService.getState();

    if (state.overlay) {
      this.hideOverlay();
    }

    if (!this.quill) {
      return;
    }

    const overlay = document.createElement('div');
    const options = state.options as ImageResizorOptions;

    if (options?.overlayStyles) {
      Object.assign(overlay.style, options.overlayStyles);
    }

    fromEvent<MouseEvent>(overlay, 'click')
      .pipe(takeUntil(this.destroy$))
      .subscribe((evt) => {
        evt.stopPropagation();
      });

    this.quill.root.parentNode!.appendChild(overlay);
    this.stateService.updateState({ overlay });

    fromEvent(window, 'resize')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.stateService.emitWindowResize();
      });

    this.repositionElements();
  }

  hideOverlay(): void {
    const state = this.stateService.getState();
    if (!state.overlay) {
      return;
    }

    const parent = this.quill?.root.parentNode;
    if (parent && state.overlay) {
      parent.removeChild(state.overlay);
    }

    this.stateService.updateState({ overlay: undefined });
  }

  repositionElements(): void {
    const state = this.stateService.getState();
    if (!state.overlay || !state.img) {
      return;
    }

    const parent = this.quill?.root.parentNode as HTMLElement;

    if (!parent) {
      return;
    }

    const imgRect = state.img.getBoundingClientRect();
    const containerRect = parent.getBoundingClientRect();

    Object.assign(state.overlay.style, {
      left: `${imgRect.left - containerRect.left - 1 + parent.scrollLeft}px`,
      top: `${imgRect.top - containerRect.top + parent.scrollTop}px`,
      width: `${imgRect.width}px`,
      height: `${imgRect.height}px`,
    });
  }

  hide(): void {
    this.hideOverlay();
    this.stateService.updateState({ img: undefined });
  }

  checkImageKeyUp(evt: KeyboardEvent): void {
    const state = this.stateService.getState();
    if (state.img) {
      if (evt.key === 'Escape') {
        this.hide();
        return;
      }
      if (evt.key === 'Delete' || evt.key === 'Backspace') {
        this.quill?.deleteText(this.quill.getSelection()?.index || 0, 1);
        this.hide();
        return;
      }
    }
  }

  checkImageInput(evt: Event): void {
    const state = this.stateService.getState();
    if (state.img) {
      const index = this.quill?.getSelection()?.index;
      if (!index) {
        return;
      }
      const length = this.quill?.getLength() || 0;
      if (index >= length - 1) {
        this.hide();
      }
    }
  }
}
