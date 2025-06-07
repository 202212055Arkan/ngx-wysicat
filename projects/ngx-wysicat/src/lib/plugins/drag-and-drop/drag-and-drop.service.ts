import {afterNextRender, inject, Injectable, NgZone, signal} from "@angular/core";
import Quill from "quill";
import Delta from "quill-delta";

import {ConfigsService} from "../../configs/configs.service";
import {QuillStore} from "../../store";

import {DRAG_HANDLE_SELECTOR, DRAGGED_IMAGE_BLOCK_ID, ELEMENT_DRAGGING} from "./drag-and-drop.config";
import {DropLineService} from "./drop-line.service";

@Injectable({
  providedIn: 'root',
})
export class DragAndDropService {
  private readonly dropLineService = inject(DropLineService);
  private readonly store = inject(QuillStore);
  private readonly ngZone = inject(NgZone);

  private readonly draggedBlockElement = signal<HTMLElement | null>(null);
  private readonly blockOptionsMenu = this.store.blockMenu;


  private blockListenersAbortController: AbortController | null = null;
  private configs = inject(ConfigsService);
  private quill!: Quill;

  constructor() {
    afterNextRender(() => {
      const quill = this.store.quill;
      if (quill() && this.configs.getFeatureFlag('blockDragAndDrop')) {
        this.onQuillReady(quill());
      }
    });
  }

  register() {
    // keep empty
  }

  private onQuillReady(quill: Quill | null): void {
    if (quill) {
      this.quill = quill;
      this.dropLineService.init(quill);

      const dragTriggerElement = document.querySelector(DRAG_HANDLE_SELECTOR);


      if (!dragTriggerElement) {
        return;
      }

      // TODO!!!! POC for now
      this.ngZone.runOutsideAngular(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.quill.on('text-change', (delta: any) => {
          if (delta.ops[1] && delta.ops[1].insert === '\n') {
            this.setupBlockListeners();
          }
        });

        this.setupDragstart(dragTriggerElement);
        this.setupDragend(dragTriggerElement);
        this.setupBlockListeners();
      });
    }
  }

  private setupBlockListeners() {
    if (this.blockListenersAbortController) {
      this.blockListenersAbortController.abort();
    }
    this.blockListenersAbortController = new AbortController();
    const abortSignal = this.blockListenersAbortController.signal;

    const blockElements = this.quill.getLines().map((line) => line.domNode);

    if (!blockElements) {
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      blockElements.forEach((blockElement) => {
        this.setupDragOver(blockElement, abortSignal);
        this.setupDrop(blockElement, abortSignal);
        this.setupDragLeave(blockElement, abortSignal);
      });
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private reorderBlocks(draggedBlock: any, targetBlock: any, dropAbove: boolean): void {
    this.ngZone.run(() => {
      const draggedBlockIndex = this.quill.getIndex(draggedBlock);
      const targetBlockIndex = this.quill.getIndex(targetBlock);

      const draggedBlockLength = draggedBlock.length();
      const targetBlockLength = targetBlock.length();

      let insertIndex = dropAbove ? targetBlockIndex : targetBlockIndex + targetBlockLength;

      if (draggedBlockIndex < targetBlockIndex) {
        insertIndex -= draggedBlockLength;
      }

      const draggedDelta = this.quill.getContents(draggedBlockIndex, draggedBlockLength);

      this.quill.deleteText(draggedBlockIndex, draggedBlockLength, 'silent');
      this.quill.updateContents(
        new Delta()
          .retain(insertIndex)
          .concat(draggedDelta),
      );
    });
  }

  private setupDragstart(draggableElement: Element) {
    // @ts-expect-errorts-nocheck
    draggableElement.addEventListener('dragstart', (dragEvent: DragEvent) => {
      dragEvent.stopPropagation();
      // @ts-expect-errorts-nocheck
      dragEvent.dataTransfer?.setDragImage(document.getElementById(DRAGGED_IMAGE_BLOCK_ID), 0, 0);
      this.draggedBlockElement.set(this.blockOptionsMenu().blockElement);
      this.draggedBlockElement()?.classList.add(ELEMENT_DRAGGING);
    });
  }

  private setupDragend(draggableElement: Element) {
    draggableElement.addEventListener('dragend', () => {
      if (this.draggedBlockElement()) {
        this.draggedBlockElement()?.classList.remove(ELEMENT_DRAGGING);
      }

      this.dropLineService.hideDropLine();
    });
  }

  private setupDragOver(draggedBlockElement: Element, abortSignal: AbortSignal) {
    // @ts-expect-errorts-nocheck
    draggedBlockElement.addEventListener('dragover', (dragEvent: DragEvent) => {
      dragEvent.preventDefault();
      this.dropLineService.showDropLine(draggedBlockElement, this.quill.root, dragEvent);
    }, {signal: abortSignal});
  }

  private setupDrop(blockElement: Element, abortSignal: AbortSignal) {
    // @ts-expect-errorts-nocheck
    blockElement.addEventListener('drop', (dragEvent: DragEvent) => {
      dragEvent.preventDefault();

      const rect = (dragEvent.target as Element).getBoundingClientRect();
      const dropAbove = dragEvent.clientY < rect.top + rect.height / 2;

      // @ts-expect-errorts-nocheck
      this.reorderBlocks(Quill.find(this.draggedBlockElement()), Quill.find(blockElement), dropAbove);

      // adjust again after reorder
      this.setupBlockListeners();
    }, {signal: abortSignal});
  }

  private setupDragLeave(blockElement: Element, abortSignal: AbortSignal) {
    blockElement.addEventListener('dragleave', () => {
      this.dropLineService.hideDropLine();
    }, {signal: abortSignal});
  }
}


