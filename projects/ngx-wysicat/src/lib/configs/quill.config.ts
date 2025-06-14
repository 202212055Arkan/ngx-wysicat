export interface NgxRichDocumentEditorConfig {
  features: FeatureFlags;
  api: ApiConfig;
  ui: UiConfig;
  security: SecurityConfig;
}

export interface FeatureFlags {
  createBlock: boolean;
  blockDragAndDrop: boolean;
  blockDuplication: boolean;
  blockRemoval: boolean;
  blockMenu: boolean;
  textToolbar: boolean;
  wordsCounter: boolean;
  blockSettings: boolean;
  emojis: boolean;
  initialTemplate: boolean;
  documentSettings: boolean;
  imageResizor: {
    enabled: boolean;
    options?: any;
  };
}

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
}

export interface UiConfig {
  theme: 'light' | 'dark' | 'system';
  language: string;
  dateFormat: string;
  fonts: {
    sans: string;
    serif: string;
    mono: string;
  }
}

export interface SecurityConfig {
  sessionTimeout: number;
  passwordMinLength: number;
}
