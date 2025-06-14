import { Injectable, OnDestroy } from '@angular/core';
import { fromEvent, Subject, takeUntil } from 'rxjs';

import { ImageResizorOptions } from '../image-resizor.models';
import { ImageResizorStateService } from '../image-resizor.state';

@Injectable({
  providedIn: 'root',
})
export class Resize implements OnDestroy {
  boxes: HTMLDivElement[] = [];
  dragBox: HTMLDivElement | null = null;
  dragStartX = 0;
  preDragWidth = 0;

  public dragChanged$ = new Subject<void>();
  private destroy$ = new Subject<void>();

  constructor(private stateService: ImageResizorStateService) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.dragChanged$.complete();
  }

  onCreate(): void {
    this.boxes = [];
    this.addBox('nwse-resize');
    this.addBox('nesw-resize');
    this.addBox('nwse-resize');
    this.addBox('nesw-resize');
    this.positionBoxes();
  }

  onUpdate(): void {
    this.positionBoxes();
  }

  positionBoxes(): void {
    const state = this.stateService.getState();
    const overlay = state.overlay;
    const img = state.img;

    if (!overlay || !img) {
      return;
    }

    const handleXOffset = -5;
    const handleYOffset = -5;

    [
      { left: `${handleXOffset}px`, top: `${handleYOffset}px` },
      { right: `${handleXOffset}px`, top: `${handleYOffset}px` },
      { right: `${handleXOffset}px`, bottom: `${handleYOffset}px` },
      { left: `${handleXOffset}px`, bottom: `${handleYOffset}px` },
    ].forEach((pos, idx) => {
      if (this.boxes[idx]) {
        Object.assign(this.boxes[idx].style, pos);
      }
    });
  }

  addBox(cursor: string): void {
    const overlay = this.stateService.getState().overlay;
    const options = this.stateService.getState().options as ImageResizorOptions;

    if (!overlay || !options) {
      return;
    }

    const box = document.createElement('div');
    Object.assign(box.style, options.handleStyles);
    box.style.cursor = cursor;
    box.style.width = `${options.handleStyles?.['width']}px`;
    box.style.height = `${options.handleStyles?.['height']}px`;

    fromEvent<MouseEvent>(box, 'mousedown')
      .pipe(takeUntil(this.destroy$))
      .subscribe((evt: MouseEvent): void => {
        const img = this.stateService.getState().img;

        if (!img) {
          return;
        }

        this.dragBox = evt.target as HTMLDivElement;
        this.dragStartX = evt.clientX;
        this.preDragWidth = img.width;
        this.setCursor(this.dragBox.style.cursor);

        const mousemoveSub = fromEvent<MouseEvent>(document, 'mousemove').pipe(takeUntil(this.destroy$))
.subscribe(this.handleDrag);

        const mouseupSub = fromEvent<MouseEvent>(document, 'mouseup')
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.handleMouseup();
            mousemoveSub.unsubscribe();
            mouseupSub.unsubscribe();
          });

        evt.preventDefault();
      });

    overlay.appendChild(box);
    this.boxes.push(box);
  }

  handleMouseup = (): void => {
    this.setCursor('');
    this.dragBox = null;
  };

  handleDrag = (evt: MouseEvent): void => {
    const state = this.stateService.getState();
    const img = state.img;

    if (!img || !this.dragBox) {
      return;
    }

    const deltaX = evt.clientX - this.dragStartX;
    let width = this.preDragWidth;

    const boxIndex = this.boxes.indexOf(this.dragBox);
    if (boxIndex === 0 || boxIndex === 3) {
      width = Math.round(this.preDragWidth - deltaX);
    } else {
      width = Math.round(this.preDragWidth + deltaX);
    }

    width = Math.max(width, 10);

    const height = Math.round(img.height * (width / img.width));

    img.width = width;
    img.height = height;

    this.dragChanged$.next();
  };

  setCursor(value: string): void {
    const state = this.stateService.getState();
    const img = state.img;

    [document.body, img].forEach((el) => {
      if (el) {
        el.style.cursor = value;
      }
    });
  }
}
