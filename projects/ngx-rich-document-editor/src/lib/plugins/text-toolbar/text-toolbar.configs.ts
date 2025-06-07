import {FormatState} from './text-toolbar.models';

export const HEADING_LEVELS = [
  {
    name: 'Paragraph',
    value: 'Normal',
    label: 'paragraph',
  },
  {
    name: 'Heading 1',
    value: '1',
    label: 'heading-1',
  },
  {
    name: 'Heading 2',
    value: '2',
    label: 'heading-2',
  },
  {
    name: 'Heading 3',
    value: '3',
    label: 'heading-3',
  },
  {
    name: 'Heading 4',
    value: '4',
    label: 'heading-4',
  },
];

export type ColorFormats = typeof COLOR_FORMAT | typeof BACKGROUND_FORMAT;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Formats = any;
export const HEADER_FORMAT = 'header' as const;
export const HEADER_FORMAT_PARAGRAPH_VALUE = 'Normal' as const;
export const LINK_FORMAT = 'link' as const;
export const DIVIDER_FORMAT = 'divider' as const;
export const LIST_ORDERED_FORMAT = 'ordered' as const;
export const LIST_BULLET_FORMAT = 'bullet' as const;
export const LIST_CHECK_FORMATS = 'checklist' as const;
export const LIST_FORMAT = 'list' as const;
export type ListFormats =
  typeof LIST_ORDERED_FORMAT
  | typeof LIST_BULLET_FORMAT
  | typeof LIST_CHECK_FORMATS
  | 'checked';
export const BLOCK_FORMAT = 'block' as const;
export const COLOR_FORMAT = 'color' as const;
export const BACKGROUND_FORMAT = 'background' as const;

export const INIT_STATE: FormatState = {
  bold: false,
  italic: false,
  underline: false,
  strike: false,
  code: false,
  codeBlock: false,
  blockquote: false,
  header: null,
  list: null,
  rawFormats: {},
  color: null,
  background: null,
  link: null,
};
