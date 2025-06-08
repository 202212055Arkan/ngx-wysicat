import { type EmbedBlot } from 'parchment';
import Quill from 'quill';
import QuillLink from 'quill/formats/link';

const Embed = Quill.import('blots/embed') as typeof EmbedBlot;
const Link = Quill.import('formats/link') as typeof QuillLink;

export class LinkedinBlot extends Embed {
  static override blotName = 'linkedin';
  static override tagName = 'iframe';
  static override className = 'ql-linkedin';

  static override create(value: string) {
    const node = super.create() as HTMLElement;
    const url = this.sanitize(value);

    node.setAttribute('src', url);
    node.setAttribute('width', '500');
    node.setAttribute('height', '500');
    node.setAttribute('frameborder', '0');
    node.dataset['url'] = url;

    return node;
  }

  static override value(domNode: HTMLElement) {
    return domNode.dataset['url'] || domNode.getAttribute('src');
  }

  static sanitize(url: string): string {
    return Link.sanitize(url);
  }
}
