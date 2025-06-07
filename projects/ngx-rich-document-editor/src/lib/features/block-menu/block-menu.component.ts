import { afterNextRender, ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import Quill from 'quill';
import { filter, fromEvent, map, merge, takeUntil, throttleTime } from 'rxjs';

import { ConfigsService } from '../../configs/configs.service';
import { QuillStore } from '../../store';

//todo
export const BLOCK_ELEMENTS = ['.ql-block', '.ql-block-list', 'h1', 'h2', 'h3', 'h4', 'li', 'blockquote', 'hr', '.ql-code-block-container'];

// todo it should be separated from settings and create
@Component({
  selector: 'rde-block-menu',
  template: `
    <div id="block-menu" [style]="position()">
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    #block-menu {
      position: absolute;
      display: flex;
      gap: 2px;
    }
  `,
})
export class BlockMenuComponent {
  offsetLeft = 0;
  readonly offsetValue = 20;
  private readonly store = inject(QuillStore);
  public readonly position = computed(
    () => `
    left: ${this.store.blockMenu().position.left}px;
    top: ${this.store.blockMenu().position.top}px;
  `,
  );
  private readonly configs = inject(ConfigsService);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private lastBlockLine: any = null;

  constructor() {
    afterNextRender(() => {
      const quill = this.store.quill();
      if (quill) {
        this.onQuillReady(quill);
      }
    });

    effect(() => {
      if (this.configs.getFeatureFlag('createBlock')) {
        this.offsetLeft = this.offsetValue * 2;
      } else {
        this.offsetLeft = this.offsetValue;
      }
    });
  }

  onQuillReady(quill: Quill | null): void {
    if (!quill) {
      return;
    }

    //todo
    const richDocumentEl = document.querySelector('rde-rich-document');
    //todo
    const richDocumentContainer = document.getElementById('rde-quill-wrapper');
    //todo
    const blockMenu = document.getElementById('block-menu');

    if (!richDocumentEl || !richDocumentContainer || !blockMenu) {
      console.warn('Required elements not found');
      return;
    }

    const mouseEnter$ = fromEvent(richDocumentEl, 'mouseenter');
    const mouseLeave$ = fromEvent(richDocumentEl, 'mouseleave');
    const scroll$ = fromEvent(richDocumentContainer, 'scroll');

    mouseEnter$
      .pipe(
        map(() =>
          merge(
            fromEvent<MouseEvent>(quill.root, 'mousemove').pipe(takeUntil(mouseLeave$), throttleTime(16)),
            scroll$.pipe(
              takeUntil(mouseLeave$),
              map(() => null),
            ),
          ).pipe(
            map((event) => {
              // Skip processing if there's an active text selection
              if (document.getSelection()?.toString()) {
                return null;
              }

              if (!event) {
                return this.lastBlockLine;
              }

              const parentEl = event.currentTarget as HTMLElement;
              const currentRect = richDocumentEl.getBoundingClientRect();

              if (
                !(
                  event.clientX >= currentRect.left &&
                  event.clientX <= currentRect.right &&
                  event.clientY >= currentRect.top &&
                  event.clientY <= currentRect.bottom
                )
              ) {
                return null;
              }

              // Skip processing if mouse button is pressed (during selection)
              if (event.buttons > 0) {
                return null;
              }

              const block = Array.from(parentEl.querySelectorAll(BLOCK_ELEMENTS.join(','))).find((b) => {
                const { top, bottom } = (b as HTMLElement).getBoundingClientRect();
                return event.clientY >= top && event.clientY <= bottom;
              });

              if (!block) {
                return null;
              }

              const blockLine = Quill.find(block);
              this.lastBlockLine = blockLine;

              return blockLine;
            }),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            filter((blockLine): blockLine is any => !!blockLine),
          ),
        ),
      )
      .subscribe((blockLine$) => {
        blockLine$.subscribe((blockLine) => {
          // Skip processing if there's an active text selection
          if (document.getSelection()?.toString()) {
            return;
          }

          const blockElement = blockLine.domNode;
          const rect = blockElement.getBoundingClientRect();
          const currentRichDocumentTop = richDocumentEl.getBoundingClientRect().top;

          const blockHeight = rect.height;
          const blockMenuElement = document.getElementById('block-menu');
          const menuHeight = blockMenuElement?.offsetHeight || 0;
          const position = {
            top: rect.top - currentRichDocumentTop + blockHeight / 2 - menuHeight / 2,
            left: rect.left - this.offsetLeft - 6,
          };

          this.store.saveBlockMenu({
            position,
            blockElement,
          });
        });
      });
  }
}
