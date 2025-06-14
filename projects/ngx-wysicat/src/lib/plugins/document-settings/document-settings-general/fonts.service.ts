import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

import { NGX_RDE_CONFIG_TOKEN } from '../../../configs/config-tokens';

export type FontType = 'sans' | 'serif' | 'mono';

export interface FontConfig {
  readonly sans: string;
  readonly serif: string;
  readonly mono: string;
}

@Injectable({ providedIn: 'root' })
export class FontsService {
  public defaultFontFamily = 'system-ui, serif';
  public defaultFontType = 'sans';
  public defaultFontTypes = [this.defaultFontType, 'serif', 'mono'];

  public initStaticFontsToUsersFonts: FontConfig = {
    sans: 'sans-serif',
    serif: 'serif',
    mono: 'monospace',
  };

  public staticFontsToUsersFonts: FontConfig = {
    sans: '',
    serif: '',
    mono: '',
  };

  private readonly configs = inject(NGX_RDE_CONFIG_TOKEN);
  private readonly DOCUMENT = inject(DOCUMENT);

  constructor() {
    this.setFonts(this.configs.ui.fonts);
  }

  updateFontStyle(fontType: FontType): void {
    const fontFamily = this.configs.ui.fonts[fontType] || this.defaultFontFamily;
    this.DOCUMENT.documentElement.style.setProperty('--editor-font-family', `${fontFamily}, ${this.defaultFontFamily}`);
  }

  setFonts(fonts: Partial<FontConfig>): void {
    this.staticFontsToUsersFonts = {
      ...this.initStaticFontsToUsersFonts,
      ...fonts,
    };
  }

  isFontKey(value: string): value is FontType {
    return this.defaultFontTypes.includes(value);
  }
}
