/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, signal } from '@angular/core';

export const SELECTED_EMBED_CLASS = 'rde-selected';

@Injectable({
  providedIn: 'root',
})
export class BlockSelectionService {
  public readonly selectedBlock = signal<any>(null);

  disableSelectedBlock(): void {
    if (this.selectedBlock()) {
      this.selectedBlock().domNode.classList.remove(SELECTED_EMBED_CLASS);
      this.selectedBlock.set(null);
    }
  }

  selectBlock(newBlock: any): void {
    if (this.selectedBlock()) {
      this.selectedBlock().domNode.classList.remove(SELECTED_EMBED_CLASS);
    }

    if (newBlock) {
      newBlock.domNode.classList.add(SELECTED_EMBED_CLASS);
    }

    this.selectedBlock.set(newBlock);
  }

  removeBlock(): void {
    if (this.selectedBlock()) {
      this.selectedBlock().remove();
      this.selectedBlock.set(null);
    }
  }
}
