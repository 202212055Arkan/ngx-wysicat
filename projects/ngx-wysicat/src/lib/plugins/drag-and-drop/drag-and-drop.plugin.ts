import { ApplicationRef, ComponentRef, createComponent, EnvironmentInjector, inject, Injectable } from '@angular/core';

import { DragAndDropService } from './drag-and-drop.service';
import { DraggedElementComponent } from './dragged-element.component';

@Injectable({
  providedIn: 'root',
})
export class DragAndDropPlugin {
  id = 'drag-and-drop-plugin';
  name = 'Drag And Drop Plugin';

  private readonly dragAndDropService = inject(DragAndDropService);
  private readonly appRef = inject(ApplicationRef);
  private readonly environmentInjector = inject(EnvironmentInjector);
  private componentRef: ComponentRef<DraggedElementComponent> | null = null;

  initialize(): void {
    this.dragAndDropService.register();
    this.loadDraggedElementComponent();
  }

  destroy(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }

  private loadDraggedElementComponent(): void {
    const container = document.getElementById('nw-drag-and-drop-wrapper');
    if (!container) {
      return;
    }

    this.componentRef = createComponent(DraggedElementComponent, {
      environmentInjector: this.environmentInjector,
      hostElement: container,
    });

    this.appRef.attachView(this.componentRef.hostView);
  }
}
