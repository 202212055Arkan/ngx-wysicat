import { BlockEmbed } from 'quill/blots/block';

export class DividerBlot extends BlockEmbed {
  static override blotName = 'divider';
  static override tagName = 'hr';
  static override className = 'ql-divider';

  static override create() {
    const node = super.create() as HTMLElement;
    node.appendChild(document.createTextNode('\uFEFF'));
    node.setAttribute('contenteditable', 'false');
    return node;
  }
}
