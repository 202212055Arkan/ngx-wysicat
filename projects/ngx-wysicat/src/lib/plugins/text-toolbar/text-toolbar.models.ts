/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FormatState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strike: boolean;
  code: boolean;
  codeBlock: boolean;
  blockquote: boolean;
  header: any | null;
  color: string | null;
  background: string | null;
  list: 'ordered' | 'bullet' | 'checked' | null;
  rawFormats: any;
  link: null | string;
}
