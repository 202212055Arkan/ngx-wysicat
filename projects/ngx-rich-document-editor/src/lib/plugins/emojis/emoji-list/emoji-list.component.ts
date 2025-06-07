import { ChangeDetectionStrategy, Component, EventEmitter, Output, signal } from '@angular/core';

import { MenuCardCategoryItem, MenuCardComponent } from '../../../ui/menu-card';

@Component({
  templateUrl: './emoji-list.component.html',
  imports: [MenuCardComponent],
  selector: 'rde-emoji-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmojiListComponent {
  @Output() readonly emojiSelected = new EventEmitter<string>();
  emojis = signal<MenuCardCategoryItem[]>([]);

  handleSelectedEmoji(emoji: string): void {
    this.emojiSelected.emit(emoji);
  }
}
