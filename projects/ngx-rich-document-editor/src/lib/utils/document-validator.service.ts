import { inject, Injectable } from '@angular/core';
import Delta from 'quill-delta';
import { v4 as uuidv4 } from 'uuid';

import { EditorDataModel } from '../rich-document.models';
import { QuillStore } from '../store';

@Injectable({
  providedIn: 'root',
})
export class DocumentValidatorService {
  private readonly store = inject(QuillStore);

  constructor() {
    // dev monitoring
    setInterval(() => {
      const quill = this.store.quill();

      if (quill) {
        quill.getLines().forEach((line) => {
          // @ts-ignore
          if (!line.attributes.attributes.blockId) {
            console.log(line.domNode);
            // @ts-ignore
            console.log(line.attributes.attributes.blockId);
          }
        });
      }
    }, 10_000);
  }

  ensureValidDocument(content: EditorDataModel[]): void {
    const delta = new Delta({ ops: content });
    delta.ops.forEach((op) => {
      if (op.insert) {
        // @ts-ignore
        if (op.insert === '\n' || op.insert.divider) {
          op.attributes = op.attributes || {};
          if (!op.attributes['blockId']) {
            op.attributes['blockId'] = uuidv4();
          }
        }
      }
    });

    this.store.setContent(delta.ops);
  }
}
