/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, Injectable, NgZone, signal, ViewContainerRef } from '@angular/core';
import Quill from 'quill';
import { v4 as uuidv4 } from 'uuid';

import { LinkComponent } from '../../features/link/components/link/link.component';
import { LinkService } from '../../features/link/components/link/link.service';
import { ColorPaletteComponent } from '../../ui/color-palette';
import { ListComponent } from '../../ui/list/list.component';
import { OverlayService } from '../../utils/overlay.service';
import { getSelectedText, removeFormat } from '../../utils/quill/utils/quill.utils';
import { MediaService } from '../document-settings/document-settings-media/media.service';

import { TextToolbarComponent } from './text-toolbar.component';
import {
  BLOCK_FORMAT,
  ColorFormats,
  Formats,
  HEADER_FORMAT,
  HEADER_FORMAT_PARAGRAPH_VALUE,
  HEADING_LEVELS,
  INIT_STATE,
  LIST_FORMAT,
} from './text-toolbar.configs';
import { FormatState } from './text-toolbar.models';

@Injectable({
  providedIn: 'root',
})
export class ToolbarService {
  private readonly state = signal<FormatState>(INIT_STATE);
  public readonly componentState = {
    bold: () => this.state().bold,
    italic: () => this.state().italic,
    underline: () => this.state().underline,
    strike: () => this.state().strike,
    code: () => this.state().code,
    codeBlock: () => this.state().codeBlock,
    blockquote: () => this.state().blockquote,
    header: () => this.state().header,
    color: () => this.state().color,
    background: () => this.state().background,
    list: () => this.state().list,
    rawFormats: () => this.state().rawFormats,
    link: () => this.state().link,
  };
  private readonly overlayService = inject(OverlayService);
  private readonly mediaStore = inject(MediaService);
  private readonly linkService = inject(LinkService);
  private readonly ngZone = inject(NgZone);
  private quill!: Quill;

  init(quill: Quill, toolbarElementRef: ViewContainerRef | undefined): void {
    this.quill = quill;
    this.linkService.init(quill);

    if (!toolbarElementRef) {
      return;
    }

    toolbarElementRef.createComponent(TextToolbarComponent);

    this.ngZone.runOutsideAngular(() => {
      this.quill.on('selection-change', (range) => {
        if (range) {
          this.ngZone.run(() => {
            this.updateFormatState();
          });
        }
      });

      quill.root.addEventListener('click', (e) => {
        const target = e.target as Element;
        const link = target?.closest('a');
        if (link) {
          window.open(link.href, '_blank');
          e.preventDefault();
        }
      });
    });
  }

  changeFormat(newFormat: Formats): void {
    const format = this.quill.getFormat();
    this.quill.format(newFormat, !format[newFormat]);
    this.updateFormatState();
  }

  changeListFormat(newFormat: any): void {
    const format = this.quill.getFormat();
    this.quill.format(LIST_FORMAT, format[LIST_FORMAT] === newFormat ? null : newFormat);
    this.updateFormatState();
  }

  changeHeadingFormat(value: any): void {
    if (value === HEADER_FORMAT_PARAGRAPH_VALUE) {
      this.quill.format(BLOCK_FORMAT, true);
    } else {
      this.quill.format(HEADER_FORMAT, parseInt(value));
    }
    this.updateFormatState();
  }

  changeColorFormat(color: string | null, type: ColorFormats): void {
    this.quill.format(type, color);
    this.updateFormatState();
  }

  clearFormat(): void {
    removeFormat(this.quill);
    this.updateFormatState();
  }

  updateFormats(formats: any): void {
    this.state.set({
      bold: !!formats.bold,
      italic: !!formats.italic,
      underline: !!formats.underline,
      strike: !!formats.strike,
      code: !!formats.code,
      codeBlock: !!formats['code-block'],
      blockquote: !!formats.blockquote,
      header: formats.header || null,
      list: formats.list || null,
      rawFormats: formats,
      color: formats.color || null,
      background: formats.background || null,
      link: formats.link || null,
    });
  }

  changeLinkFormat(linkMenuHtmlButtonElement: HTMLButtonElement): void {
    const component = this.overlayService.open(LinkComponent, linkMenuHtmlButtonElement, {
      strategy: 'block',
      offsetY: 44,
    });

    const selection = this.quill.getSelection();

    if (!selection) {
      return;
    }

    const selectedText = getSelectedText(this.quill, selection);

    if (selectedText.length <= 0) {
      return;
    }

    component.linkText.set(getSelectedText(this.quill, selection));

    const url = this.quill.getFormat(selection.index, selection.length)['link'] as string;
    if (url) {
      component.url.set(url);
    }

    component.linkSubmitted.subscribe((output: { text: string; url: unknown }) => {
      this.quill.deleteText(selection.index, selection.length);
      this.quill.insertText(selection.index, output.text, {
        link: output.url,
        linkId: uuidv4(),
      });
      this.quill.setSelection(selection.index, output.text.length);

      this.mediaStore.addItem({
        url: output.url as string,
        title: output.text,
        icon: 'link',
      });
      this.overlayService.close();
    });

    component.linkCancelled.subscribe(() => this.overlayService.close());
  }

  changeTypographyFormat(typographyMenuHTMLButtonElement: HTMLButtonElement): void {
    const component = this.overlayService.open(ListComponent, typographyMenuHTMLButtonElement, {
      strategy: 'block',
      offsetY: 10,
    });

    component.blockOptionsx = HEADING_LEVELS;

    component.selected.subscribe((headingLevel) => {
      for (const x of HEADING_LEVELS) {
        if (x.label === headingLevel) {
          this.changeHeadingFormat(x.value);
        }
      }
      this.overlayService.close();
    });
  }

  changeBackgroundColorFormat(backgroundColorMenu: HTMLButtonElement): void {
    const component = this.overlayService.open(ColorPaletteComponent, backgroundColorMenu, {
      strategy: 'block',
      offsetY: 10,
    });

    component.colorChange.subscribe((backgroundColor) => {
      this.changeColor(backgroundColor, 'background');
      this.overlayService.close();
    });
  }

  changeColor(color: string | null, type: ColorFormats): void {
    this.changeColorFormat(color, type);
  }

  changeTextColorFormat(textColorMenu: HTMLButtonElement): void {
    const component = this.overlayService.open(ColorPaletteComponent, textColorMenu, {
      strategy: 'block',
      hasBackdrop: true,
      offsetY: 10,
    });

    component.colorChange.subscribe((textColor) => {
      this.changeColor(textColor, 'color');
      this.overlayService.close();
    });
  }

  private updateFormatState(): void {
    const formats = this.quill.getFormat();
    this.updateFormats(formats);
  }
}
