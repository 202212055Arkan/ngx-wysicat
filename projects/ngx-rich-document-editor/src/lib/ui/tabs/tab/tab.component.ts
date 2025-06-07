import {ChangeDetectionStrategy,Component, input, TemplateRef,viewChild} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,

  selector: 'rde-tab',
  templateUrl: './tab.component.html',
})
export class TabComponent {
  public label = input.required<string>();
  public id = input.required<string>();

  content = viewChild<TemplateRef<unknown>>(TemplateRef);
}
