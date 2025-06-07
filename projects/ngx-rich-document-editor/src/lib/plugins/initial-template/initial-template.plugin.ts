import { inject, Injectable } from '@angular/core';

import { InitialTemplateService } from './initial-template.service';

@Injectable({
  providedIn: 'root',
})
// export class InitialTemplatePlugin implements RichDocumentEditorPlugin {
export class InitialTemplatePlugin {
  id = 'initial-template-plugin';
  name = 'Initial Template Plugin';

  private readonly initialTemplateService = inject(InitialTemplateService);

  initialize() {
    this.initialTemplateService.register();
  }
}
