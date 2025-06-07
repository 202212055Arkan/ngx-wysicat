import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { SvgIconComponent } from '../../../ui/icon/svg-icon.component';
import { RangeSliderComponent } from '../../../ui/slider/slider.component';
import { ToggleSwitchComponent } from '../../../ui/toggle-switch/toggle-switch.component';

import { DocumentSettingsGeneralService } from './document-settings-general.service';

@Component({
  selector: 'nw-document-settings-general',
  templateUrl: './document-settings-general.component.html',
  styleUrls: ['./document-settings-general.component.scss'],
  imports: [RangeSliderComponent, ToggleSwitchComponent, SvgIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentSettingsGeneralComponent {
  private readonly documentSettingsGeneralService = inject(DocumentSettingsGeneralService);
  protected readonly uiSettings = this.documentSettingsGeneralService.uiSettings;

  getFontFamily(font: string): string {
    return this.documentSettingsGeneralService.getFontFamily(font);
  }

  selectFontType(fontType: string): void {
    this.documentSettingsGeneralService.selectFont(fontType);
  }

  changeRangeValue(value: number, key: string): void {
    this.documentSettingsGeneralService.updateRangeValue(key, value);
  }

  toggleFeature(name: string, enabled: boolean): void {
    this.documentSettingsGeneralService.toggleFeature(name, enabled);
  }
}
