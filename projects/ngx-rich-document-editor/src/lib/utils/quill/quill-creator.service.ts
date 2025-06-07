/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { inject, Injectable, Injector, NgZone, ViewContainerRef } from '@angular/core';
import { Scope } from 'parchment';
import Quill from 'quill';
import { Range } from 'quill/core/selection';
import { Context } from 'quill/modules/keyboard';
import Delta, { AttributeMap } from 'quill-delta';

import { ConfigsService } from '../../configs/configs.service';
import { LinkIdAttributor } from '../../features/link/quill/attributors/link-id.attributor';
import { CustomLink } from '../../features/link/quill/formats/link';
import { PluginManagerService } from '../../plugins/plugin-system';
import { TextCommandBusService } from '../../plugins/shared/text-commands/text-command-bus.service';
import { ToolbarService } from '../../plugins/text-toolbar';
import { EditorDataModel } from '../../rich-document.models';
import { QuillStore } from '../../store';
import { DocumentValidatorService } from '../document-validator.service';

import { BlockIdAttributor } from './configs/attributors/block-id.attributor';
import { CustomBlock } from './configs/blots/block.blot';
import { DividerBlot } from './configs/blots/divider.blot';
import { ListItem } from './configs/blots/list-block.blot';
import { PlaceholderModule } from './configs/modules/placeholder.module';
import { CustomBubbleTheme } from './configs/themes/custom-bubble-theme';
import { BlockSelectionService } from './utils/block-selection.service';
import { createQuillBlockId } from './utils/quill.utils';
import { RdeLinkTestComponent } from './web-elements/rde-link-test.component';
import { createCustomElement } from '@angular/elements';

@Injectable({
  providedIn: 'root',
})
export class QuillCreatorService {
  private quill!: Quill;
  private readonly configs = inject(ConfigsService);
  private readonly blockSelectionService = inject(BlockSelectionService);
  private readonly toolbarService = inject(ToolbarService);
  private readonly store = inject(QuillStore);
  private readonly ngZone = inject(NgZone);
  private readonly pluginManager = inject(PluginManagerService);
  private readonly documentValidator = inject(DocumentValidatorService);
  private readonly commandBus = inject(TextCommandBusService);
  private readonly injector = inject(Injector);

  init(editorRef: HTMLElement, toolbarRef: ViewContainerRef, editorData: EditorDataModel[]): Quill {
    Quill.debug('error');
    this.registerWebComponent()
    this.registerQuillModules();
    this.quill = this.createQuill(editorRef);
    this.activateToolbar(toolbarRef);
    this.initializePlugins();
    this.store.initQuill(this.quill);
    this.commandBus.initialize(this.quill);
    this.quill.focus();
    this.loadData(editorData);
    return this.quill;
  }

  loadData(editorData: EditorDataModel[]): void {
    if (this.quill) {
      this.documentValidator.ensureValidDocument(editorData);
      this.store.setContent(editorData);
    }
  }

  registerQuillModules(): void {
    Quill.register(BlockIdAttributor, true);
    Quill.register(LinkIdAttributor, true);
    Quill.register('themes/custom-bubble', CustomBubbleTheme);
    Quill.register('blots/block', CustomBlock);
    Quill.register(ListItem, true);
    Quill.register(DividerBlot, true);
    Quill.register('modules/placeholder', PlaceholderModule);

    Quill.register('formats/link', CustomLink, true);
  }

