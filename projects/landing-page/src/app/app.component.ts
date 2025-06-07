import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { EditorDataModel, HeaderAuthorModel } from 'ngx-wysicat';

import { DemoSectionComponent } from './demo-section/demo-section.component';
import { FeaturesSectionComponent } from './features-section/features-section.component';
import { FooterSectionComponent } from './footer-section/footer-section.component';
import { HeroSectionComponent } from './hero-section/hero-section.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [HeroSectionComponent, FeaturesSectionComponent, DemoSectionComponent, FooterSectionComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  data: EditorDataModel[] = [];

  authorData: HeaderAuthorModel = {
    name: 'Sir Meowsalot Whiskerface',
    title: 'Mouse Operations Specialist',
    imageUrl: '/assets/img/catto.jpg',
  };
  documentLastUpdatedDate = signal(new Date());
  documentSettingsOpened = signal(true);
  isReadOnly = signal(false);

  constructor() {
    this.loadData();
  }

  handleData(editorData: EditorDataModel[]) {
    localStorage.setItem('ql_editorData', JSON.stringify(editorData));
    this.documentLastUpdatedDate.set(new Date());
  }

  loadData() {
    const loadedData = localStorage.getItem('ql_editorData');
    if (loadedData) {
      this.data = JSON.parse(loadedData) as EditorDataModel[];
    } else {
      this.data = [];
    }
  }

  toggleDrawer() {
    this.documentSettingsOpened.set(!this.documentSettingsOpened());
  }

  toggleReadOnly() {
    this.isReadOnly.set(!this.isReadOnly());
  }

  toggleAddToFavourite() {
    alert('Added to favourities!');
  }
}
