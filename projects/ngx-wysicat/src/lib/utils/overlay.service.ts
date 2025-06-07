/* eslint-disable @typescript-eslint/no-explicit-any */

import {Overlay, OverlayRef} from "@angular/cdk/overlay";
import {ComponentPortal} from "@angular/cdk/portal";
import {ScrollDispatcher} from "@angular/cdk/scrolling";
import {ComponentRef, inject, Injectable, Type} from "@angular/core";
import {filter, Subject, take} from "rxjs";

@Injectable({
  providedIn: "root",
})
export class OverlayService {
  public readonly closed$ = new Subject<void>();
  private readonly overlay = inject(Overlay);
  private readonly scrollDispatcher = inject(ScrollDispatcher);
  private overlayRef!: OverlayRef;
  private scrollableElements: HTMLElement[] = [];
  private isClosing = false;
  private currentComponent: any = null;

  open<T>(component: Type<T>, origin: HTMLElement, options: any = {}): T {
    try {
      if (this.currentComponent && this.overlayRef && !this.isClosing) {
        this.updateComponentPosition(null, origin, options);
        return this.currentComponent;
      }

      if (this.overlayRef && !options.preventAutoClose) {
        this.close();
      }

      const scrollables = [];
      this.scrollableElements = [];

      this.scrollDispatcher.scrollContainers.forEach((subscription, scrollable) => {
        scrollables.push(scrollable);
        if (scrollable.getElementRef().nativeElement) {
          this.scrollableElements.push(scrollable.getElementRef().nativeElement);
        }
      });

      this.overlayRef = this.overlay.create({
        hasBackdrop: options.preventAutoClose ? false : true,
        backdropClass: 'transparent-backdrop',
        panelClass: options.panelClass || '',
        positionStrategy: this.overlay
          .position()
          .flexibleConnectedTo(origin)
          .withPositions([
            {
              originX: "start",
              originY: "bottom",
              overlayX: "start",
              overlayY: "top",
              offsetY: options && options.offsetY !== undefined ? options.offsetY : 0,
              offsetX: options && options.offsetX !== undefined ? options.offsetX : 0,
            },
          ]),
        scrollStrategy: this.overlay.scrollStrategies.reposition(),
      });

      this.disableScrolling();

      if (!options.preventAutoClose) {
        this.overlayRef.outsidePointerEvents().subscribe(() => {
          if (!this.isClosing) {
            this.close();
          }
        });

        this.overlayRef.backdropClick().subscribe(() => {
          if (!this.isClosing) {
            this.close();
          }
        });

        this.overlayRef
          .keydownEvents()
          .pipe(filter((event) => event.key === 'Escape'), take(1))
          .subscribe(() => {
            if (!this.isClosing) {
              this.close();
            }
          });
      }

      if (this.overlayRef.hasAttached()) {
        this.overlayRef.detach();
      }

      const componentPortal = new ComponentPortal(component);
      const componentRef = this.overlayRef.attach(componentPortal);

      if (componentRef && componentRef.instance) {
        this.currentComponent = componentRef.instance;

        setTimeout(() => {
          this.updateComponentPosition(componentRef, origin, options);
        }, 0);

        return componentRef.instance;
      } else {
        console.error('Failed to get component instance');
      }

      return null as any;
    } catch (err) {
      console.error('Error in open:', err);
      return null as any;
    }
  }

  close(): void {
    if (this.overlayRef && !this.isClosing) {
      this.isClosing = true;

      try {
        this.enableScrolling();
        this.closed$.next();
        this.currentComponent = null;

        if (this.overlayRef.hasAttached()) {
          this.overlayRef.detach();
        }

        this.overlayRef.dispose();
      } catch (err) {
        console.error('Error closing overlay:', err);
      } finally {
        this.overlayRef = null!;
        this.isClosing = false;
      }
    }
  }

  private disableScrolling(): void {
    this.scrollableElements.forEach((element) => {
      if (element.classList.contains('ql-editor') ||
        element.classList.contains('ql-container')) {
        return;
      }

      const previousOverflow = element.style.overflow;
      element.dataset["previousOverflow"] = previousOverflow;
      element.style.setProperty('overflow', 'hidden');
    });
  }

  private enableScrolling(): void {
    this.scrollableElements.forEach((element) => {
      if (element.classList.contains('ql-editor') ||
        element.classList.contains('ql-container')) {
        return;
      }

      const previousOverflow = element.dataset["previousOverflow"];
      if (previousOverflow) {
        element.style.overflow = previousOverflow;
        delete element.dataset["previousOverflow"];
      } else {
        element.style.removeProperty('overflow');
      }
    });
  }

  private updateComponentPosition(componentRef: ComponentRef<any> | null, origin: HTMLElement,
                                  options: {
                                    customPosition: Record<keyof CSSStyleDeclaration, string | number>
                                  }): void {
    try {
      if (!this.overlayRef) {
        return;
      }

      this.overlayRef.updatePosition();

      const overlayPane = this.overlayRef.overlayElement;
      if (overlayPane) {
        overlayPane.classList.add('visible-overlay');

        if (options?.customPosition) {
          Object.entries(options.customPosition).forEach(([key, value]) => {
            overlayPane.style[key as unknown as number] = typeof value === 'number' ? `${value}px` : value;
          });
        }
      }
    } catch (err) {
      console.error('Error updating component position:', err);
    }
  }
}