  private initializePlugins(): void {
    if (!this.quill) {
      console.error('Cannot initialize plugins: Quill instance not available');
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      try {
        this.pluginManager.initializePlugins(this.quill);
      } catch (error) {
        console.error('Error initializing plugins:', error);
      }
    });
  }

  registerWebComponent() {
    const component = createCustomElement(RdeLinkTestComponent, { injector: this.injector });
    if (!customElements.get('link-test')) {
      customElements.define('link-test', component);
    }
  }

  private createQuill(rootElement: HTMLElement): Quill {
    if (this.quill) {
      console.error('Quill was already created.');
      return this.quill;
    }
    return this.ngZone.runOutsideAngular(() => {
      this.quill = new Quill(rootElement, {
        theme: 'custom-bubble',
        bounds: rootElement,
        formats: [
          'blockId',
          'linkId',
          'divider',
          'header',
          'block',
          'code',
          'code-block',
          'bold',
          'italic',
          'underline',
          'strike',
          'link',
          'color',
          'background',
          'list',
          'blockquote',
        ],
        modules: {
          placeholder: {
            placeholder: `Start typing...`,
          },
          toolbar: '#rde-toolbar-wrapper',
          keyboard: {
            bindings: {
              'command enter handler': {
                key: 'Enter',
                handler: () => {
                  const activeCommand = this.commandBus.currentCommand;
                  return !activeCommand;
                },
              },

              'embed left': {
                key: 'ArrowLeft',
                shiftKey: false,
                altKey: null,
                prefix: /^$/,
                handler: (range: { index: number }, context: { line: { prev: any } }) => {
                  this.blockSelectionService.selectBlock(context.line.prev instanceof DividerBlot ? context.line.prev : null);
                  this.quill.setSelection(range.index - 1, 0, 'user');
                  return false;
                },
              },
              'embed right': {
                key: 'ArrowRight',
                shiftKey: false,
                altKey: null,
                suffix: /^$/,
                handler: (range: { index: number }, context: { line: { next: any } }) => {
                  if (context.line.next instanceof DividerBlot) {
                    this.blockSelectionService.selectBlock(context.line.next);
                  } else {
                    this.blockSelectionService.disableSelectedBlock();
                  }

                  this.quill.setSelection(range.index + 1, Quill.sources.USER);
                  return false;
                },
              },
              'code-block backspace': {
                key: 'Backspace',
                format: { 'code-block': true },
                handler: (range: Range, context: Context) => {
                  if (context.offset === 0) {
                    const [line] = this.quill.getLine(range.index);
                    if (line && line.length() <= 1) {
                      this.quill.format('code-block', false);
                      return false;
                    }
                  }
                  return true;
                },
              },
              'blockquote backspace': {
                key: 'Backspace',
                format: { blockquote: true },
                handler: (range: Range, context: Context) => {
                  if (context.offset === 0) {
                    const [line] = this.quill.getLine(range.index);
                    if (line && line.length() <= 1) {
                      this.quill.format('blockquote', false);
                      return false;
                    }
                  }
                  return true;
                },
              },
              'Backspace not collapsed': {
                key: 'Backspace',
                collapsed: true,
                handler: (range: Range, context: Context) => {
                  if (this.blockSelectionService.selectedBlock()) {
                    const x = this.quill.getSelection();
                    this.blockSelectionService.removeBlock();
                    if (x) {
                      this.quill.setSelection({ index: x.index, length: 0 });
                    }
                    return false;
                  }

                  const length = /[\uD800-\uDBFF][\uDC00-\uDFFF]$/.test(context.prefix) ? 2 : 1;

                  if (range.index === 0 || this.quill.getLength() <= 1) {
                    return;
                  }

                  let formats = {};
                  const [line] = this.quill.getLine(range.index);

                  let delta = new Delta().retain(range.index - length)
.delete(length);

                  if (context.offset === 0) {
                    const [prev] = this.quill.getLine(range.index - 1);

                    if (prev) {
                      const curFormats = line?.formats();
                      const prevFormats = this.quill.getFormat(range.index - 1, 1);

                      formats = AttributeMap.diff(curFormats, prevFormats) || {};
                      if (line && Object.keys(formats).length > 0) {
                        const formatDelta = new Delta().retain(range.index + line.length() - 2)
.retain(1, formats);
                        delta = delta.compose(formatDelta);
                      }
                    }
                  }

                  this.quill.updateContents(delta, Quill.sources.USER);
                  return false;
                },
              },
              'header enter': {
                key: 'Enter',
                collapsed: true,
                format: ['header'],
                suffix: /^$/,
                handler: (
                  range: { index: number | Record<string, unknown> },
                  context: {
                    format: { [x: string]: unknown };
                  },
                  _e: any,
                ) => {
                  const activeCommand = this.commandBus.currentCommand;
                  if (!activeCommand === false) {
                    return !activeCommand;
                  }

                  if (this.store.editorEntersDisabled()) {
                    // console.error('--------------------------------> ENTER NOT ALLWOED');
                    return false;
                  }
                  // console.error('--------------------------------> ENTER ALLWOED');

                  const inheritedFormats = Object.keys(context.format).reduce((formats: Record<string, unknown>, format) => {
                    if (this.quill.scroll.query(format, Scope.BLOCK) && !Array.isArray(context.format[format])) {
                      formats[format] = context.format[format];
                    }
                    return formats;
                  }, {});

                  const [line, offset] = this.quill.getLine(+range.index);
                  const delta = new Delta()
                    .retain(range.index)
                    .insert('\n', inheritedFormats)
                    // @ts-expect-error Fix me later
                    .retain(line.length() - offset - 1)
                    .retain(1, {
                      ...inheritedFormats,
                      blockId: createQuillBlockId(this.quill),
                    });
                  this.quill.updateContents(delta, Quill.sources.USER);
                  this.quill.setSelection(+range.index + 1, Quill.sources.SILENT);
                  this.quill.scrollSelectionIntoView();
                  return;
                },
              },
              'Enter not collapsed': {
                key: 'Enter',
                collapsed: true,
                handler: (range: Range, context: Context) => {
                  if (this.store.editorEntersDisabled()) {
                    // console.error('--------------------------------> ENTER NOT ALLWOED');
                    return false;
                  }
                  // console.error('--------------------------------> ENTER ALLWOED');

                  const inheritedFormats = Object.keys(context.format).reduce((formats: Record<string, unknown>, format) => {
                    if (this.quill.scroll.query(format, Scope.BLOCK) && !Array.isArray(context.format[format])) {
                      formats[format] = context.format[format];
                    }
                    return formats;
                  }, {});

                  const [line] = this.quill.getLine(range.index);
                  if (line) {
                    const isEmptyLine = line.length() <= 1;
                    const isStartOfLine = context.offset === 0;
                    let delta = new Delta();

                    if (isEmptyLine) {
                      delta = delta
                        .retain(range.index + 1)
                        .delete(range.length)
                        .insert('\n', {
                          ...inheritedFormats,
                          blockId: createQuillBlockId(this.quill),
                        });
                    } else if (isStartOfLine) {
                      delta = delta.retain(range.index).insert('\n', {
                        ...inheritedFormats,
                        blockId: createQuillBlockId(this.quill),
                      });
                    } else {
                      delta = delta
                        .retain(range.index)
                        .delete(range.length)
                        .insert('\n', inheritedFormats)
                        .retain(line.length() - context.offset - 1)
                        .retain(1, {
                          ...inheritedFormats,
                          blockId: createQuillBlockId(this.quill),
                        });
                    }

                    this.quill.updateContents(delta, Quill.sources.USER);

                    const newPosition = isStartOfLine ? range.index + 1 : range.index + 1;
                    this.quill.setSelection(newPosition);
                  }

                  this.quill.focus();

                  return false;
                },
              },
              'list empty enter': {
                key: 'Enter',
                collapsed: true,
                format: ['list'],
                empty: true,
                handler: (range: { index: number; length: number }, context: { format: { indent: any } }) => {
                  const formats: Record<string, unknown> = { list: false };

                  if (context.format.indent) {
                    formats['indent'] = false;
                  }

                  this.quill.formatLine(range.index, range.length, formats, Quill.sources.USER);
                  return false;
                },
              },
              'list autofill': {
                key: ' ',
                shiftKey: null,
                collapsed: true,
                format: {
                  CODE_BLOCK_FORMAT: false,
                  blockquote: false,
                  table: false,
                },
                prefix: /^\s*?(\d+\.|-|\*|\[ ?\]|\[x\])$/,
                handler: (range: { index: number }, context: { prefix: string }) => {
                  if (this.quill.scroll.query('list') == null) {
                    return true;
                  }

                  const { length } = context.prefix;
                  const [line, offset] = this.quill.getLine(range.index);

                  if (offset > length) {
                    return true;
                  }

                  let value;
                  switch (context.prefix.trim()) {
                    case '[]':
                    case '[ ]':
                      value = 'unchecked';
                      break;
                    case '[x]':
                      value = 'checked';
                      break;
                    case '-':
                    case '*':
                      value = 'bullet';
                      break;
                    default:
                      value = 'ordered';
                  }

                  this.quill.insertText(range.index, ' ', Quill.sources.USER);
                  this.quill.history.cutoff();
                  const delta = new Delta()
                    .retain(range.index - offset)
                    .delete(length + 1)
                    // @ts-expect-error Fix me later
                    .retain(line.length() - 2 - offset)
                    .retain(1, {
                      list: value,
                      blockId: line?.domNode.dataset?.['blockId'],
                    });

                  this.quill.updateContents(delta, Quill.sources.USER);
                  this.quill.history.cutoff();
                  this.quill.setSelection(range.index - length, Quill.sources.SILENT);
                  return false;
                },
              },
            },
          },
        },
      });
      return this.quill;
    });
  }

  private activateToolbar(textToolbarContainer: ViewContainerRef) {
    if (this.configs.getFeatureFlag('textToolbar')) {
      this.toolbarService.init(this.quill, textToolbarContainer);
    }
  }
}
