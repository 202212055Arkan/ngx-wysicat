import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ConfigsService } from '../../../configs/configs.service';
import { SvgIconComponent } from '../../../ui/icon/svg-icon.component';
import { TooltipDirective } from '../../../ui/tooltip/tooltip.directive';

import { BlockCreateButtonService } from './block-create-button.service';

@Component({
  selector: 'nw-block-create-button',
  template: `
    @if (configs.getFeatureFlag('createBlock')) {
      <button nwTooltip="Click to create block" class="nw-button nw-button__with-icon" [boldFirstWord]="true" (click)="handleMenuOption('create')">
        <nw-svg-icon name="add" [size]="14" [secondary]="true" />
      </button>
    }
  `,
  imports: [TooltipDirective, SvgIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockCreateButtonComponent {
  protected readonly blockCreateButtonService = inject(BlockCreateButtonService);
  protected readonly configs = inject(ConfigsService);

  protected handleMenuOption(option: string): void {
    this.blockCreateButtonService.handleMenuOption(option);
  }
}
