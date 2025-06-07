import { QuillState } from './quill.state';

export const initialState: QuillState = {
  editorEntersDisabled: false,
  toolbarRef: null,
  blocks: [],
  isQuillReady: false,
  currentBlockIndex: 0,
  currentBlockId: '',
  isDocumentSettingsMenuOpened: true,
  isFavourite: true,
  blockMenu: {
    position: {
      top: -100,
      left: -100,
    },
    blockElement: null,
  },
};
