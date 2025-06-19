import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal, VERSION, WritableSignal } from '@angular/core';
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
  HistoryComponent,
  HistoryVersion,
  ReadOnlyButtonComponent,
  SettingsButtonComponent,
  TabComponent,
  TabGroupComponent,
  WysicatRootComponent,
  WysicatRootService,
} from 'ngx-wysicat';

import { formatHistoryData } from './history-formatter';
import { MOCK_DATA_CONFIGURATION_MAP, MOCK_DATA_MAP, MOCK_DATA_TYPE } from './mock-data';
import { FormsModule } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [
    TabComponent,
    HeaderComponent,
    TabGroupComponent,
    BlockMenuComponent,
    WysicatRootComponent,
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
    HistoryComponent,
    FormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  data: WritableSignal<EditorDataModel[]> = signal([]);
  version = VERSION;
  historyList = signal<HistoryVersion[]>(formatHistoryData());

  mockDataType: string[] = ['Random Data', 'Technical Data', 'Marketing Data', 'Business Data'];
  selectedMockDataType: MOCK_DATA_TYPE = MOCK_DATA_TYPE.RANDOM_DATA;

  authorData: HeaderAuthorModel = {
    name: 'Sir Meowsalot',
    title: 'Mouse Specialist',
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
  private readonly richDocumentService = inject(WysicatRootService);
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

  handleMockDataChange(selectedMockDataType: MOCK_DATA_TYPE): void {
    this.loadMockData(selectedMockDataType);
  }

  toggleAddToFavourite() {}

  addHistoryVersion(version: HistoryVersion) {
    this.historyList.update((versions) => [version, ...versions]);
  }

  removeHistoryVersion(versionId: string) {
    this.historyList.set(this.historyList().filter((version) => version.id !== versionId));
  }

  clearHistoryVersions() {
    this.historyList.set([]);
  }

  loadMockData(selectedMockDataType: MOCK_DATA_TYPE) {
    this.data.set(MOCK_DATA_MAP[selectedMockDataType]);
    localStorage.setItem('rde_mockDataType', JSON.stringify(selectedMockDataType));
    this.applyDemoSettings(selectedMockDataType);
  }

  applyDemoSettings(selectedMockDataType: MOCK_DATA_TYPE): void {
    const configurationToBeLoad = MOCK_DATA_CONFIGURATION_MAP[selectedMockDataType];
    localStorage.setItem('rde_documentSettings', JSON.stringify(configurationToBeLoad));
    window.location.reload();
  }
}
