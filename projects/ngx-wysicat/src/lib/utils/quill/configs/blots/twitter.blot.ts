import { type EmbedBlot } from 'parchment';
import Quill from 'quill';

const Embed = Quill.import('blots/embed') as typeof EmbedBlot;

export class TweetBlot extends Embed {
  static override blotName = 'tweet';
  static override tagName = 'iframe';
  static override className = 'ql-tweet';

  static override create(tweetId: string) {
    const node = super.create() as HTMLElement;
    const sanitizedId = this.sanitize(tweetId);
    const embedUrl = `https://platform.twitter.com/embed/Tweet.html?&id=${sanitizedId}`;

    node.setAttribute('src', embedUrl);
    node.setAttribute('width', '500');
    node.setAttribute('height', '300');
    node.setAttribute('frameborder', '0');
    node.setAttribute('scrolling', 'yes');
    node.dataset['id'] = sanitizedId;

    return node;
  }

  static override value(domNode: HTMLElement): string {
    return domNode.dataset['id'] || '';
  }

  static sanitize(tweetId: string): string {
    return tweetId.replace(/\D/g, '');
  }
}
