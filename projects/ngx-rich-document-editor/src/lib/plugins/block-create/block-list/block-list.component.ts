import { ChangeDetectionStrategy, Component, Input, output, signal } from '@angular/core';

import { MenuCardCategoryItem, MenuCardComponent } from '../../../ui/menu-card';

@Component({
  selector: 'rde-create-block-list',
  templateUrl: './block-list.component.html',
  imports: [MenuCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockListComponent {
  public readonly blockTypeSelected = output<string>();
  blockTypes = signal<MenuCardCategoryItem[]>([]);

  @Input()
  set data(data: MenuCardCategoryItem[]) {
    this.blockTypes.set(data);
  }

  selectBlockType(blockType: string): void {
    this.blockTypeSelected.emit(blockType);
  }
}
