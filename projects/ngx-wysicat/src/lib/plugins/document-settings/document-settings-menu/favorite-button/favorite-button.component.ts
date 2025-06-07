import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';

import { QuillStore } from '../../../../store';
import { SvgIconComponent } from '../../../../ui/icon/svg-icon.component';
import { TooltipDirective } from '../../../../ui/tooltip/tooltip.directive';
import { TooltipService } from '../../../../ui/tooltip/tooltip.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'nw-favorite-button',
  standalone: true,
  imports: [SvgIconComponent, TooltipDirective],
  template: `
    <button class="nw-button primary__with-icon" [nwTooltip]="tooltipText()" [boldFirstWord]="true" (click)="toggleFavorite()">
      <nw-svg-icon [name]="iconName()" [primary]="isHorizontal()" [secondary]="!isHorizontal()" />
    </button>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }
    `,
  ],
})
export class FavoriteButtonComponent {
  public position = input<'horizontal' | 'vertical'>('horizontal');
  public readonly isHorizontal = computed(() => this.position() === 'horizontal');
  public readonly favoriteToggle = output<void>();

  private readonly rdeStore = inject(QuillStore);
  protected readonly iconName = computed(() => (this.rdeStore.isFavourite() ? 'star-filled' : 'star'));
  protected readonly tooltipText = computed(() => (this.rdeStore.isFavourite() ? 'Click to remove from favourites' : 'Click to add to favourites'));
  private readonly tooltipService = inject(TooltipService);

  toggleFavorite() {
    this.rdeStore.toggleFavourite();
    this.favoriteToggle.emit();
    this.tooltipService.hideTooltip();
  }
}
