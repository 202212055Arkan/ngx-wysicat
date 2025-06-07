// @ts-nocheck
import Quill from "quill";
import Emitter from "quill/core/emitter";
import BubbleTheme from "quill/themes/bubble";
import BaseTooltip from "quill/ui/tooltip";

export class CustomTooltip extends BaseTooltip {
  static TEMPLATE = '';

  constructor(quill: Quill, bounds?: HTMLElement) {
    super(quill, bounds);

    this.isPositionFixed = false;
    this.normalPosition = {top: 0, left: 0};
    this.editorContainer = this.quill.root.parentElement.parentElement?.parentElement;

    // Add scroll handler with throttling
    let ticking = false;
    this.editorContainer.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.onScroll();
          ticking = false;
        });

        ticking = true;
      }
    });

    this.quill.on(
      Emitter.events.EDITOR_CHANGE,
      (type, range, oldRange, source) => {
        if (type !== Emitter.events.SELECTION_CHANGE) return;
        if (
          range != null &&
          range.length > 0 &&
          source === Emitter.sources.USER
        ) {
          this.show();
          // Lock our width so we will expand beyond our offsetParent boundaries
          this.root.style.left = '0px';
          this.root.style.width = '';
          this.root.style.width = `${this.root.offsetWidth}px`;
          const lines = this.quill.getLines(range.index, range.length);
          if (lines.length === 1) {
            const bounds = this.quill.getBounds(range);
            if (bounds != null) {
              this.position(bounds);
              this.saveNormalPosition();
            }
          } else {
            this.position(this.quill.getBounds(range.index, range.length));
            this.saveNormalPosition();

            const lastLine = lines[lines.length - 1];
            const index = this.quill.getIndex(lastLine);
            const length = Math.min(lastLine.length() - 1, range.index + range.length - index);
            const indexBounds = this.quill.getBounds(new Range(index, length));
            if (indexBounds != null) {
              this.position(indexBounds);
              this.saveNormalPosition();
            }
          }
        } else if (document.activeElement !== this.textbox && this.quill.hasFocus()) {
          this.hide();
        }
      },
    );
  }

  saveNormalPosition() {
    // Store normal position values for returning from sticky state
    this.normalPosition = {
      top: parseInt(this.root.style.top, 10),
      left: parseInt(this.root.style.left, 10),
    };

    // Reset sticky state when position changes
    if (this.isSticky) {
      this.isSticky = false;
      this.root.style.position = 'absolute';
    }
  }

  onScroll() {
    if (this.root.classList.contains('ql-hidden')) {
      return;
    }

    const containerRect = this.editorContainer.getBoundingClientRect();
    const tooltipRect = this.root.getBoundingClientRect();

    // Check if tooltip should be sticky at top
    if (tooltipRect.top < containerRect.top + 10) {
      if (!this.isSticky) {
        // Calculate absolute page position for fixed positioning
        const pageLeft = tooltipRect.left;

        // Switch to fixed positioning
        this.isSticky = true;
        this.root.style.position = 'fixed';

        // Position fixed relative to viewport
        this.root.style.top = `${containerRect.top + 0}px`;
        this.root.style.left = `${pageLeft}px`;
      }
    } else if (this.isSticky) {
      // Return to normal positioning if we've scrolled back
      const expectedTop = this.normalPosition.top - this.editorContainer.scrollTop + this.editorContainer.getBoundingClientRect().top;

      if (expectedTop >= containerRect.top) {
        this.isSticky = false;
        this.root.style.position = 'absolute';
        this.root.style.top = `${this.normalPosition.top}px`;
        this.root.style.left = `${this.normalPosition.left}px`;
      }
    }
  }

  listen() {
    super.listen();
    this.root.querySelector('.ql-close').addEventListener('click', () => this.root.classList.remove('ql-editing'));

    this.quill.on(Emitter.events.SCROLL_OPTIMIZE, () => {
      // Let selection be restored by text-toolbar handlers before repositioning
      setTimeout(() => {
        if (this.root.classList.contains('ql-hidden')) {
          return;
        }

        const range = this.quill.getSelection();

        if (range != null) {
          const bounds = this.quill.getBounds(range);
          if (bounds != null) {
            this.position(bounds);
            this.saveNormalPosition();
          }
        }
      }, 1);
    });
  }

  cancel() {
    this.show();
  }

  position(reference: Bounds) {
    // Reset sticky state when explicitly positioning
    if (this.isSticky) {
      this.isSticky = false;
      this.root.style.position = 'absolute';
    }

    const left = reference.left + reference.width / 2 - this.root.offsetWidth / 2;
    const top = reference.top + this.quill.root.scrollTop - 45 - 10;
    this.root.style.left = `${left}px`;
    this.root.style.top = `${top}px`;
    this.root.classList.remove('ql-flip');
    const containerBounds = this.boundsContainer.getBoundingClientRect();
    const rootBounds = this.root.getBoundingClientRect();
    let shift = 0;

    if (rootBounds.right > containerBounds.right) {
      shift = containerBounds.right - rootBounds.right;
      this.root.style.left = `${left + shift}px`;
    }

    if (rootBounds.left < containerBounds.left) {
      shift = containerBounds.left - rootBounds.left;
      this.root.style.left = `${left + shift}px`;
    }

    if (rootBounds.bottom > containerBounds.bottom) {
      const height = rootBounds.bottom - rootBounds.top;
      const verticalShift = reference.bottom - reference.top + height;
      this.root.style.top = `${top - verticalShift}px`;
      this.root.classList.add('ql-flip');
    }

    // Check scroll position after positioning
    setTimeout(() => this.onScroll(), 0);
    return shift;
  }
}

export class CustomBubbleTheme extends BubbleTheme {
  constructor(quill, options) {
    super(quill, options);
  }

  override extendToolbar(toolbar: any) {
    this.tooltip = new CustomTooltip(this.quill, this.options.bounds);
    if (toolbar.container != null) {
      this.tooltip.root.appendChild<HTMLElement>(toolbar.container);
    }
  }
}
