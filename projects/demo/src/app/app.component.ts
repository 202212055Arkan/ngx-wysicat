import { ChangeDetectionStrategy, Component, inject, signal, VERSION, WritableSignal } from '@angular/core';
import {
  BlockCreateButtonComponent,
  BlockMenuComponent,
  BlockSettingsButtonComponent,
  DocumentSettingsComponent,
  DocumentSettingsGeneralComponent,
  DocumentSettingsMediaComponent,
  DocumentSettingsMenuComponent,
  EditorDataModel,
  ElementConfig,
  ElementType,
  FavoriteButtonComponent,
  HeaderAuthorComponent,
  HeaderAuthorModel,
  HeaderComponent,
  HeaderDetailsComponent,
  ReadOnlyButtonComponent,
  RichDocumentComponent,
  RichDocumentService,
  SettingsButtonComponent,
  TabComponent,
  TabGroupComponent,
} from 'ngx-rich-document-editor';

import { MOCK_DATA } from './mock-data';
import { NgOptimizedImage } from '@angular/common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [
    TabComponent,
    HeaderComponent,
    TabGroupComponent,
    BlockMenuComponent,
    RichDocumentComponent,
    HeaderAuthorComponent,
    HeaderDetailsComponent,
    ReadOnlyButtonComponent,
    SettingsButtonComponent,
    FavoriteButtonComponent,
    DocumentSettingsComponent,
    BlockCreateButtonComponent,
    BlockSettingsButtonComponent,
    DocumentSettingsMenuComponent,
    DocumentSettingsMediaComponent,
    DocumentSettingsGeneralComponent,
    NgOptimizedImage,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  data: WritableSignal<EditorDataModel[]> = signal([]);
  version = VERSION;

  authorData: HeaderAuthorModel = {
    name: 'Sir Meowsalot Whiskerface',
    title: 'Mouse Operations Specialist',
    imageUrl: '/assets/img/catto.jpg',
  };
  documentLastUpdatedDate = signal(new Date());
  documentSettingsOpened = signal(true);
  displayElements: ElementType[] = ['lastUpdated', 'wordsCount', 'readTime'];
  elementOrder = {
    lastUpdated: 0,
    wordsCount: 2,
    readTime: 1,
  };
  elementConfigs: Record<ElementType, ElementConfig> = {
    lastUpdated: {
      icon: 'calendar-refresh',
      formatter: (date: Date) => `Updated: ${date.toLocaleDateString()}`,
    },
    wordsCount: {
      icon: 'string-contains',
      formatter: (count: number) => `${count} total words`,
    },
    readTime: {
      icon: 'hourglass-end',
      formatter: (count: number) => `${Math.max(1, Math.round(count / 225))} min read time`,
    },
  };
  private readonly richDocumentService = inject(RichDocumentService);
  isReadOnly = this.richDocumentService.isReadOnly;

  constructor() {
    this.loadData();
  }

  onEditorDataChanged(editorData: EditorDataModel[]) {
    localStorage.setItem('ql_editorData', JSON.stringify(editorData));
    this.documentLastUpdatedDate.set(new Date());
  }
  loadData() {
    const loadedData = localStorage.getItem('ql_editorData');
    if (loadedData) {
      this.data.set(JSON.parse(loadedData) as EditorDataModel[]);
    }
  }

  toggleSidebar() {
    this.documentSettingsOpened.set(!this.documentSettingsOpened());
  }

  setReadOnly(value: boolean) {
    this.richDocumentService.setReadOnly(value);
  }

  toggleAddToFavourite() {
  }

  loadMockData() {
    this.data.set([...MOCK_DATA]);
  }
}
