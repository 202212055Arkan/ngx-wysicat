import { inject, Injectable } from '@angular/core';
import Quill from 'quill';

import { WysicatPlugin } from '../plugin-system';

import { MediaService } from './document-settings-media/media.service';

@Injectable({
  providedIn: 'root',
})
export class DocumentSettingsPlugin implements WysicatPlugin {
  id = 'document-settings-plugin';
  name = 'Document Settings Plugin';

  private readonly mediaService = inject(MediaService);

  initialize(quill: Quill) {
    // this.documentSettingsService.initialize();
    this.mediaService.initialize(quill);
  }

  destroy() {}
}
