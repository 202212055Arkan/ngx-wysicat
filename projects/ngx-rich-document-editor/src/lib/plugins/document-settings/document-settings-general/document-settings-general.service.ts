import { computed, effect, inject, Injectable, signal } from '@angular/core';

import { ConfigsService } from '../../../configs/configs.service';
import { QuillStore } from '../../../store';
import { FontsService } from '../../../utils/fonts.service';

import { DOCUMENT_FEATURES, DOCUMENT_SETTINGS_KEYS, RANGE_CONTROLS } from './document-settings-general.configs';
import { DocumentSettingsGeneralModels, FeatureDocumentSettingsKeys, RangeDocumentSettingsKeys } from './document-settings-general.models';

export interface DocumentSettings {
  readonly selectedFontType: string;
  readonly fontSize: number;
  readonly maxWidthPercent: number;
  readonly lineSpacingMultiplier: number;
  readonly readOnly: boolean;
  readonly topToolbar: boolean;
  readonly selectionToolbar: boolean;
  readonly header: boolean;
  readonly emoji: boolean;
  readonly createBlock: boolean;
  readonly blockDragAndDrop: boolean;
  readonly blockDuplication: boolean;
  readonly blockRemoval: boolean;
  readonly blockOperationsMenu: boolean;
  readonly textToolbar: boolean;
  readonly wordsCounter: boolean;
  readonly blockSettings: boolean;
}

const initialDocumentSettings: DocumentSettings = {
  selectedFontType: 'sans',
  fontSize: 1.6,
  maxWidthPercent: 1,
  lineSpacingMultiplier: 3.5,
  readOnly: false,
  topToolbar: true,
  selectionToolbar: true,
  header: true,
  emoji: true,
  createBlock: true,
  blockDragAndDrop: true,
  blockDuplication: true,
  blockRemoval: true,
  blockOperationsMenu: true,
  textToolbar: true,
  wordsCounter: true,
  blockSettings: true,
};

@Injectable({
  providedIn: 'root',
})
export class DocumentSettingsGeneralService {
  private readonly fontsService = inject(FontsService);
  private readonly quillStore = inject(QuillStore);
  private readonly configs = inject(ConfigsService);
  private readonly settingsState = signal<DocumentSettings>(this.loadSettings());
  documentSettings = computed(() => this.settingsState());
  isReadOnly = computed(() => this.settingsState().readOnly);
  private readonly menuOpenState = signal<boolean>(false);
  isDocumentSettingsMenuOpened = computed(() => this.menuOpenState());
  private readonly uiState = signal<DocumentSettingsGeneralModels>({
    fontFamilies: this.fontsService.staticFontsToUsersFonts,
    fontTypes: this.fontsService.defaultFontTypes,
    selectedFontType: this.fontsService.defaultFontType,
    ranges: this.initializeRangeControls(),
    features: this.initializeFeatures(),
  });
  uiSettings = {
    fontFamilies: computed(() => this.uiState().fontFamilies),
    fontTypes: computed(() => this.uiState().fontTypes),
    selectedFontType: computed(() => this.uiState().selectedFontType),
    ranges: computed(() => this.uiState().ranges),
    features: computed(() => this.uiState().features),
  };

  private readonly rangeActions: Record<RangeDocumentSettingsKeys, (value: number) => void> = {
    [DOCUMENT_SETTINGS_KEYS.FONT_SIZE]: (value) => this.updateSetting(DOCUMENT_SETTINGS_KEYS.FONT_SIZE, value),
    [DOCUMENT_SETTINGS_KEYS.MAX_WIDTH_PERCENT]: (value) => this.updateSetting(DOCUMENT_SETTINGS_KEYS.MAX_WIDTH_PERCENT, value),
    [DOCUMENT_SETTINGS_KEYS.LINE_SPACING]: (value) => this.updateSetting(DOCUMENT_SETTINGS_KEYS.LINE_SPACING, value),
  };

