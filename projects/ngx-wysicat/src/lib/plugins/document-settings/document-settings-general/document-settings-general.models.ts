import { FontConfig } from '../../../utils/fonts.service';

import { DocumentSettings } from './document-settings-general.service';

export type DocumentFeatureKey = keyof Pick<
  DocumentSettings,
  | 'readOnly'
  | 'topToolbar'
  | 'selectionToolbar'
  | 'header'
  | 'emoji'
  | 'createBlock'
  | 'blockDragAndDrop'
  | 'blockDuplication'
  | 'blockRemoval'
  | 'blockOperationsMenu'
  | 'textToolbar'
  | 'wordsCounter'
>;

export type RangeControlKey = keyof Pick<DocumentSettings, 'fontSize' | 'maxWidthPercent' | 'lineSpacingMultiplier'>;

export type RangeDocumentSettingsKeys = {
  [K in keyof DocumentSettings]: DocumentSettings[K] extends number ? K : never;
}[keyof DocumentSettings];

export type FeatureDocumentSettingsKeys = {
  [K in keyof DocumentSettings]: DocumentSettings[K] extends boolean ? K : never;
}[keyof DocumentSettings];

export interface RangeControl {
  readonly key: RangeControlKey;
  readonly label: string;
  readonly value: number;
  readonly min: number;
  readonly max: number;
  readonly step: number;
  readonly unit: string;
}

export interface DocumentSettingsFeature {
  readonly key: DocumentFeatureKey;
  readonly name: string;
  readonly icon: string;
  readonly enabled: boolean;
}

export interface DocumentSettingsGeneralModels {
  readonly fontTypes: string[];
  readonly fontFamilies: FontConfig;
  readonly selectedFontType: string;
  readonly ranges: RangeControl[];
  readonly features: DocumentSettingsFeature[];
}
