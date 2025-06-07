import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, ElementRef, HostListener, input, linkedSignal, output, viewChild } from '@angular/core';

import { SvgIconComponent } from '../icon/svg-icon.component';

@Component({
  selector: 'rde-menu-card',
  templateUrl: './menu-card.component.html',
  styleUrls: ['./menu-card.component.scss'],
  imports: [NgTemplateOutlet, SvgIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuCardComponent {
  menuContainer = viewChild<ElementRef>('menuContainer');
  public title = input.required<string>();
  public iconType = input<'icon' | 'emoji'>('icon');
  public inputPlaceholder = input.required<string>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public items = input.required<any[]>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public readonly selectedItem = output<any>();

  public flattenedItems = computed(() =>
    this.items().reduce((acc, curr) => {
      return [...acc, ...curr.items];
    }, []),
  );

  public highlightedItemIndex = linkedSignal({
    source: this.flattenedItems,
    computation: () => 0,
  });
  public highlightedItem = computed(() => this.flattenedItems()[this.highlightedItemIndex()]);

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const key = event.key;
    if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Enter') {
      event.preventDefault();

      if (key === 'ArrowDown') {
        this.highlightedItemIndex.set(this.highlightedItemIndex() === this.flattenedItems().length - 1 ? 0 : this.highlightedItemIndex() + 1);
        this.scrollToHighlighted();
      }

      if (key === 'ArrowUp') {
        this.highlightedItemIndex.set(this.highlightedItemIndex() === 0 ? this.flattenedItems().length - 1 : this.highlightedItemIndex() - 1);
        this.scrollToHighlighted();
      }

      if (key === 'Enter') {
        if (this.highlightedItem()) {
          this.selectItem(this.highlightedItem());
        }
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectItem(item: any) {
    this.selectedItem.emit(this.iconType() === 'emoji' ? item.iconLabel : item.blockType);
  }

  private scrollToHighlighted() {
    const container = this.menuContainer()?.nativeElement;
    if (!container) return;

    const highlightedIndex = this.highlightedItemIndex();
    const items = container.querySelectorAll('.list-item');
    if (!items.length || highlightedIndex >= items.length) return;

    const highlightedElement = items[highlightedIndex];
    if (!highlightedElement) return;

    const containerRect = container.getBoundingClientRect();
    const elementRect = highlightedElement.getBoundingClientRect();

    const isAbove = elementRect.top < containerRect.top;
    const isBelow = elementRect.bottom > containerRect.bottom;

    if (isAbove || isBelow) {
      const scrollOffset = isAbove ? elementRect.top - containerRect.top - 8 : elementRect.bottom - containerRect.bottom + 8;

      container.scrollBy({
        top: scrollOffset,
        behavior: 'smooth',
      });
    }
  }
}
