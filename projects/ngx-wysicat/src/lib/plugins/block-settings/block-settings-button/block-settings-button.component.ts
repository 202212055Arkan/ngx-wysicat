import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ConfigsService } from '../../../configs/configs.service';
import { SvgIconComponent } from '../../../ui/icon/svg-icon.component';
import { ListComponent } from '../../../ui/list/list.component';
import { TooltipDirective } from '../../../ui/tooltip/tooltip.directive';
import { OverlayService } from '../../../utils/overlay.service';
import { DragAndDropDirective } from '../../drag-and-drop';

import { BlockSettingsButtonService } from './block-settings-button.service';

const MENU_ITEMS_COMMON_BLOCK = [
  {
    label: 'clear',
    name: 'Clear format',
  },
  {
    label: 'duplicate',
    name: 'Duplicate',
  },
  {
    label: 'remove',
    name: 'Delete',
  },
];

@Component({
  selector: 'nw-block-settings',
  templateUrl: './block-settings-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [DragAndDropDirective, TooltipDirective, SvgIconComponent],
})
export class BlockSettingsButtonComponent {
  protected readonly configs = inject(ConfigsService);
  private readonly overlayService = inject(OverlayService);
  private readonly blockOptionsButtonService = inject(BlockSettingsButtonService);

  openMenu(blockOptionsMenu: HTMLButtonElement): void {
    const component = this.overlayService.open(ListComponent, blockOptionsMenu, {
      strategy: 'block',
      hasBackdrop: true,
    });

    component.blockOptionsx = MENU_ITEMS_COMMON_BLOCK;

    component.selected.subscribe((option) => {
      this.overlayService.close();
      this.blockOptionsButtonService.handleMenuOption(option);
    });
  }
}
