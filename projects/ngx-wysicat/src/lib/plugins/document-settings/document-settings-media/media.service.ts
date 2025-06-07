import { Injectable, signal } from '@angular/core';
import Quill from 'quill';

export interface MediaItem {
  title: string;
  url: string;
  icon: string;
}

const STORAGE_KEY = 'nw-media-items';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  mediaItems = signal<MediaItem[]>(this.loadFromStorage());

  initialize(quill: Quill): void {
    quill.on('text-change', () => {
      const contents = quill.getContents();
      const items: MediaItem[] = [];

      contents.ops?.forEach((op) => {
        if (op.attributes && op.attributes['link']) {
          const url = op.attributes['link'] as string;
          const text = typeof op.insert === 'string' ? op.insert : '';
          const title = text.trim() || url;

          items.push({
            title,
            url,
            icon: 'link',
          });
        }
      });

      this.setItems(items);
    });
  }

  setItems(items: MediaItem[]): void {
    this.mediaItems.set(items || []);
    this.saveToStorage(items || []);
  }

  addItem(item: MediaItem): void {
    const currentItems = this.mediaItems();
    const exists = currentItems.some((i) => i.url === item.url);

    if (!exists) {
      const newItems = [...currentItems, item];
      this.mediaItems.set(newItems);
      this.saveToStorage(newItems);
    }
  }

  removeItem(url: string): void {
    const newItems = this.mediaItems().filter((item) => item.url !== url);
    this.mediaItems.set(newItems);
    this.saveToStorage(newItems);
  }

  private loadFromStorage(): MediaItem[] {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        return JSON.parse(storedData) || [];
      }
    } catch (error) {
      console.error('Failed to load media items from local storage:', error);
    }
    return [];
  }

  private saveToStorage(items: MediaItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items || []));
    } catch (error) {
      console.error('Failed to save media items to local storage:', error);
    }
  }
}
