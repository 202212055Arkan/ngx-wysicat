import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';

import { SvgIconComponent } from '../../../../ui/icon/svg-icon.component';
import { TooltipDirective } from '../../../../ui/tooltip/tooltip.directive';
import { TooltipService } from '../../../../ui/tooltip/tooltip.service';
import { DocumentSettingsGeneralService } from '../../document-settings-general/document-settings-general.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'rde-settings-button',
  standalone: true,
  imports: [SvgIconComponent, TooltipDirective],
  template: `
    <button class="rde-button primary__with-icon" [rdeTooltip]="tooltipText()" [boldFirstWord]="true" (click)="toggleSettings()">
      <rde-svg-icon [name]="iconName()" [primary]="isHorizontal()" [secondary]="!isHorizontal()" />
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
export class SettingsButtonComponent {
  public position = input<'horizontal' | 'vertical'>('horizontal');
  public readonly isHorizontal = computed(() => this.position() === 'horizontal');
  public readonly settingsToggle = output<void>();

  private readonly settingsService = inject(DocumentSettingsGeneralService);
  protected readonly iconName = computed(() => (this.settingsService.isDocumentSettingsMenuOpened() ? 'open-sidebar-right' : 'hide-sidebar-right'));
  protected readonly tooltipText = computed(() =>
    this.settingsService.isDocumentSettingsMenuOpened() ? 'Click to hide document settings' : 'Click to open document settings',
  );
  private readonly tooltipService = inject(TooltipService);

  toggleSettings() {
    this.settingsService.toggleDocumentMenuSettingsOpened();
    this.settingsToggle.emit();
    this.tooltipService.hideTooltip();
  }
}
