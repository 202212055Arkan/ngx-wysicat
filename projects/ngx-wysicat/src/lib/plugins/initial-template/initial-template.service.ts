import { afterNextRender, ApplicationRef, ComponentRef, createComponent, inject, Injectable, Injector } from '@angular/core';
import Quill from 'quill';

import { QuillStore } from '../../store';
import { INLINE_FORMATS_RESET } from '../../utils/quill/utils/quill.utils';

import { InitialTemplateComponent } from './initial-template.component';

@Injectable({
  providedIn: 'root',
})
export class InitialTemplateService {
  private store = inject(QuillStore);
  private injector = inject(Injector);
  private appRef = inject(ApplicationRef);

  private quill!: Quill;
  private templateContainer!: HTMLElement;
  private templateComponentRef: ComponentRef<InitialTemplateComponent> | null = null;
  private hasShownTemplate = false;
  private initialContentWasPresent = false;
  private contentWasEverPresent = false;

  constructor() {
    afterNextRender(() => {
      const quill = this.store.quill;

      if (quill()) {
        this.onQuillReady(quill());
      }
    });
  }

  onQuillReady(quill: Quill | null): void {
    if (!quill) {
      return;
    }

    this.quill = quill;
    this.templateContainer = document.createElement('div');
    this.templateContainer.className = 'ql-initial-template';
    this.quill.addContainer(this.templateContainer);

    const initialText = this.quill.getText().trim();
    this.initialContentWasPresent = initialText.length > 0;
    this.contentWasEverPresent = this.initialContentWasPresent;

    this.updateTemplateVisibility();

    this.quill.on('text-change', () => {
      const currentText = this.quill.getText().trim();
      if (currentText.length > 0) {
        this.contentWasEverPresent = true;
      }
      this.updateTemplateVisibility();
    });
  }

  register(): void {}

  private updateTemplateVisibility(): void {
    const contents = this.quill.getContents();
    const text = this.quill.getText().trim();
    const ops = contents.ops || [];

    const isEmptySingleLine = text === '' && (ops.length === 1 || (ops.length === 2 && ops[1].insert === '\n'));

    if (isEmptySingleLine && this.quill.getLines().length <= 1 && !this.hasShownTemplate && !this.contentWasEverPresent) {
      this.showTemplate();
    } else {
      this.hideTemplate();
    }
  }

  private showTemplate(): void {
    if (!this.templateComponentRef) {
      this.templateComponentRef = createComponent(InitialTemplateComponent, {
        environmentInjector: this.appRef.injector,
        elementInjector: this.injector,
      });

      this.templateContainer.appendChild(this.templateComponentRef.location.nativeElement);

      this.appRef.attachView(this.templateComponentRef.hostView);

      this.positionTemplateInCenter();

      this.templateComponentRef.instance.templateSelected.subscribe((item: any) => {
        this.handleTemplateSelection(item);
      });
    }

    this.templateContainer.style.display = 'flex';
    this.hasShownTemplate = true;
  }

  private hideTemplate(): void {
    if (this.templateContainer) {
      this.templateContainer.style.display = 'none';
    }
  }

  private positionTemplateInCenter(): void {
    if (!this.templateContainer) return;

    const editorElement = this.quill.root;
    if (!editorElement) {
      return;
    }
    editorElement.style.position = 'relative';
  }

  private handleTemplateSelection(item: any): void {
    this.quill.focus();
    switch (item.icon) {
      case 'paragraph': {
        this.quill.formatText(0, 10, INLINE_FORMATS_RESET, 'silent');
        break;
      }
      case 'heading-1':
        this.quill.format('header', 1);
        break;
      case 'heading-2':
        this.quill.format('header', 2);
        break;
      case 'heading-3':
        this.quill.format('header', 3);
        break;
      case 'heading-4':
        this.quill.format('header', 4);
        break;
      case 'unordered-list':
        this.quill.format('list', 'bullet');
        break;
      case 'ordered-list':
        this.quill.format('list', 'ordered');
        break;
      case 'check-list':
        this.quill.format('list', 'unchecked');
        break;
      case 'blockquote':
        this.quill.format('blockquote', true);
        break;
      case 'divider-y':
        this.quill.insertEmbed(0, 'divider', true);
        this.quill.insertText(1, '\n');
        this.quill.setSelection(1);
        this.quill.focus();
        break;
      case 'code-block':
        this.quill.format('code-block', true);
        break;
      case 'emoji':
        this.quill.insertText(0, ':');
        break;
      default:
        this.quill.focus();
    }

    this.hideTemplate();
  }
}
