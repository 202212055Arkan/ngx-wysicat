import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WordsCounterService {
  private wordCount = signal<number>(0);

  getWordCount() {
    return this.wordCount;
  }

  updateWordCount(count: number): void {
    this.wordCount.set(count);
  }
}
