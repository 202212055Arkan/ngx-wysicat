import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';

import { SvgIconComponent } from '../../../../ui/icon/svg-icon.component';
import { TooltipDirective } from '../../../../ui/tooltip/tooltip.directive';
import { TooltipService } from '../../../../ui/tooltip/tooltip.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'nw-read-only-button',
  standalone: true,
  imports: [SvgIconComponent, TooltipDirective],
  template: `
    <button class="nw-button primary__with-icon" [nwTooltip]="tooltipText()" [boldFirstWord]="true" (click)="toggleReadOnly()">
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
export class ReadOnlyButtonComponent {
  public position = input<'horizontal' | 'vertical'>('horizontal');
  public readonly isHorizontal = computed(() => this.position() === 'horizontal');
  public isReadOnly = input<boolean>(false);
  public readonly clicked = output<boolean>();
  protected readonly iconName = computed(() => (this.isReadOnly() ? 'lock' : 'lock-open'));
  protected readonly tooltipText = computed(() => (this.isReadOnly() ? 'Click to unlock editing' : 'Click to lock editing'));
  private readonly tooltipService = inject(TooltipService);

  toggleReadOnly() {
    this.clicked.emit(!this.isReadOnly());
    this.tooltipService.hideTooltip();
  }
}
