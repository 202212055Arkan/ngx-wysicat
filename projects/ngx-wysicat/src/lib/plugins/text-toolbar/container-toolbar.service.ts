import {Injectable, ViewContainerRef} from "@angular/core";

import {TextToolbarComponent} from "./text-toolbar.component";

@Injectable({
  providedIn: 'root',
})
export class ContainerToolbarService {

  init(toolbarElementRef: ViewContainerRef | undefined): void {
    if (!toolbarElementRef) {
      return;
    }
    toolbarElementRef.createComponent(TextToolbarComponent);
  }
}
