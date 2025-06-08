import { inject, Injectable } from '@angular/core';
import Delta from 'quill-delta';
import { v4 as uuidv4 } from 'uuid';

import { QuillStore } from '../store';
import { EditorDataModel } from '../wysicat-root.models';

@Injectable({
  providedIn: 'root',
})
export class DocumentValidatorService {
  private readonly store = inject(QuillStore);

  ensureValidDocument(content: EditorDataModel[]): void {
    const delta = new Delta({ ops: content });
    delta.ops.forEach((op) => {
      if (op.insert) {
        // @ts-ignore
        if (op.insert === '\n' || op.insert.divider) {
          op.attributes = op.attributes || {};
          if (!op.attributes['blockId']) {
            console.error('Editor data validation: Missing blockId attribute');
            op.attributes['blockId'] = uuidv4();
          }
        }
      }
    });

    this.store.setContent(delta.ops);
  }
}
