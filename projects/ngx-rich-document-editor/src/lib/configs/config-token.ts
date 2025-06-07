import { InjectionToken } from '@angular/core';

import { DEFAULT_CONFIG } from './config.defaults';
import { NgxRichDocumentEditorConfig } from './quill.config';

export const NGX_RDE_CONFIG_TOKEN = new InjectionToken<NgxRichDocumentEditorConfig>('config', {
  providedIn: 'root',
  factory: () => DEFAULT_CONFIG,
});
