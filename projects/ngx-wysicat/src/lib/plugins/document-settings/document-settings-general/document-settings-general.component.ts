import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ExportHtmlComponent } from '../../../features/shareable/export-html/export-html.component';
import { ExportMarkdownComponent } from '../../../features/shareable/export-markdown/export-markdown.component';
import { SvgIconComponent } from '../../../ui/icon/svg-icon.component';
import { RangeSliderComponent } from '../../../ui/slider/slider.component';
import { ToggleSwitchComponent } from '../../../ui/toggle-switch/toggle-switch.component';

import { DOCUMENT_SETTINGS_KEYS } from './document-settings-general.configs';
import { DocumentSettingsGeneralService } from './document-settings-general.service';

@Component({
  selector: 'nw-document-settings-general',
  templateUrl: './document-settings-general.component.html',
  styleUrls: ['./document-settings-general.component.scss'],
  imports: [RangeSliderComponent, ToggleSwitchComponent, SvgIconComponent, ExportHtmlComponent, ExportMarkdownComponent],
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

  getFeatureDescription(key: string): string {
    const descriptions: Record<string, string> = {
      [DOCUMENT_SETTINGS_KEYS.READ_ONLY]: 'Prevents editing of document content while still allowing navigation',
      [DOCUMENT_SETTINGS_KEYS.TOP_TOOLBAR]: 'Shows a fixed toolbar at the top of the document for quick formatting',
      [DOCUMENT_SETTINGS_KEYS.SELECTION_TOOLBAR]: 'Displays formatting options when text is selected',
      [DOCUMENT_SETTINGS_KEYS.HEADER]: 'Shows document metadata and author information at the top',
      [DOCUMENT_SETTINGS_KEYS.EMOJI]: 'Enables emoji insertion with the :emoji: command syntax',
      [DOCUMENT_SETTINGS_KEYS.CREATE_BLOCK]: 'Allows adding new content blocks to the document',
      [DOCUMENT_SETTINGS_KEYS.BLOCK_DRAG_AND_DROP]: 'Enables rearranging blocks by dragging them',
      [DOCUMENT_SETTINGS_KEYS.BLOCK_DUPLICATION]: 'Allows duplicating existing blocks',
      [DOCUMENT_SETTINGS_KEYS.BLOCK_REMOVAL]: 'Enables deleting blocks from the document',
      [DOCUMENT_SETTINGS_KEYS.BLOCK_OPERATIONS_MENU]: 'Shows a menu with block operations',
      [DOCUMENT_SETTINGS_KEYS.TEXT_TOOLBAR]: 'Displays text formatting options',
      [DOCUMENT_SETTINGS_KEYS.WORDS_COUNTER]: 'Shows word count statistics',
      [DOCUMENT_SETTINGS_KEYS.BLOCK_SETTINGS]: 'Allows configuring individual block settings',
    };

    return descriptions[key] || '';
  }
}
