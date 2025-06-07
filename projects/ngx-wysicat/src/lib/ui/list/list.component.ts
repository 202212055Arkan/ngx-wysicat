import {ChangeDetectionStrategy, Component, Input, output} from "@angular/core";

import {SvgIconComponent} from '../icon/svg-icon.component';

@Component({
  selector: "nw-list-temp2",
  template: `
    <div class="menu-content">
      <div class="list-container">
        @for (menuItem of blockOptions; track $index) {
          <button class="list-item" (click)="itemSelected(menuItem.label)">
            <nw-svg-icon [name]="menuItem.label" [primary]="true" />
            <span>{{ menuItem.name }}</span>
          </button>
        }
      </div>
    </div>
  `,
  styles: `
    .menu-content {
      --menu-card-space: 7px;
      display: block;
      background-color: var(--nw-color-white);
      border: 1px solid var(--nw-color-primary-300);
      border-radius: 8px;
      box-shadow: var(--shadow-xs);
      min-width: 220px;
      padding: var(--menu-card-space);
    }

  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SvgIconComponent,
  ],
})
export class ListComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected blockOptions: any;

  @Input()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set blockOptionsx(data: any) {
    this.blockOptions = data;
  }

  readonly selected = output<string>();

  itemSelected(value: string) {
    this.selected.emit(value);
  }
}
