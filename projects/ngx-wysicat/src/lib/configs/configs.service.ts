/* eslint-disable @typescript-eslint/no-explicit-any */
import { computed, effect, inject, Injectable, signal } from '@angular/core';

import { FontsService } from '../plugins/document-settings/document-settings-general/fonts.service';

import { ConfigValidator } from './config.validator';
import { NGX_RDE_CONFIG_TOKEN } from './config-token';
import { ApiConfig, FeatureFlags, NgxRichDocumentEditorConfig, SecurityConfig, UiConfig } from './quill.config';

@Injectable({
  providedIn: 'root',
})
export class ConfigsService {
  private readonly initialConfig = inject(NGX_RDE_CONFIG_TOKEN);
  private readonly fontService = inject(FontsService);

  private readonly configState = signal<NgxRichDocumentEditorConfig>(this.initialConfig);

  readonly config = computed(() => this.configState());
  readonly features = computed(() => this.configState().features);
  readonly api = computed(() => this.configState().api);
  readonly ui = computed(() => this.configState().ui);
  readonly security = computed(() => this.configState().security);

  constructor() {
    effect(() => {
      this.initializeFonts(this.ui().fonts);
    });
  }

  updateConfig(updates: Partial<NgxRichDocumentEditorConfig>): string[] {
    const errors = ConfigValidator.validate(updates);
    if (errors.length > 0) {
      return errors;
    }

    this.configState.update((currentConfig) => ({
      ...currentConfig,
      ...this.deepMerge(currentConfig, updates),
    }));

    return [];
  }

  getFeaturesConfig(): FeatureFlags {
    return this.features();
  }

  getFeatureFlag(flag: keyof FeatureFlags): boolean | any {
    if (flag === 'imageResizor') {
      return this.features()[flag].enabled;
    }
    return this.features()[flag];
  }

  getApiConfig(): ApiConfig {
    return this.api();
  }

  getUiConfig(): UiConfig {
    return this.ui();
  }

  getSecurityConfig(): SecurityConfig {
    return this.security();
  }

  private deepMerge(target: any, source: any): any {
    const output = { ...target };
    if (isObject(target) && isObject(source)) {
      Object.keys(source).forEach((key) => {
        if (isObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, { [key]: source[key] });
          } else {
            output[key] = this.deepMerge(target[key], source[key]);
          }
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    return output;
  }

  private initializeFonts(fonts: UiConfig['fonts']): void {
    this.fontService.setFonts({ ...fonts });
  }
}

function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}
