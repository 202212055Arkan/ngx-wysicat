import { WysicatPlugin } from '../plugin-system';

export interface BlockCreatePluginInterface extends WysicatPlugin {
  createNewBlockHTMLElement(blockElement: HTMLElement): void;

  removeBlock?(blockElement: HTMLElement): void;

  duplicateBlock?(blockElement: HTMLElement): void;

  clearFormat?(blockElement: HTMLElement): void;
}
