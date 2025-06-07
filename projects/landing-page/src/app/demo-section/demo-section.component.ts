import { Component, signal } from '@angular/core';
import {
  DocumentSettingsMenuComponent, EditorDataModel,
  HeaderAuthorComponent, HeaderAuthorModel,
  HeaderComponent,
  HeaderDetailsComponent,
  RichDocumentComponent,
} from 'ngx-rich-document-editor';

@Component({
  selector: 'app-demo-section',
  standalone: true,
  imports: [
    RichDocumentComponent,
    HeaderAuthorComponent,
    HeaderComponent,
    HeaderDetailsComponent,
    DocumentSettingsMenuComponent,
  ],
  templateUrl: './demo-section.component.html',
  styleUrls: ['./demo-section.component.css'],
})
export class DemoSectionComponent {

  data: EditorDataModel[] = [];

  authorData: HeaderAuthorModel = {
    name: 'Sir Meowsalot',
    title: 'Mouse Specialist',
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
