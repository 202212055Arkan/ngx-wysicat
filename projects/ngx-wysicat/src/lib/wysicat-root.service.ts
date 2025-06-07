import { computed, inject, Injectable } from '@angular/core';

import { DocumentSettingsGeneralService } from './plugins/document-settings/document-settings-general/document-settings-general.service';

@Injectable({
  providedIn: 'root',
})
export class WysicatRootService {
  private readonly documentSettingsService = inject(DocumentSettingsGeneralService);

  public readonly isReadOnly = computed(() => this.documentSettingsService.isReadOnly());
  public readonly documentSettings = this.documentSettingsService.documentSettings;

  public setReadOnly(value: boolean): void {
    this.documentSettingsService.toggleFeature('readOnly', value);
  }

  public initializeDocumentSettings(): void {
    // this.documentSettings.initialize();
  }

  public destroyDocumentSettings(): void {
    // this.documentSettings.destroy();
  }
}
