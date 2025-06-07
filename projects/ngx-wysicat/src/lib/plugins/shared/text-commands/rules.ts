/* eslint-disable @typescript-eslint/no-explicit-any */
import Quill from 'quill';

export const commandRules: Record<string, (insertInfo: any, quill: Quill) => boolean> = {
  BLOCK_MENU: (insertInfo: any, quill: Quill) => {
    if (insertInfo?.position === 0 && insertInfo.char === '/') {
      return true;
    }

    if (!insertInfo?.position) {
      return false;
    }

    const [line] = quill.getLine(insertInfo.position);

    if (!line) {
      return false;
    }

    const isLineEmpty = line.domNode.textContent?.length === 1;
    return insertInfo.position === line.offset(quill.scroll) && isLineEmpty;
  },
  EMOJI: (insertInfo: any, quill: Quill) => {
    if (insertInfo?.position === 0 && insertInfo.char === ':') {
      return true;
    }

    if (!insertInfo?.position || insertInfo.char !== ':') {
      return false;
    }

    const [line] = quill.getLine(insertInfo.position);
    if (!line) {
      return false;
    }

    if (line.domNode.textContent?.length === 1) {
      return true;
    }

    const charBeforeColon = insertInfo.position > 0 ? quill.getText(insertInfo.position - 1, 1) : '';

    const charAfterColon = insertInfo.position < quill.getLength() - 1 ? quill.getText(insertInfo.position + 1, 1) : '';

    const isAtEnd = charAfterColon === '' || charAfterColon === '\n';

    if (charBeforeColon === ' ' && isAtEnd) {
      return true;
    }

    if (charBeforeColon === ' ' && charAfterColon === ' ') {
      return true;
    }

    return false;
  },
  MENTION: () => true,
};
