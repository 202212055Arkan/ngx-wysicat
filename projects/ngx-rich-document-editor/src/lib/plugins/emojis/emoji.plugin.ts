/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, Injectable } from '@angular/core';
import Quill from 'quill';
import { Subscription } from 'rxjs';

import { OverlayService } from '../../utils/overlay.service';
import { getCurrentLine } from '../../utils/quill/utils/quill.utils';
import { TextCommandBusService } from '../shared/text-commands/text-command-bus.service';

import { EmojiListComponent } from './emoji-list/emoji-list.component';
import { EMOJIS } from './emojis-data';

@Injectable({
  providedIn: 'root',
})
// export class EmojiPlugin implements RichDocumentEditorPlugin { // TODO
export class EmojiPlugin {
  public readonly id = 'emoji-plugin';
  public readonly name = 'Emoji Plugin';

  private quill: Quill | null = null;
  private overlayService = inject(OverlayService);
  private textCommandBudService = inject(TextCommandBusService);

  private emojiComponent: EmojiListComponent | null = null;
  private emojiSubscription: Subscription | null = null;
  private commandSubscription: Subscription | null = null;
  private commandData: any = null;

  initialize(quill: Quill): void {
    this.quill = quill;

    this.commandSubscription = this.textCommandBudService.activeCommand$.subscribe((commandData) => {
      if (commandData?.type === 'EMOJI') {
        this.commandData = commandData;

        if (!this.emojiComponent) {
          this.openEmojiPicker(commandData);
        } else {
          this.updateEmojiPicker(commandData.searchText);
        }
      } else if (this.emojiComponent) {
        this.closeEmojiPicker();
      }
    });

    this.overlayService.closed$.subscribe(() => {
      if (this.emojiComponent) {
        this.closeEmojiPicker();
      }
    });
  }

  destroy(): void {
    if (this.commandSubscription) {
      this.commandSubscription.unsubscribe();
      this.commandSubscription = null;
    }

    if (this.emojiSubscription) {
      this.emojiSubscription.unsubscribe();
      this.emojiSubscription = null;
    }

    this.emojiComponent = null;
    this.commandData = null;
    this.quill = null;
  }

  private openEmojiPicker(command: any): void {
    const selection = this.quill?.getSelection();
    if (!selection || !this.quill) return;

    const line = getCurrentLine(this.quill, selection.index);
    if (!line || !line.domNode) return;

    const bounds = this.quill.getBounds(command.triggerIndex);
    if (!bounds) return;

    const openOptions: {
      offsetX: number;
      panelClass: string;
      preventAutoClose: boolean;
      customPosition: Partial<CSSStyleDeclaration>;
    } = {
      offsetX: bounds.left - 72,
      panelClass: 'emoji-overlay-pane',
      preventAutoClose: true,
      customPosition: {
        position: 'fixed',
      },
    };

    this.emojiComponent = this.overlayService.open(EmojiListComponent, line.domNode, openOptions);

    if (this.emojiComponent) {
      this.emojiComponent.emojis.set(this.filterEmojiData(EMOJIS, command.searchText));

      if (this.emojiSubscription) {
        this.emojiSubscription.unsubscribe();
      }

      this.emojiSubscription = this.emojiComponent.emojiSelected.subscribe((emoji: string) => {
        this.insertEmoji(emoji);
      });
    }
  }

  private updateEmojiPicker(searchText: string): void {
    if (this.emojiComponent) {
      this.emojiComponent.emojis.set(this.filterEmojiData(EMOJIS, searchText));
    }
  }

  private closeEmojiPicker(): void {
    if (this.emojiSubscription) {
      this.emojiSubscription.unsubscribe();
      this.emojiSubscription = null;
    }

    this.emojiComponent = null;
    this.commandData = null;
    this.overlayService.close();
    this.textCommandBudService.resetCommand();
  }

  private insertEmoji(emoji: string): void {
    if (!this.quill || !this.commandData) {
      return;
    }

    this.quill.focus();

    const triggerIndex = this.commandData.triggerIndex;
    const deleteLength = 1 + this.commandData.searchText.length;

    this.quill.history.cutoff();
    this.quill.deleteText(triggerIndex, deleteLength);
    this.quill.insertText(triggerIndex, emoji);
    this.quill.setSelection(triggerIndex + emoji.length);
    this.quill.history.cutoff();

    this.closeEmojiPicker();
  }

  private filterEmojiData(emojis: any[], query: string): any[] {
    if (!query) return emojis;

    const lowerQuery = query.toLowerCase();

    return emojis
      .map((category) => {
        const filteredItems = category.items.filter((item: any) => item.name.toLowerCase().includes(lowerQuery));

        if (filteredItems.length > 0) {
          return { ...category, items: filteredItems };
        }

        return null;
      })
      .filter((category) => category !== null);
  }
}