  private readonly featureActions: Record<FeatureDocumentSettingsKeys, (enabled: boolean) => void> = {
    [DOCUMENT_SETTINGS_KEYS.READ_ONLY]: (enabled) => {
      this.updateSetting(DOCUMENT_SETTINGS_KEYS.READ_ONLY, enabled);
      this.applyReadOnlyToQuill(enabled);
    },
    [DOCUMENT_SETTINGS_KEYS.TOP_TOOLBAR]: (enabled) => this.updateSetting(DOCUMENT_SETTINGS_KEYS.TOP_TOOLBAR, enabled),
    [DOCUMENT_SETTINGS_KEYS.SELECTION_TOOLBAR]: (enabled) => this.updateSetting(DOCUMENT_SETTINGS_KEYS.SELECTION_TOOLBAR, enabled),
    [DOCUMENT_SETTINGS_KEYS.HEADER]: (enabled) => this.updateSetting(DOCUMENT_SETTINGS_KEYS.HEADER, enabled),
    [DOCUMENT_SETTINGS_KEYS.EMOJI]: (enabled) => {
      this.configs.updateConfig({
        features: {
          ...this.configs.getFeaturesConfig(),
          emojis: enabled,
        },
      });
      this.updateSetting(DOCUMENT_SETTINGS_KEYS.EMOJI, enabled);
    },
    [DOCUMENT_SETTINGS_KEYS.CREATE_BLOCK]: (enabled) => {
      this.configs.updateConfig({
        features: {
          ...this.configs.getFeaturesConfig(),
          createBlock: enabled,
        },
      });
      this.updateSetting(DOCUMENT_SETTINGS_KEYS.CREATE_BLOCK, enabled);
    },
    [DOCUMENT_SETTINGS_KEYS.BLOCK_DRAG_AND_DROP]: (enabled) => this.updateSetting(DOCUMENT_SETTINGS_KEYS.BLOCK_DRAG_AND_DROP, enabled),
    [DOCUMENT_SETTINGS_KEYS.BLOCK_DUPLICATION]: (enabled) => this.updateSetting(DOCUMENT_SETTINGS_KEYS.BLOCK_DUPLICATION, enabled),
    [DOCUMENT_SETTINGS_KEYS.BLOCK_REMOVAL]: (enabled) => this.updateSetting(DOCUMENT_SETTINGS_KEYS.BLOCK_REMOVAL, enabled),
    [DOCUMENT_SETTINGS_KEYS.BLOCK_OPERATIONS_MENU]: (enabled) => this.updateSetting(DOCUMENT_SETTINGS_KEYS.BLOCK_OPERATIONS_MENU, enabled),
    [DOCUMENT_SETTINGS_KEYS.TEXT_TOOLBAR]: (enabled) => this.updateSetting(DOCUMENT_SETTINGS_KEYS.TEXT_TOOLBAR, enabled),
    [DOCUMENT_SETTINGS_KEYS.WORDS_COUNTER]: (enabled) => this.updateSetting(DOCUMENT_SETTINGS_KEYS.WORDS_COUNTER, enabled),
    [DOCUMENT_SETTINGS_KEYS.BLOCK_SETTINGS]: (enabled) => this.updateSetting(DOCUMENT_SETTINGS_KEYS.BLOCK_SETTINGS, enabled),
  };

  constructor() {
    effect(() => {
      const settings = this.settingsState();
      this.saveSettings(settings);
      this.applyStyles(settings);
      this.syncUIState(settings);
    });
  }

  updateSetting<K extends keyof DocumentSettings>(key: K, value: DocumentSettings[K]): void {
    this.settingsState.update((state) => ({
      ...state,
      [key]: value,
    }));
  }

  toggleDocumentMenuSettingsOpened(): void {
    this.menuOpenState.update((isOpened) => !isOpened);
  }

  toggleFeature(key: string, enabled: boolean): void {
    if (key in this.featureActions) {
      this.featureActions[key as FeatureDocumentSettingsKeys](enabled);
    }
  }

  updateRangeValue(key: string, value: number): void {
    if (key in this.rangeActions) {
      this.rangeActions[key as RangeDocumentSettingsKeys](value);

      this.uiState.update((state) => {
        const updatedRanges = state.ranges.map((range) => (range.key === key ? { ...range, value } : range));
        return { ...state, ranges: updatedRanges };
      });
    }
  }

  selectFont(fontType: string): void {
    this.updateSetting(DOCUMENT_SETTINGS_KEYS.SELECTED_FONT_TYPE, fontType);
    this.uiState.update((state) => ({
      ...state,
      selectedFontType: fontType,
    }));
  }

  getFontFamily(font: string): string {
    const families = this.uiSettings.fontFamilies();
    return families && this.fontsService.isFontKey(font) ? families[font] : this.fontsService.defaultFontFamily;
  }

  private loadSettings(): DocumentSettings {
    const savedSettings = localStorage.getItem('rde_documentSettings');
    return savedSettings ? JSON.parse(savedSettings) : initialDocumentSettings;
  }

  private saveSettings(settings: DocumentSettings): void {
    localStorage.setItem('rde_documentSettings', JSON.stringify(settings));
  }

  private applyStyles(settings: DocumentSettings): void {
    if (this.fontsService.isFontKey(settings.selectedFontType)) {
      this.fontsService.updateFontStyle(settings.selectedFontType);
    }

    document.documentElement.style.setProperty('--editor-font-size-multiplier', `${settings.fontSize}`);
    document.documentElement.style.setProperty('--rde-editor-max-width-percent', `${settings.maxWidthPercent}`);
    document.documentElement.style.setProperty('--rde-editor-line-spacing-multiplier', `${settings.lineSpacingMultiplier}`);
  }

  private applyReadOnlyToQuill(isReadOnly: boolean): void {
    const quill = this.quillStore.quill();
    if (quill) {
      quill.enable(!isReadOnly);
    }
  }

  private initializeRangeControls(): any[] {
    const settings = this.loadSettings();
    return RANGE_CONTROLS.map((range) => ({
      ...range,
      value: settings[range.key],
    }));
  }

  private initializeFeatures(): any[] {
    const settings = this.loadSettings();

    this.configs.updateConfig({
      features: {
        ...this.configs.getFeaturesConfig(),
        emojis: settings[DOCUMENT_SETTINGS_KEYS.EMOJI],
        createBlock: settings[DOCUMENT_SETTINGS_KEYS.CREATE_BLOCK],
      },
    });


    return DOCUMENT_FEATURES.map((feature) => ({
      ...feature,
      enabled: settings[feature.key],
    }));
  }

  private syncUIState(settings: DocumentSettings): void {
    const features = DOCUMENT_FEATURES.map((feature) => ({
      ...feature,
      enabled: settings[feature.key],
    }));

    const ranges = RANGE_CONTROLS.map((range) => ({
      ...range,
      value: settings[range.key],
    }));

    this.uiState.update((state) => ({
      ...state,
      selectedFontType: settings.selectedFontType,
      ranges,
      features,
    }));
  }
}
