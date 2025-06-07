import Quill from 'quill';

import { INLINE_FORMATS_RESET } from '../../utils/quill/utils/quill.utils';
import { DIVIDER_FORMAT, HEADER_FORMAT, LIST_BULLET_FORMAT, LIST_FORMAT, LIST_ORDERED_FORMAT } from '../text-toolbar';

type FormatConfig = {
  format: string;
  value: string | number | boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  label?: any;
};

export class BlockFormatFactory {
  private static readonly formatMap: Record<string, FormatConfig> = {
    blockquote: { format: 'blockquote', value: true },
    bullet: { format: LIST_FORMAT, value: LIST_BULLET_FORMAT },
    'check-list': { format: LIST_FORMAT, value: 'unchecked' },
    'code-block': { format: 'code-block', value: true },
    divider: { format: DIVIDER_FORMAT, value: true },
    h1: { format: HEADER_FORMAT, value: 1 },
    h2: { format: HEADER_FORMAT, value: 2 },
    h3: { format: HEADER_FORMAT, value: 3 },
    h4: { format: HEADER_FORMAT, value: 4 },
    ordered: { format: LIST_FORMAT, value: LIST_ORDERED_FORMAT },
    text: { format: HEADER_FORMAT, value: false },
  };

  static applyFormat(blockType: string, quill: Quill): void {
    const config = this.formatMap[blockType];

    if (config) {
      if (blockType === 'text') {
        const selection = quill.getSelection();

        quill.formatText(0, 0, INLINE_FORMATS_RESET, 'silent');

        if (selection) {
          quill.formatText(selection.index, selection.length || 1, INLINE_FORMATS_RESET, 'silent');
        }
      }

      quill.format(config.format, config.value, 'silent');
    }
  }
}
