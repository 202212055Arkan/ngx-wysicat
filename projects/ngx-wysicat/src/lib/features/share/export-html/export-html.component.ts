import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { QuillStore } from '../../../store';
import { SvgIconComponent } from '../../../ui/icon/svg-icon.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'nw-export-html',
  template: `
    <button class="nw-button nw-button__primary" (click)="exportHtml()">
      <nw-svg-icon name="download" [primary]="true" />
      <span class="nw-button__label">Export HTML file</span>
    </button>
  `,
  imports: [SvgIconComponent],
})
export class ExportHtmlComponent {
  private readonly quillStore = inject(QuillStore).quill;

  exportHtml(): void {
    const quill = this.quillStore();

    if (!quill) {
      return;
    }

    const html = quill.root.getHTML();

    if (!html) {
      return;
    }

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    a.click();
    URL.revokeObjectURL(url);
  }
}
