import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { QuillStore } from '../../../store';
import { SvgIconComponent } from '../../../ui/icon/svg-icon.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'nw-export-html',
  template: `
    <button class="html-export-button" (click)="exportHtml()">
      <nw-svg-icon name="download" [primary]="false" [color]="'#000'" />
      <span class="button-label">Export HTML</span>
    </button>
  `,
  imports: [SvgIconComponent],
  styles: [
    `
      .html-export-button {
        gap: 8px;
        display: flex;
        align-items: center;
        padding: 8px 12px;
        background: var(--nw-color-white);
        color: var(--nw-color-primary-800);
        border: var(--border-300);
        border-radius: 4px;
        font-size: 13px;
        font-family: var(--nw-font-family);
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: var(--shadow-xs);
        width: auto;
      }

      .html-export-button:hover {
        background: var(--nw-color-primary-50);
        box-shadow: var(--shadow-sm);
      }

      .html-export-button:active {
        transform: translateY(1px);
        box-shadow: var(--shadow-2xs);
      }

      .button-label {
        font-weight: 400;
        font-family: var(--nw-font-family);
      }
    `,
  ],
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
