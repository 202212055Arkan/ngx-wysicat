import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'rde-document-settings',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
      padding: 20px;
      border-left: 1px solid var(--rde-color-primary-200);
      height: 100%;
      width: 100%;
      min-width: 0;
      flex-shrink: 0;
    }
  `,
})
export class DocumentSettingsComponent {}
