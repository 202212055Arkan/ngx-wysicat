import { Injectable, NgZone, signal } from '@angular/core';
import Quill from 'quill';
import Delta, { Op } from 'quill-delta';

import { initialState } from './initial.state';
import { QuillState } from './quill.state';

export interface BlockMenu {
  position: {
    top: number;
    left: number;
  };
  blockElement: HTMLElement | null;
}

@Injectable({
  providedIn: 'root',
})
export class QuillStore {
  private state = signal<QuillState>(initialState);
  private quillInstance = signal<Quill | null>(null);

  constructor(private ngZone: NgZone) {}

  quill = () => this.quillInstance();

  documentChanged = () => this.state().blocks;

  isFavourite = () => this.state().isFavourite;

  blockMenu = () => this.state().blockMenu;

  editorEntersDisabled = () => this.state().editorEntersDisabled;

  initQuill(quill: Quill): void {
    this.quillInstance.set(quill);
    this.ngZone.runOutsideAngular(() => {
      quill.on('text-change', () => {
        this.saveContent();
      });
    });
  }

  saveContent(): void {
    const quill = this.quill();

    if (!quill) {
      return;
    }

    const blocks = quill.getContents().ops;
    this.ngZone.run(() => {
      this.updateState({ blocks });
    });
  }

  saveBlockMenu(blockMenu: BlockMenu): void {
    this.updateState({ blockMenu });
  }

  setContent(newOps: Op[]): void {
    const quill = this.quill();

    if (!quill) {
      return;
    }

    this.updateState({ blocks: newOps });
    quill.setContents(new Delta(newOps), 'api');
  }

  toggleFavourite(): void {
    const isFavourite = !this.isFavourite();
    this.updateState({ isFavourite });
  }

  private updateState(partialState: Partial<QuillState>): void {
    this.state.update((state) => ({ ...state, ...partialState }));
  }
}
