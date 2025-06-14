import { DEFAULT_IMAGE_RESIZOR_CONFIG } from '../plugins/image-resizor';

import { NgxRichDocumentEditorConfig } from './quill.config';

export const DEFAULT_CONFIG: NgxRichDocumentEditorConfig = {
  features: {
    blockDuplication: true,
    blockRemoval: true,
    blockMenu: true,
    blockSettings: true,
    textToolbar: true,
    wordsCounter: true,
    createBlock: true,
    emojis: true,
    blockDragAndDrop: true,
    initialTemplate: true,
    documentSettings: true,
    imageResizor: {
      enabled: true,
      options: DEFAULT_IMAGE_RESIZOR_CONFIG,
    },
  },
  api: {
    baseUrl: 'http://localhost:3000',
    timeout: 5000,
    retryAttempts: 3,
  },
  ui: {
    theme: 'system',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    fonts: {
      sans: 'Arial',
      serif: 'Times New Roman',
      mono: 'Courier New',
    },
  },
  security: {
    sessionTimeout: 3600,
    passwordMinLength: 8,
  },
};
