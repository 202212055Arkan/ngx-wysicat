import { inject, Injectable } from '@angular/core';
import Quill from 'quill';

import { RichDocumentEditorPlugin } from '../plugin-system';

import { WordsCounterService } from './words-counter.service';

@Injectable({
  providedIn: 'root',
})
export class WordsCounterPlugin implements RichDocumentEditorPlugin {
  id = 'wordsCounter';
  name = 'Words Counter Plugin';

  private quill: Quill | null = null;
  private readonly handlers = new Set<(count: number) => void>();
  private lastWordCount = 0;
  private textChangeHandler: (() => void) | null = null;
  private wordsCounterService = inject(WordsCounterService);

  initialize(quill: Quill): void {
    this.quill = quill;
    this.lastWordCount = this.getCurrentWordCount();
    this.updateWordCount(this.lastWordCount);

    if (this.quill.isEnabled()) {
      this.setupTextChangeListener();
    } else {
      this.quill.once('editor-change', () => this.setupTextChangeListener());
    }
  }

  destroy(): void {
    if (this.quill && this.textChangeHandler) {
      this.quill.off('text-change', this.textChangeHandler);
    }
    this.handlers.clear();
    this.quill = null;
    this.textChangeHandler = null;
  }

  private getCurrentWordCount(): number {
    if (!this.quill) return 0;

    const text = this.quill.getText().trim();
    if (!text) return 0;

    return text.split(/\s+/).filter((word) => word.length > 0).length;
  }

  private updateWordCount(count: number): void {
    this.wordsCounterService.updateWordCount(count);
  }

  private setupTextChangeListener(): void {
    if (!this.quill) return;

    this.textChangeHandler = () => {
      const currentWordCount = this.getCurrentWordCount();

      if (currentWordCount !== this.lastWordCount) {
        this.lastWordCount = currentWordCount;
        this.updateWordCount(currentWordCount);

        this.handlers.forEach((handler) => {
          handler(this.lastWordCount);
        });
      }
    };

    this.quill.on('text-change', this.textChangeHandler);
  }
}
