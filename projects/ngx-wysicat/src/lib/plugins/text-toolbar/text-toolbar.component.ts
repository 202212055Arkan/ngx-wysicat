import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { SvgIconComponent } from '../../ui/icon/svg-icon.component';
import { TooltipDirective } from '../../ui/tooltip/tooltip.directive';

import { Formats, ListFormats } from './text-toolbar.configs';
import { ToolbarService } from './toolbar.service';

@Component({
  selector: 'nw-text-toolbar',
  templateUrl: './text-toolbar.component.html',
  styleUrl: './text-toolbar.component.scss',
  imports: [TooltipDirective, SvgIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextToolbarComponent {
  private readonly textToolbarService = inject(ToolbarService);
  protected readonly componentState = this.textToolbarService.componentState;

  get isCodeBlock() {
    return this.componentState.codeBlock();
  }

  get isOrderedList() {
    return this.componentState.list() === 'ordered';
  }

  get isBulletList() {
    return this.componentState.list() === 'bullet';
  }

  get isCheckedList() {
    return this.componentState.list() === 'checked';
  }

  get isLink() {
    return this.componentState.link() !== null;
  }

  get isTypographySelected() {
    const formats = this.componentState.rawFormats();
    return !formats.list && !formats.codeBlock && !formats.blockquote && !formats.indent && !formats.align && !formats.direction;
  }

  changeBasicFormat(format: Formats): void {
    this.textToolbarService.changeFormat(format);
  }

  changeListFormat(listFormat: ListFormats): void {
    this.textToolbarService.changeListFormat(listFormat);
  }

  changeLinkFormat(menuElement: HTMLButtonElement): void {
    this.textToolbarService.changeLinkFormat(menuElement);
  }

  changeBackgroundColorFormat(menuElement: HTMLButtonElement): void {
    this.textToolbarService.changeBackgroundColorFormat(menuElement);
  }

  changeTextColorFormat(menuElement: HTMLButtonElement): void {
    this.textToolbarService.changeTextColorFormat(menuElement);
  }

  changeHeadingFormat(menuElement: HTMLButtonElement): void {
    this.textToolbarService.changeTypographyFormat(menuElement);
  }

  clearFormat(): void {
    this.textToolbarService.clearFormat();
  }
}
