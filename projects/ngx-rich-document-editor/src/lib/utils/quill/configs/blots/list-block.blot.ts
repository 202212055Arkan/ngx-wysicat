import Quill from "quill";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ListItem = Quill.import('formats/list') as any;
ListItem.className = 'ql-block-list';
