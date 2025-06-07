import {ChangeDetectionStrategy, Component, input} from "@angular/core";

import {HeaderAuthorModel} from "../../models/header-author.model";

@Component({
  selector: 'rde-header-author',
  templateUrl: './header-author.component.html',
  styleUrl: './header-author.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderAuthorComponent {
  public authorData = input.required<HeaderAuthorModel | null>();
}
