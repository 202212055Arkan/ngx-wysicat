import { CdkScrollable } from '@angular/cdk/overlay';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  NgZone,
  OnDestroy,
  OnInit,
  output,
  viewChild,
  ViewContainerRef,
} from '@angular/core';

import { ConfigsService } from './configs/configs.service';
import { PluginManagerService } from './plugins/plugin-system';
import { QuillCreatorService } from './utils/quill/quill-creator.service';
import { createQuillBlockId } from './utils/quill/utils/quill.utils';
import { QuillStore } from './store';
import { EditorDataModel } from './wysicat-root.models';
import { WysicatRootService } from './wysicat-root.service';

@Component({
  selector: 'nw-root',
  templateUrl: './wysicat-root.component.html',
  imports: [CdkScrollable],
  styleUrls: ['./wysicat-root.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WysicatRootComponent implements OnInit, AfterViewInit, OnDestroy {
  public readonly editorData = input.required<EditorDataModel[]>();
  public readonly editorDataChanged = output<EditorDataModel[]>();
  protected readonly editorRef = viewChild<ElementRef>('editor');
  protected readonly toolbarRef = viewChild<unknown, ViewContainerRef>('toolbar', { read: ViewContainerRef });
  protected readonly configsService = inject(ConfigsService);
  protected readonly store = inject(QuillStore);
  protected readonly richDocumentService = inject(WysicatRootService);
  private readonly quillCreatorService = inject(QuillCreatorService);
  private readonly pluginManagerService = inject(PluginManagerService);
  private readonly ngZone = inject(NgZone);

  constructor() {
    this.ngZone.runOutsideAngular(() => {
      effect(() => {
        if (this.store.documentChanged()) {
          this.ngZone.run(() => {
            this.editorDataChanged.emit(this.store.documentChanged());
          });
        }
      });
    });

    effect(() => {
      if (this.editorData()) {
        this.quillCreatorService.loadData(this.editorData());
      }
    });
  }

  ngOnInit(): void {
    this.richDocumentService.initializeDocumentSettings();
  }

  ngAfterViewInit(): void {
    try {
      const toolbar = this.toolbarRef();
      const editor = this.editorRef();

      if (!toolbar || !editor) {
        console.error('Toolbar or editor reference not found.');
        return;
      }

      this.quillCreatorService.init(editor.nativeElement, toolbar, this.editorData());
    } catch (error: unknown) {
      console.error('Failed to initialize nw-rich-document component:', error);
    }
  }

  ngOnDestroy(): void {
    this.ngZone.runOutsideAngular(() => this.pluginManagerService.destroyPlugins());
    this.richDocumentService.destroyDocumentSettings();
  }

  onQuillWrapperClick(event: MouseEvent): void {
    const quill = this.store.quill();
    if (!quill) return;

    const editorElement = this.editorRef()?.nativeElement;
    if (!editorElement) return;

    const isClickInsideEditor = editorElement.contains(event.target as Node);
    if (isClickInsideEditor) return;

    const currentSelection = quill.getSelection();
    if (currentSelection && currentSelection.length === 0) return;

    const contents = quill.getContents();
    const lines = quill.getLines();

    if (lines.length === 1 && contents.ops.length === 1) {
      quill.setSelection(0, 0);
      return;
    }

    const lastPosition = quill.getLength();
    const lastLine = lines[lines.length - 1];
    const lastLineLength = lastLine.length();

    if (lastLineLength === 1 && lastLine.domNode.textContent === '') {
      quill.setSelection(lastPosition - 1, 0);
    } else {
      quill.insertText(quill.getIndex(lastLine) + lastLine.length(), '\n', 'block', 'silent');
      quill.formatLine(quill.getIndex(lastLine) + lastLine.length(), 0, {
        blockId: createQuillBlockId(quill),
      });
      quill.setSelection(lastPosition + 1, 0);
    }
  }
}
