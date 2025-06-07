import {NgTemplateOutlet} from "@angular/common";
import {AfterContentInit, ChangeDetectionStrategy,Component, contentChildren, signal} from '@angular/core';

import {TabComponent} from '../tab/tab.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'nw-tab-group',
  templateUrl: './tab-group.component.html',
  imports: [NgTemplateOutlet],
  styleUrls: ['./tab-group.component.scss'],
})
export class TabGroupComponent implements AfterContentInit {
  tabs = contentChildren<TabComponent>(TabComponent);

  selectedIndex = signal(0);

  ngAfterContentInit() {
    this.selectTab(0);
  }

  selectTab(index: number) {
    this.selectedIndex.set(index);
  }
}
