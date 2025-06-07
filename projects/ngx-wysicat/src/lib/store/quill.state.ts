import {ViewContainerRef} from '@angular/core';
import {Op} from 'quill-delta';

export interface QuillState {
  isQuillReady: boolean;
  editorEntersDisabled: boolean;
  toolbarRef: ViewContainerRef | null;
  isDocumentSettingsMenuOpened: boolean;

  isFavourite: boolean;

  blocks: Op[];
  currentBlockIndex: number;
  currentBlockId: string;
  blockMenu: {
    position: {
      top: number,
      left: number,
    },
    blockElement: HTMLElement | null
  }
}
