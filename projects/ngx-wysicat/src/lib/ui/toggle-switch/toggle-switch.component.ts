import {ChangeDetectionStrategy, Component, model} from '@angular/core';

@Component({
  selector: 'nw-toggle-switch',
  templateUrl: './toggle-switch.component.html',
  styleUrls: ['./toggle-switch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleSwitchComponent {
  public enabled = model<boolean>(true);

  protected toggle(): void {
    this.enabled.set(!this.enabled());
  }
}
