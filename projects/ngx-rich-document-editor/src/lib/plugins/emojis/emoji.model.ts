import { EmojiNames } from './emojis-data';

export interface Emoji {
  iconLabel: string;
  name: EmojiNames;
  shortname: string;
  unicode: string;
  html: string;
  category: string;
  keywords: string[];
}

export interface EmojiCategory {
  id: string;
  name: string;
  emojis: Emoji[];
}

export interface EmojiEvent {
  emoji: Emoji;
  index: number;
}
