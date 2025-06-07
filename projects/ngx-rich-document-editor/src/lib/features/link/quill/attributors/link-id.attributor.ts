import { Attributor, Scope } from 'parchment';

export const LinkIdAttributor = new Attributor('linkId', 'data-link-id', {
  scope: Scope.INLINE_ATTRIBUTE,
});
