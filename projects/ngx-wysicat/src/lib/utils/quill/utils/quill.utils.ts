/* eslint-disable @typescript-eslint/no-explicit-any */
import Quill from 'quill';
import Block, { BlockEmbed } from 'quill/blots/block';
import Delta, { Op } from 'quill-delta';
import { v4 as uuidv4 } from 'uuid';

export const INLINE_FORMATS_RESET = {
  bold: false,
  italic: false,
  underline: false,
  strike: false,
  link: false,
  color: false,
  background: false,
  size: false,
  font: false,
  code: false,
  list: false,
  blockquote: false,
  'code-block': false,
  script: false,
  header: false,
};

export function getSelectedText(quill: Quill, givenSelection?: any): string {
  let selection = null;

  if (givenSelection) {
    selection = givenSelection;
  } else {
    selection = quill.getSelection();
  }

  if (!selection) {
    throw new Error('No selection found');
  }

  return quill.getText(selection.index, selection.length);
}

export function getCurrentLine(quill: Quill, index: number): any {
  const [line] = quill.getLine(index);

  if (!line) {
    console.error(`Quill Line`);
  }

  return line;
}

export function removeFormat(quill: Quill) {
  const selection = getSelection(quill);
  quill.removeFormat(selection.index, selection.length);
}

export function getSelection(quill: Quill): any {
  const selection = quill.getSelection();

  if (!selection) {
    return;
  }

  return selection;
}

export function createQuillBlockId(quill: Quill): string {
  // https://www.uuidtools.com/api/generate/v4
  const newId = uuidv4();
  const currentIds = quill.getLines().map((line) => line.domNode.dataset['blockId']);

  if (currentIds.includes(newId)) {
    return createQuillBlockId(quill);
  }

  return newId;
}

export function isDividerBlot(blot: unknown): blot is BlockEmbed {
  return blot instanceof BlockEmbed && (blot as any).domNode?.classList?.contains('ql-divider');
}

export function isSyntaxCodeBlockContainer(blot: unknown): boolean {
  return typeof blot === 'object' && blot !== null && (blot as any).domNode?.classList?.contains('ql-code-block-container');
}

// SyntaxCodeBlockContainer

export function clearFormat(quill: Quill, blockElement: Element): void {
  const block = Quill.find(blockElement) as Block;

  if (!block) {
    return;
  }

  if (isDividerBlot(block)) {
    const blockIndex = quill.getIndex(block);
    const blockId = block.domNode.dataset['blockId'];

    quill.deleteText(blockIndex, 1);

    const delta = new Delta().insert('\n', {
      'block-id': blockId,
    });

    quill.updateContents(delta, 'silent');
    return;
  }

  const blockIndex = quill.getIndex(block);
  const blockLength = block.length();

  quill.formatText(blockIndex, blockLength, INLINE_FORMATS_RESET, 'silent');
  quill.formatLine(blockIndex, blockLength, INLINE_FORMATS_RESET, 'silent');
}

export function duplicateBlock(quill: Quill, blockElement: Element, newId: string): void {
  if (blockElement.className.includes('ql-code-block')) {
    const codeBlockContainer = blockElement.closest('.ql-code-block-container');
    if (!codeBlockContainer) return;

    const codeBlockContainerBlot = Quill.find(codeBlockContainer);
    if (!codeBlockContainerBlot) return;

    // @ts-ignore
    const blockIndex = quill.getIndex(codeBlockContainerBlot);
    // @ts-ignore
    const blockLength = codeBlockContainerBlot.length();

    const formats = quill.getFormat(blockIndex);
    const language = blockElement.getAttribute('data-language') || formats['code-block'] || 'plain';

    const normalBlockId = createQuillBlockId(quill);

    const delta = new Delta()
      .retain(blockIndex + blockLength)
      .insert('\n', { blockId: normalBlockId });

    const lines = quill.getText(blockIndex, blockLength).split('\n');

    if (lines.length > 0 && lines[lines.length - 1] === '') {
      lines.pop();
    }

    for (let i = 0; i < lines.length; i++) {
      const lineBlockId = i === 0 ? newId : createQuillBlockId(quill);
      delta.insert(lines[i]);
      delta.insert('\n', { blockId: lineBlockId, 'code-block': language });
    }

    quill.updateContents(delta, 'silent');
    return;
  }

  const lineBlockToDuplicate = Quill.find(blockElement) as Block;
  const blockIndex = quill.getIndex(lineBlockToDuplicate);
  const inheritedFormats = quill.getFormat(blockIndex);

  const isDivider = isDividerBlot(lineBlockToDuplicate);

  lineBlockToDuplicate?.delta().ops.forEach((op: Op) => {
    if (op.attributes && op.attributes['blockId']) {
      op.attributes['data-block-id'] = newId;
    }
  });

  if (isDivider) {
    const delta = new Delta().retain(blockIndex + 1)
.insert({ divider: true }, { ...inheritedFormats, 'data-block-id': newId });

    quill.updateContents(delta);
  } else {
    lineBlockToDuplicate.delta().delete(1);

    const delta = new Delta()
      .retain(blockIndex + lineBlockToDuplicate.length() - 1)
      .insert('\n', { ...inheritedFormats })
      .concat(lineBlockToDuplicate.delta());

    quill.updateContents(delta);
  }
}
