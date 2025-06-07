import { inject, Injectable } from '@angular/core';
import Quill from 'quill';
import { Subscription } from 'rxjs';

import { QuillStore } from '../../store';
import { clearFormat, createQuillBlockId, duplicateBlock } from '../../utils/quill/utils/quill.utils';

import { BlockSettingsButtonService } from './block-settings-button';

@Injectable({
  providedIn: 'root',
})
export class BlockSettingsPlugin {
  public readonly id = 'block-settings-plugin';
  public readonly name = 'Block Settings Plugin';
  private quill!: Quill;
  private readonly store = inject(QuillStore);
  private readonly blockOptionsButtonService = inject(BlockSettingsButtonService);
  private subscription!: Subscription | null;
  private readonly blockOperations: Record<string, any> = {
    remove: (blockElement: HTMLElement) => this.removeBlock(blockElement),
    duplicate: (blockElement: HTMLElement) => duplicateBlock(this.quill, blockElement, createQuillBlockId(this.quill)),
    clear: (blockElement: HTMLElement) => clearFormat(this.quill, blockElement),
  };

  initialize(quill: Quill): void {
    this.quill = quill;
    this.subscription = this.blockOptionsButtonService.optionSelected$.subscribe((option: string) => {
      this.blockOperations[option](this.store.blockMenu().blockElement);
    });
  }

  destroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  private removeBlock(blockElement: HTMLElement): void {
    if (this.quill.getLines().length === 1) {
      return;
    }

    const block = Quill.find(blockElement);

    // @ts-ignore
    block.remove();

    // if (block && block instanceof Parchment.BlockBlot) {
    //   block.remove();
    // }
  }
}
