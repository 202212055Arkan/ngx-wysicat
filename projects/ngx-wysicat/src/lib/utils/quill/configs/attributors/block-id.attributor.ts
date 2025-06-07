import { Attributor, Scope } from 'parchment';

export const BlockIdAttributor = new Attributor('blockId', 'data-block-id', {
  scope: Scope.BLOCK,
});
