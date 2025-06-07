import { NgxRichDocumentEditorConfig } from './quill.config';

export class ConfigValidator {
  static validate(config: Partial<NgxRichDocumentEditorConfig>): string[] {
    const errors: string[] = [];

    if (config.api?.timeout && config.api.timeout < 1000) {
      errors.push('API timeout must be at least 1000ms');
    }

    if (config.security?.passwordMinLength && config.security.passwordMinLength < 8) {
      errors.push('Minimum password length must be at least 8 characters');
    }

    return errors;
  }
}
