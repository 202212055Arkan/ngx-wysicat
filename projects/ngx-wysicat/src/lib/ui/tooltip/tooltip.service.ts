import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TooltipService {
  private tooltipElement: HTMLElement | null = null;
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  showTooltip(content: HTMLElement, top: number, left: number): void {
    this.hideTooltip();
    this.tooltipElement = content;

    this.renderer.setStyle(content, 'position', 'fixed');
    this.renderer.setStyle(content, 'top', `${top}px`);
    this.renderer.setStyle(content, 'left', `${left}px`);
    this.renderer.appendChild(document.body, content);
  }

  hideTooltip(): void {
    if (this.tooltipElement) {
      this.renderer.removeChild(document.body, this.tooltipElement);
      this.tooltipElement = null;
    }
  }
}
