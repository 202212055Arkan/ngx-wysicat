import {Signal} from '@angular/core';

import {Formats, ListFormats} from "./text-toolbar.configs";
import {FormatState} from './text-toolbar.models';

export interface ITextToolbarComponent {
  changeBasicFormat(format: Formats): void;
  changeListFormat(listFormat: ListFormats): void;
  changeLinkFormat(menuElement: HTMLButtonElement): void;
  changeBackgroundColorFormat(menuElement: HTMLButtonElement): void;
  changeTextColorFormat(menuElement: HTMLButtonElement): void;
  changeHeadingFormat(menuElement: HTMLButtonElement): void;
  clearFormat(): void;
}

export interface IToolbarService {
  componentState: Signal<FormatState>;
  changeFormat(format: Formats): void;
  changeListFormat(listFormat: ListFormats): void;
  changeLinkFormat(menuElement: HTMLButtonElement): void;
  changeBackgroundColorFormat(menuElement: HTMLButtonElement): void;
  changeTextColorFormat(menuElement: HTMLButtonElement): void;
  changeTypographyFormat(menuElement: HTMLButtonElement): void;
  clearFormat(): void;
}
