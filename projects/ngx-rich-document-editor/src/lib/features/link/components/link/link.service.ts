import { Injectable } from '@angular/core';
import Quill from 'quill';

@Injectable({
  providedIn: 'root',
})
export class LinkService {
  init(quill: Quill) {
    document.addEventListener('quill-link-action', (e: any) => {
      const blot = Quill.find(e.detail.node);
      if (blot) {
        //@ts-ignore
        const index = quill.getIndex(blot);
        //@ts-ignore
        const length = blot.length();

        // Delete the text at the link's position
        //@ts-ignore
        quill.deleteText(index, length);
      }
    });
  }
}
