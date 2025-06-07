import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideNgxRichDocument } from 'ngx-wysicat';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({
      eventCoalescing: true,
    }),
    provideNgxRichDocument(
      {
        features: {
          initialTemplate: false,
          emojis: false,
          createBlock: true,
        },
      },
      [],
    ),
  ],
};
