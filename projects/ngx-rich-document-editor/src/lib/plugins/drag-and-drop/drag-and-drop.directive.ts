import {Directive, ElementRef, inject, input, OnInit} from '@angular/core';

import {DRAG_HANDLE_CLASS_NAME} from "./drag-and-drop.config";

@Directive({
  selector: '[rdeDraggable]',
})
export class DragAndDropDirective implements OnInit {
  public readonly enabled = input(true, {alias: 'rdeDraggable'});
  private readonly elementRef = inject(ElementRef);

  ngOnInit(): void {
    if (!this.enabled()) {
      return;
    }

    this.elementRef.nativeElement.setAttribute('draggable', 'true');
    this.elementRef.nativeElement.classList.add(DRAG_HANDLE_CLASS_NAME);
  }
}
