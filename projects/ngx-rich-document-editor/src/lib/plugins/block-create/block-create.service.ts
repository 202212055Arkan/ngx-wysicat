/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, Injectable } from '@angular/core';
import Quill, { Parchment } from 'quill';
import Delta from 'quill-delta';

import { OverlayService } from '../../utils/overlay.service';
import { createQuillBlockId, getCurrentLine, isSyntaxCodeBlockContainer } from '../../utils/quill/utils/quill.utils';
import { TextCommandBusService } from '../shared/text-commands/text-command-bus.service';

import { BlockListComponent } from './block-list/block-list.component';
import { BlockFormatFactory } from './block-format.factory';
import { BLOCKS_TYPES } from './block-types-data';

@Injectable({
  providedIn: 'root',
})
export class BlockCreateService {
  private readonly overlayService = inject(OverlayService);
  private readonly textCommandBusService = inject(TextCommandBusService);
  private blockListComponent!: BlockListComponent | null;
  private commandSubscription: any = null;
  private commandData: any = null;
  private quill!: Quill;

  public onQuillReady(quill: Quill) {
    this.quill = quill;

    this.commandSubscription = this.textCommandBusService.activeCommand$.subscribe((commandData) => {
      if (commandData?.type === 'BLOCK_MENU') {
        this.commandData = commandData;

        if (!this.blockListComponent) {
          this.openDropdownMenu(commandData);
        } else {
          this.updateBlockList(commandData.searchText);
        }
      } else if (this.blockListComponent) {
        this.closeMenu();
      }
    });

    this.overlayService.closed$.subscribe(() => {
      if (this.blockListComponent) {
        this.closeMenu();
      }
    });
  }

  closeMenu() {
    if (this.commandSubscription) {
      this.blockListComponent = null;
      this.commandData = null;
      this.overlayService.close();
      this.textCommandBusService.resetCommand();
    }
  }

  public createNewBlockHTMLElement(selectedBlock: HTMLElement): void {
    // @ts-ignore
    const isBlockquote = Quill.find(selectedBlock) instanceof Quill.import('formats/blockquote');

    if (isSyntaxCodeBlockContainer(Quill.find(selectedBlock)) || isBlockquote) {
      const previousBlock: any = Quill.find(selectedBlock);
      const index = this.quill.getIndex(previousBlock);
      const blockText = this.quill.getText(index, previousBlock.length());
      const isEmptyLine = blockText.trim() === '';
      const newBlockId = createQuillBlockId(this.quill);

      if (isEmptyLine) {
        this.quill.insertText(index, '/', 'api');
        this.quill.setSelection(index + 1, 0);
      } else {
        const delta = new Delta().retain(index + previousBlock.length())
.insert('\n', { ...{}, blockId: newBlockId });
        this.quill.updateContents(delta, 'silent');
        this.quill.setSelection(index + previousBlock.length(), 0);
        this.quill.insertText(index + previousBlock.length(), '/', 'api');
        this.quill.setSelection(index + previousBlock.length() + 1, 0);
      }

      return;
    }

    if (Quill.find(selectedBlock) instanceof Parchment.BlockBlot) {
      const previousBlock: any = Quill.find(selectedBlock);
      const index = this.quill.getIndex(previousBlock);
      const blockText = this.quill.getText(index, previousBlock.length());
      const isEmptyLine = blockText.trim() === '';
      const newBlockId = createQuillBlockId(this.quill);

      if (isEmptyLine) {
        this.quill.insertText(index, '/', 'api');
        this.quill.setSelection(index + 1, 0);
      } else {
        const delta = new Delta().retain(index + previousBlock.length())
.insert('\n', { ...{}, blockId: newBlockId });
        this.quill.updateContents(delta, 'silent');
        this.quill.setSelection(index + previousBlock.length(), 0);
        this.quill.insertText(index + previousBlock.length(), '/', 'api');
        this.quill.setSelection(index + previousBlock.length() + 1, 0);
      }

      return;
    }

    if (selectedBlock.tagName === 'HR') {
      const previousBlock: any = Quill.find(selectedBlock);
      const index = this.quill.getIndex(previousBlock);
      const newBlockId = createQuillBlockId(this.quill);
      const blockFormats = this.quill.getFormat(index, 1);
      const delta = new Delta().retain(index + previousBlock.length())
.insert('\n', { ...blockFormats, blockId: newBlockId });
      this.quill.updateContents(delta, 'silent');
      this.quill.setSelection(index + previousBlock.length(), 0);

      this.quill.insertText(index + previousBlock.length(), '/');
      return;
    }

    const prevBlockId = selectedBlock.dataset['blockId'];
    const previousBlock = this.quill.getLines().find((line) => {
      return line.domNode.dataset['blockId'] === prevBlockId;
    });

    if (!previousBlock) {
      return;
    }

    const index = this.quill.getIndex(previousBlock);

    if (previousBlock.length() === 1) {
      this.quill.formatLine(index + previousBlock.length() - 1, 1, 'block', 'silent');
      this.quill.insertText(index + previousBlock.length() - 1, '/', 'user');
      this.quill.setSelection(index + previousBlock.length(), 0);
      return;
    }

    const blockFormats = this.quill.getFormat(index, 1);
    const newBlockId = createQuillBlockId(this.quill);

    const delta = new Delta().retain(index + previousBlock.length())
.insert('\n', { ...blockFormats, blockId: newBlockId });
    this.quill.updateContents(delta, 'silent');
    this.quill.setSelection(index + previousBlock.length(), 0);
    this.quill.insertText(index + previousBlock.length(), '/');

    this.textCommandBusService.resetCommand();
  }

