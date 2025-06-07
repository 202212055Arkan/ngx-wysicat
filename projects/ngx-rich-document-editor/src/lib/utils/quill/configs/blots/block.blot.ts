import Block from 'quill/blots/block';

export class CustomBlock extends Block {
  static override tagName = 'div';
  static override className = 'ql-block';
  static override blotName = 'block';
}
