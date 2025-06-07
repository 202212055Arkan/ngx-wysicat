import { inject, Injectable } from '@angular/core';
import Quill from 'quill';
import { Subscription } from 'rxjs';

import { QuillStore } from '../../store';

import { BlockCreateButtonService } from './block-create-button/block-create-button.service';
import { BlockCreatePluginInterface } from './block-create.plugin.type';
import { BlockCreateService } from './block-create.service';

@Injectable({
  providedIn: 'root',
})
export class BlockCreatePlugin implements BlockCreatePluginInterface {
  public readonly id = 'create-block-plugin';
  public readonly name = 'Create Block Plugin';

  private readonly createBlockService = inject(BlockCreateService);
  private readonly blockCreateButtonService = inject(BlockCreateButtonService);
  private readonly store = inject(QuillStore);
  private subscription!: Subscription | null;
  private readonly blockOperations: Record<string, any> = {
    create: (blockElement: HTMLElement) => this.createNewBlockHTMLElement(blockElement),
  };

  initialize(quill: Quill): void {
    this.createBlockService.onQuillReady(quill);
    this.subscription = this.blockCreateButtonService.optionSelected$.subscribe((option: string) => {
      this.blockOperations[option](this.store.blockMenu().blockElement);
    });
  }

  createNewBlockHTMLElement(blockElement: HTMLElement) {
    this.createBlockService.createNewBlockHTMLElement(blockElement);
  }

  destroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }
}
