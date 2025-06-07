import {ChangeDetectionStrategy, Component} from "@angular/core";

import {DRAGGED_IMAGE_BLOCK_ID} from "./drag-and-drop.config";

@Component({
  selector: 'rde-dragged-element',
  template: `
    <div style="width: 1px; height: 1px" [id]="DRAGGED_ELEMENT_ID"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      position: absolute;
    }
  `,
})
export class DraggedElementComponent {
  protected readonly DRAGGED_ELEMENT_ID = DRAGGED_IMAGE_BLOCK_ID;
}
