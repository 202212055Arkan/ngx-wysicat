import { DocumentSettingsFeature, RangeControl } from './document-settings-general.models';

export const DOCUMENT_SETTINGS_KEYS = {
  FONT_SIZE: 'fontSize',
  SELECTED_FONT_TYPE: 'selectedFontType',
  MAX_WIDTH_PERCENT: 'maxWidthPercent',
  LINE_SPACING: 'lineSpacingMultiplier',
  READ_ONLY: 'readOnly',
  TOP_TOOLBAR: 'topToolbar',
  SELECTION_TOOLBAR: 'selectionToolbar',
  HEADER: 'header',
  EMOJI: 'emoji',
  CREATE_BLOCK: 'createBlock',
  BLOCK_DRAG_AND_DROP: 'blockDragAndDrop',
  BLOCK_DUPLICATION: 'blockDuplication',
  BLOCK_REMOVAL: 'blockRemoval',
  BLOCK_OPERATIONS_MENU: 'blockOperationsMenu',
  TEXT_TOOLBAR: 'textToolbar',
  WORDS_COUNTER: 'wordsCounter',
  BLOCK_SETTINGS: 'blockSettings',
} as const;

export const DOCUMENT_FEATURES: DocumentSettingsFeature[] = [
  {
    key: 'readOnly',
    name: 'Read-Only Mode',
    icon: 'lock',
    enabled: false,
  },
  {
    key: DOCUMENT_SETTINGS_KEYS.TOP_TOOLBAR,
    name: 'Fixed Top Toolbar',
    icon: 'toolbar',
    enabled: false,
  },
  {
    key: DOCUMENT_SETTINGS_KEYS.SELECTION_TOOLBAR,
    name: 'Inline Editing Toolbar',
    icon: 'toolbar',
    enabled: false,
  },
  {
    key: DOCUMENT_SETTINGS_KEYS.HEADER,
    name: 'Detailed Header',
    icon: 'layout-header',
    enabled: false,
  },
  {
    key: DOCUMENT_SETTINGS_KEYS.CREATE_BLOCK,
    name: 'Block Creation',
    icon: 'options',
    enabled: false,
  },
  {
    key: DOCUMENT_SETTINGS_KEYS.EMOJI,
    name: 'Emojis',
    icon: 'emoji',
    enabled: false,
  },
];

export const RANGE_CONTROLS: RangeControl[] = [
  { key: 'fontSize', label: 'Font Size', value: 1, min: 0.8, max: 1.3, step: 0.1, unit: 'x' },
  { key: 'maxWidthPercent', label: 'Document Width', value: 1, min: 0.7, max: 1, step: 0.02, unit: 'x' },
  { key: 'lineSpacingMultiplier', label: 'Line Spacing', value: 6, min: 4, max: 10, step: 0.1, unit: 'x' },
];
