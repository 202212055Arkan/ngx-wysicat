import {ChangeDetectionStrategy,Component, effect, ElementRef, inject, input, Renderer2} from '@angular/core';

import {ICONS_REGISTRY} from './icons-registry';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'nw-svg-icon',
  template: '',
  styles: `
    :host {
      display: flex;
      align-items: center;
    }
  `,
})
export class SvgIconComponent {
  readonly name = input.required<string>();
  readonly size = input<string | number>(16);
  readonly color = input<string | null>(null);
  readonly primary = input<boolean>(false);
  readonly secondary = input<boolean>(false);

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);

  private readonly primaryColor = 'oklch(0.208 0.042 265.755)';
  private readonly secondaryColor = 'oklch(0.704 0.04 256.788)';

  constructor() {
    effect(() => {
      const iconName = this.name();
      if (!iconName) {
        return;
      }

      this.updateIcon(
        iconName,
        this.color(),
        this.size(),
        this.primary(),
        this.secondary(),
      );
    });
  }

  private updateIcon(
    name: string,
    color: string | null,
    size: string | number,
    isPrimary: boolean,
    isSecondary: boolean,
  ): void {
    const svgElement = this.loadIcon(name);
    const host = this.elementRef.nativeElement;

    this.clearChildren(host);

    if (!svgElement) {
      console.warn(`SVG icon "${name}" not found in ICONS_REGISTRY`);
      return;
    }

    this.setAttributes(svgElement, size, color, isPrimary, isSecondary);
    this.renderer.appendChild(host, svgElement);
  }

  private loadIcon(name: string): SVGElement | null {
    const iconData = ICONS_REGISTRY[name];
    if (!iconData) return null;

    const div = document.createElement('div');
    div.innerHTML = iconData.trim();
    return div.querySelector('svg');
  }

  private setAttributes(
    svg: SVGElement,
    size: string | number,
    color: string | null,
    isPrimary: boolean,
    isSecondary: boolean,
  ): void {
    const sizeValue = typeof size === 'number' ? `${size}px` : size;

    this.renderer.setAttribute(svg, 'width', sizeValue);
    this.renderer.setAttribute(svg, 'height', sizeValue);
    this.renderer.setAttribute(svg, 'preserveAspectRatio', 'xMidYMid meet');
    this.renderer.setAttribute(svg, 'focusable', 'false');

    const fillColor = color
      ? color
      : isPrimary
        ? this.primaryColor
        : isSecondary
          ? this.secondaryColor
          : 'currentColor';

    this.renderer.setAttribute(svg, 'fill', fillColor);
    this.renderer.setAttribute(svg, 'stroke', fillColor);
  }

  private clearChildren(element: HTMLElement): void {
    while (element.firstChild) {
      this.renderer.removeChild(element, element.firstChild);
    }
  }
}
