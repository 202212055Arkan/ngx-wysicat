import {MenuCardCategoryItem} from '../../ui/menu-card';

export const BLOCKS_TYPES: MenuCardCategoryItem[] = [
  {
    name: 'Text',
    items: [
      {
        name: 'Paragraph',
        iconLabel: 'paragraph',
        blockType: 'text',
      },
      {
        name: 'Heading 1',
        iconLabel: 'heading-1',
        blockType: 'h1',
      },
      {
        name: 'Heading 2',
        iconLabel: 'heading-2',
        blockType: 'h2',
      },
      {
        name: 'Heading 3',
        iconLabel: 'heading-3',
        blockType: 'h3',
      },
      {
        name: 'Heading 4',
        iconLabel: 'heading-4',
        blockType: 'h4',
      },
      {
        name: 'Code Block',
        iconLabel: 'code-block',
        blockType: 'code-block',
      },
      {
        name: 'Blockquote',
        iconLabel: 'blockquote',
        blockType: 'blockquote',
      },
    ],
  },
  {
    name: 'Lists & Structure',
    items: [
      {
        name: 'Bulleted List',
        iconLabel: 'unordered-list',
        blockType: 'bullet',
      },
      {
        name: 'Ordered List',
        iconLabel: 'ordered-list',
        blockType: 'ordered',
      },
      {
        name: 'Check List',
        iconLabel: 'check-list',
        blockType: 'check-list',
      },
    ],
  },
  {
    name: 'Advanced',
    items: [
      {
        name: 'Divider',
        iconLabel: 'divider-y',
        blockType: 'divider',
      },
    ],
  },
];