  private openDropdownMenu(command: any): void {
    const selection = this.quill?.getSelection();
    if (!selection || !this.quill) return;

    const line = getCurrentLine(this.quill, selection.index);
    if (!line || !line.domNode) return;

    const bounds = this.quill.getBounds(command.triggerIndex);
    if (!bounds) return;

    const openOptions = {
      offsetY: 10,
      strategy: 'block',
      hasBackdrop: true,
    };

    this.blockListComponent = this.overlayService.open(BlockListComponent, line.domNode, openOptions);
    this.blockListComponent.data = this.filterBlockData(BLOCKS_TYPES, command.searchText);

    this.blockListComponent.blockTypeSelected.subscribe((blockType: string) => {
      this.insertBlock(blockType);
    });
  }

  private updateBlockList(searchText: string): void {
    if (this.blockListComponent) {
      this.blockListComponent.data = this.filterBlockData(BLOCKS_TYPES, searchText);
    }
  }

  private insertBlock(blockType: string): void {
    const quill = this.quill;
    if (!quill || !this.commandData) {
      return;
    }

    quill.focus();

    const triggerIndex = this.commandData.triggerIndex;
    const deleteLength = 1 + this.commandData.searchText.length;

    quill.deleteText(triggerIndex, deleteLength);
    // quill.focus();
    BlockFormatFactory.applyFormat(blockType, quill);

    if (blockType === 'divider') {
      quill.insertText(triggerIndex + 1, '\n', 'block', 'silent');
      quill.setSelection(triggerIndex + 1);
    }

    this.closeMenu();
  }

  private filterBlockData(blocks: any[], query: string): any[] {
    if (!query) return blocks;

    const lowerQuery = query.toLowerCase();

    return blocks
      .map((section) => {
        const filteredItems = section.items.filter((item: any) => item.name.toLowerCase().includes(lowerQuery));

        if (filteredItems.length > 0) {
          return { ...section, items: filteredItems };
        }

        return null;
      })
      .filter((section) => section !== null);
  }

  // //todo
  // createNewBlock(): void {
  //   const lastLine = this.quill.getLines()[this.quill.getLines().length - 1];
  //   const index = lastLine.offset();
  //
  //   this.quill.insertText(index + lastLine.length(), '\n', 'block', 'silent');
  //   this.quill.formatLine(index + lastLine.length(), 0, {
  //     blockId: createQuillBlockId(this.quill),
  //   });
  //   this.quill.setSelection(index + lastLine.length(), 0);
  //   this.quill.focus();
  // }
}
