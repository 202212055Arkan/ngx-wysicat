import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideNgxRichDocument } from 'ngx-rich-document-editor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({
      eventCoalescing: true,
    }),
    provideNgxRichDocument(
      {
        features: {
          // initialTemplate: false,
          // emojis: false,
          createBlock: true,
        },
        ui: {
          fonts: {
            sans: 'Inter',
            serif: 'Playfair Display',
            mono: 'JetBrains Mono',
          },
        },
      },
      [], // no custom plugins
    ),
  ],
};
