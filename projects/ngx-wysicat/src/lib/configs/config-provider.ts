import { Provider } from '@angular/core';

import { PluginProvider, provideNgxRichDocumentEditorPlugins } from '../plugins/plugin-system';
import { deepMerge, DeepPartial } from '../utils/object-utils';

import { DEFAULT_CONFIG } from './config.defaults';
import { NGX_RDE_CONFIG_TOKEN } from './config-tokens';
import { NgxRichDocumentEditorConfig } from './quill.config';

function provideNgxRichDocumentConfig(config: DeepPartial<NgxRichDocumentEditorConfig> = {}): Provider[] {
  const merged = deepMerge(DEFAULT_CONFIG, config);
  return [
    {
      provide: NGX_RDE_CONFIG_TOKEN,
      useValue: merged,
    },
  ];
}

export function provideNgxRichDocument(config: DeepPartial<NgxRichDocumentEditorConfig> = {}, customPlugins: PluginProvider[] = []): any[] {
  const mergedConfigs = deepMerge<NgxRichDocumentEditorConfig>(DEFAULT_CONFIG, config);
  return [...provideNgxRichDocumentConfig(mergedConfigs), provideNgxRichDocumentEditorPlugins([...customPlugins])];
}
