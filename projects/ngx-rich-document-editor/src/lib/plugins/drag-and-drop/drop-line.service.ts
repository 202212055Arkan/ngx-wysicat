/* eslint-disable no-underscore-dangle */
import {Injectable, signal} from "@angular/core";
import Quill from "quill";

import {DROP_LINE_CLASS_NAME, DROP_LINE_SELECTOR} from "./drag-and-drop.config";

@Injectable({
  providedIn: 'root',
})
export class DropLineService {

  dropLineElement = signal<HTMLDivElement | null>(null);

  init(quill: Quill) {
    quill.addContainer(DROP_LINE_CLASS_NAME);
    this.dropLineElement.set(this._createDropLineElement());
  }

  hideDropLine() {
    const dropLine = this.dropLineElement();
    if (dropLine !== null) {
      this._hideDropLine(dropLine);
    }
  }

  showDropLine(draggedBlockElement: Element, root: HTMLDivElement, dragEvent: DragEvent) {
    const dropLine = this.dropLineElement();
    if (dropLine !== null) {
      this._showDropLine(draggedBlockElement, root, dragEvent, dropLine);
    }
  }

  _hideDropLine(dropLine: HTMLDivElement): void {
    dropLine.style.display = 'none';
  }

  _showDropLine(blockElement: Element, editorElement: Element, dragEvent: DragEvent, dropLine: HTMLDivElement): void {
    const editorRect = editorElement.getBoundingClientRect();
    const mouseY = dragEvent.clientY - editorRect.top;

    const positions: { y: number; gap: boolean }[] = [];

    const addPositions = (el: Element) => {
      const rect = el.getBoundingClientRect();
      const top = rect.top - editorRect.top;
      const bottom = top + rect.height;
      positions.push({y: top, gap: true});
      positions.push({y: bottom, gap: true});
    };

    const blocks = Array.from(editorElement.children);

    blocks.forEach((block) => {
      const tag = block.tagName.toUpperCase();
      if (tag === 'UL' || tag === 'OL') {
        const listItems = Array.from(block.children).filter((child) => child.tagName.toUpperCase() === 'LI');
        listItems.forEach((li) => {
          addPositions(li);
        });
      } else {
        addPositions(block);
      }
    });

    if (positions.length === 0) {
      dropLine.style.top = '0px';
      dropLine.style.display = 'block';
      return;
    }

    const closest = positions.reduce((prev, curr) => {
      return Math.abs(curr.y - mouseY) < Math.abs(prev.y - mouseY) ? curr : prev;
    });

    dropLine.style.top = `${closest.y}px`;
    dropLine.style.display = 'block';
  }

  _createDropLineElement(): HTMLDivElement {
    const dropLine = document.createElement('div');
    dropLine.classList.add(DROP_LINE_CLASS_NAME);

    // TODO: It contains ql-editor padding.
    dropLine.style.cssText = `
      height: 3px;
      background-color: rgba(123, 104, 238, 1);
      position: absolute;
      display: none;
      pointer-events: none;
      z-index: 1000;
      left: 67px;
      width: calc(100% - 20px - 67px);
    `;
    // width: calc(100% - 20px));

    const dropLineElement = document.querySelector(DROP_LINE_SELECTOR);

    if (dropLineElement) {
      dropLineElement.appendChild(dropLine);
    }

    return dropLine;
  }
}
