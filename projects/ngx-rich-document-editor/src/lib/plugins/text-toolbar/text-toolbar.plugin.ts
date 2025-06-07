import { ApplicationRef, ComponentRef, createComponent, EnvironmentInjector, inject, Injectable } from '@angular/core';

import { TextToolbarComponent } from './text-toolbar.component';

@Injectable({
  providedIn: 'root',
})
export class TextToolbarPlugin {
  id = 'text-toolbar-plugin';
  name = 'Text Toolbar Plugin';

  private readonly appRef = inject(ApplicationRef);
  private readonly environmentInjector = inject(EnvironmentInjector);
  private componentRef: ComponentRef<TextToolbarComponent> | null = null;

  initialize(): void {
    this.loadTextToolbarComponent();
  }

  destroy(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }

  private loadTextToolbarComponent(): void {
    const container = document.getElementById('rde-text-toolbar-wrapper');
    if (!container) {
      return;
    }

    this.componentRef = createComponent(TextToolbarComponent, {
      environmentInjector: this.environmentInjector,
      hostElement: container,
    });

    this.appRef.attachView(this.componentRef.hostView);
  }
}
