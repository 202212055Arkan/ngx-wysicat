import { effect,inject,Injectable  } from '@angular/core';
import { Op } from 'quill-delta';

import { QuillStore } from '../store/quill.store';

@Injectable({
  providedIn: 'root',
})
export class DocumentMetricsService {
  private store = inject(QuillStore);

  constructor() {
    effect(() => {
      const blocks = this.store.documentChanged();
      if (blocks && blocks.length > 0) {
        const wordCount = this.calculateWordCount(blocks);
        this.updateWordCount(wordCount);
      }
    });
  }

  private calculateWordCount(blocks: Op[]): number {
    let totalWords = 0;

    blocks.forEach((block) => {
      if (typeof block.insert === 'string') {
        const text = block.insert.trim();
        if (text.length > 0) {
          const words = text.split(/\s+/).filter((word) => word.length > 0);
          totalWords += words.length;
        }
      }
    });

    return totalWords;
  }

  private updateWordCount(count: number): void {
    this.store.updateWordCount(count);
  }
}
