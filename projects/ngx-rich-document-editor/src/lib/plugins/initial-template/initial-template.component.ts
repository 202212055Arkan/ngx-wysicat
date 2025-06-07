import {ChangeDetectionStrategy, Component, output} from '@angular/core';

import {SvgIconComponent} from '../../ui/icon/svg-icon.component';

@Component({
  selector: 'rde-initial-template',
  templateUrl: './initial-template.component.html',
  styleUrls: ['./initial-template.component.scss'],
  imports: [SvgIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InitialTemplateComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hoveredItem: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly templateSelected = output<any>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectTemplate(item: any): void {
    this.templateSelected.emit(item);
  }

  template = [
    {
      icon: 'paragraph',
      title: 'Normal text',
      description: 'Just start writing with simple text.',
    },
    {
      icon: 'heading-1',
      title: 'Heading 1',
      description: 'Big section heading.',
    },
    {
      icon: 'heading-2',
      title: 'Heading 2',
      description: 'Medium section heading.',
    },
    {
      icon: 'heading-3',
      title: 'Heading 3',
      description: 'Small section heading.',
    },
    {
      icon: 'heading-4',
      title: 'Heading 4',
      description: 'Tiny section heading.',
    },
    {
      icon: 'unordered-list',
      title: 'Bulleted list',
      description: 'Create a simple bulleted list.',
    },
    {
      icon: 'ordered-list',
      title: 'Numbered list',
      description: 'Create a simple numbered list.',
    },
    {
      icon: 'check-list',
      title: 'Checked list',
      description: 'Create a simple checked list.',
    },
    {
      icon: 'blockquote',
      title: 'Quote',
      description: 'Capture a quote.',
    },
    {
      icon: 'divider-y',
      title: 'Divider',
      description: 'Visually divide blocks.',
    },
    {
      icon: 'code-block',
      title: 'Code',
      description: 'Capture a code snippet.',
    },
    {
      icon: 'emoji',
      title: 'Emoji',
      description: 'Search for emoji to place in text.',
    },
  ];
}
