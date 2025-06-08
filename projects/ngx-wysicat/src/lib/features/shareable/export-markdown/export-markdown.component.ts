import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import Delta from 'quill-delta';

import { QuillStore } from '../../../store';
import { SvgIconComponent } from '../../../ui/icon/svg-icon.component';

interface QuillAttributes {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  code?: boolean;
  link?: string;
  header?: number;
  blockquote?: boolean;
  'code-block'?: boolean;
  list?: 'bullet' | 'ordered' | 'checked' | 'unchecked';
  indent?: number;
  blockId?: string;
  background?: string;
  color?: string;

  [key: string]: any;
}

interface QuillInsert {
  image?: string;
  video?: string;
  divider?: boolean;

  [key: string]: any;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'nw-export-markdown',
  template: `
    <button class="markdown-export-button" (click)="downloadMarkdown()">
      <nw-svg-icon name="download" [primary]="false" [color]="'#000'" />
      <span class="button-label">Export Markdown</span>
    </button>
  `,
  imports: [SvgIconComponent],
  styles: [
    `
      .markdown-export-button {
        display: flex;
        gap: 8px;
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

      .markdown-export-button:hover {
        background: var(--nw-color-primary-50);
        box-shadow: var(--shadow-sm);
      }

      .markdown-export-button:active {
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
export class ExportMarkdownComponent {
  @Output() readonly markdownConverted = new EventEmitter<string>();

  private readonly quillStore = inject(QuillStore).quill;

  downloadMarkdown(): void {
    const quill = this.quillStore();

    if (!quill) {
      console.warn('Quill instance not provided');
      return;
    }

    const delta = quill.getContents();
    const markdown = this.deltaToMarkdown(delta);

    this.markdownConverted.emit(markdown);
    this.downloadFile(markdown, 'document.md', 'text/markdown');
  }

  private downloadFile(content: string, filename: string, contentType: string): void {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  }

  private deltaToMarkdown(delta: Delta): string {
    let markdown = '';
    let currentLine = '';
    const listCounters: number[] = [];
    let inCodeBlock = false;

    for (let i = 0; i < delta.ops.length; i++) {
      const op = delta.ops[i];

      if (typeof op.insert === 'string') {
        const text = op.insert;
        const attributes = (op.attributes || {}) as QuillAttributes;

        if (text === '\n') {
          if (attributes['code-block']) {
            if (!inCodeBlock) {
              markdown += '```\n';
              inCodeBlock = true;
            }
            markdown += currentLine + '\n';
          } else {
            if (inCodeBlock) {
              markdown += '```\n';
              inCodeBlock = false;
            }

            let processedLine = currentLine;

            if (attributes.header) {
              processedLine = '#'.repeat(attributes.header) + ' ' + currentLine;
            } else if (attributes.blockquote) {
              processedLine = '> ' + currentLine;
            } else if (attributes.list) {
              const indent = attributes.indent || 0;
              const indentString = '  '.repeat(indent);

              if (attributes.list === 'checked') {
                processedLine = indentString + '- [x] ' + currentLine;
              } else if (attributes.list === 'unchecked') {
                processedLine = indentString + '- [ ] ' + currentLine;
              } else if (attributes.list === 'bullet') {
                processedLine = indentString + '- ' + currentLine;
              } else if (attributes.list === 'ordered') {
                while (listCounters.length <= indent) {
                  listCounters.push(1);
                }
                const counter = listCounters[indent] || 1;
                processedLine = indentString + counter + '. ' + currentLine;
                listCounters[indent] = counter + 1;
              }
            }

            markdown += processedLine + '\n';
          }
          currentLine = '';
        } else {
          currentLine += this.formatInlineText(text, attributes);
        }
      } else if (op.insert && typeof op.insert === 'object') {
        const insertObj = op.insert as QuillInsert;

        if (insertObj.divider) {
          if (inCodeBlock) {
            markdown += '```\n';
            inCodeBlock = false;
          }
          markdown += '---\n';
        } else if (insertObj.image) {
          currentLine += `![](${insertObj.image})`;
        } else if (insertObj.video) {
          currentLine += `[Video](${insertObj.video})`;
        }
      }
    }

    if (inCodeBlock) {
      markdown += '```\n';
    }

    if (currentLine.trim()) {
      markdown += currentLine;
    }

    return this.cleanupMarkdown(markdown);
  }

  private formatInlineText(text: string, attributes: QuillAttributes): string {
    let formatted = text;

    if (attributes.code) {
      return `\`${text}\``;
    }

    if (attributes.link) {
      formatted = `[${text}](${attributes.link})`;
    }

    if (attributes.bold) {
      formatted = `**${formatted}**`;
    }

    if (attributes.italic) {
      formatted = `*${formatted}*`;
    }

    if (attributes.strike) {
      formatted = `~~${formatted}~~`;
    }

    if (attributes.underline && !attributes.bold && !attributes.italic) {
      formatted = `<u>${formatted}</u>`;
    }

    return formatted;
  }

  private cleanupMarkdown(markdown: string): string {
    markdown = markdown.trim();

    // Remove excessive newlines (3 or more)
    markdown = markdown.replace(/\n{3,}/g, '\n\n');

    // Add spacing around headers
    markdown = markdown.replace(/([^\n])\n(#{1,6})/g, '$1\n\n$2');
    markdown = markdown.replace(/(#{1,6}.*)\n([^\n#>-])/g, '$1\n\n$2');

    // Add spacing around blockquotes
    markdown = markdown.replace(/([^\n])\n(>)/g, '$1\n\n$2');
    markdown = markdown.replace(/(>.*)\n([^\n>-])/g, '$1\n\n$2');

    // Add spacing around horizontal rules
    markdown = markdown.replace(/([^\n])\n(---)/g, '$1\n\n$2');
    markdown = markdown.replace(/(---)\n([^\n])/g, '$1\n\n$2');

    // Add spacing around code blocks
    markdown = markdown.replace(/([^\n])\n(```)/g, '$1\n\n$2');
    markdown = markdown.replace(/(```)\n([^\n`])/g, '$1\n\n$2');

    return markdown;
  }
}
