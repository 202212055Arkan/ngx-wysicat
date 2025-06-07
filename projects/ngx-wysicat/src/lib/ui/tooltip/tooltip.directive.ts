import { Directive, ElementRef, HostListener, inject, input, Renderer2 } from '@angular/core';

import { TooltipService } from './tooltip.service';

@Directive({
  selector: '[nwTooltip]',
})
export class TooltipDirective {
  public nwTooltip = input.required<string>();
  public tooltipLine2 = input<string>('');
  public boldFirstWord = input<boolean>(false);
  public tooltipDelay = input<number>(300);

  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly tooltipService = inject(TooltipService);

  private tooltipTimeout: ReturnType<typeof setTimeout> | null = null;

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.showTooltip();
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.hideTooltip();
  }

  private showTooltip(): void {
    if (this.tooltipTimeout) {
      clearTimeout(this.tooltipTimeout);
    }

    this.tooltipTimeout = setTimeout(() => {
      const tooltip = this.renderer.createElement('div');
      this.renderer.addClass(tooltip, 'nw-tooltip');

      if (!this.tooltipLine2() && !this.boldFirstWord()) {
        this.renderer.addClass(tooltip, 'single-line-no-bold');
      }

      const line1 = this.renderer.createElement('p');
      this.renderer.setStyle(line1, 'margin', '0');
      this.formatLine(line1, this.nwTooltip());
      this.renderer.appendChild(tooltip, line1);

      if (this.tooltipLine2()) {
        const line2 = this.renderer.createElement('p');
        this.renderer.setStyle(line2, 'margin', '0');
        this.formatLine(line2, this.tooltipLine2());
        this.renderer.appendChild(tooltip, line2);
      }

      const hostRect = this.el.nativeElement.getBoundingClientRect();
      document.body.appendChild(tooltip);
      const tooltipRect = tooltip.getBoundingClientRect();
      document.body.removeChild(tooltip);

      const top = hostRect.top - tooltipRect.height - 4;
      const left = hostRect.left + (hostRect.width - tooltipRect.width) / 2;

      this.tooltipService.showTooltip(tooltip, top, left);
    }, this.tooltipDelay());
  }

  private hideTooltip(): void {
    if (this.tooltipTimeout) {
      clearTimeout(this.tooltipTimeout);
      this.tooltipTimeout = null;
    }

    this.tooltipService.hideTooltip();
  }

  private formatLine(element: HTMLElement, text: string): void {
    if (this.boldFirstWord()) {
      const words = text.trim().split(' ');
      const boldSpan = this.renderer.createElement('span');
      this.renderer.addClass(boldSpan, 'bold-word');
      const boldText = this.renderer.createText(words[0]);
      this.renderer.appendChild(boldSpan, boldText);
      this.renderer.appendChild(element, boldSpan);

      if (words.length > 1) {
        const restText = this.renderer.createText(' ' + words.slice(1).join(' '));
        this.renderer.appendChild(element, restText);
      }
    } else {
      const textNode = this.renderer.createText(text);
      this.renderer.appendChild(element, textNode);
    }
  }
}
