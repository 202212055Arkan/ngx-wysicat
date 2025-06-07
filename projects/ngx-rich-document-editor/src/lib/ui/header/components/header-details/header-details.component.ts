import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { WordsCounterService } from '../../../../plugins/words-counter/words-counter.service';
import { QuillStore } from '../../../../store';
import { SvgIconComponent } from '../../../icon/svg-icon.component';

export interface DetailItem {
  label: string;
  value: string;
  order?: number;
}

export type ElementType = 'lastUpdated' | 'wordsCount' | 'readTime' | string;

export interface ElementConfig {
  icon: string;
  formatter: (value: any) => string;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

@Component({
  selector: 'rde-header-details',
  templateUrl: './header-details.component.html',
  styleUrl: './header-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SvgIconComponent],
})
export class HeaderDetailsComponent {
  readonly lastUpdatedDate = input<Date>(new Date());
  readonly customDetails = input<DetailItem[]>([]);
  readonly displayElements = input<ElementType[]>(['lastUpdated', 'wordsCount', 'readTime']);
  readonly elementOrder = input<Record<string, number>>({
    lastUpdated: 0,
    wordsCount: 1,
    readTime: 2,
  });
  readonly elementConfigs = input<Record<ElementType, ElementConfig>>({
    lastUpdated: {
      icon: 'calendar-refresh',
      formatter: (date: Date) => formatDate(date),
    },
    wordsCount: {
      icon: 'string-contains',
      formatter: (count: number) => `${count} words`,
    },
    readTime: {
      icon: 'hourglass-end',
      formatter: (count: number) => `${Math.max(1, Math.round(count / 180))} min read`,
    },
  });
  protected readonly lastUpdatedDateText = computed(() => {
    const date = this.lastUpdatedDate();
    const config = this.elementConfigs();
    const formatter = config['lastUpdated']?.formatter;
    return formatter ? formatter(date) : formatDate(date);
  });
  protected readonly wordsCountText = computed(() => {
    const count = this.wordsCount();
    const config = this.elementConfigs();
    const formatter = config['wordsCount']?.formatter;
    return formatter ? formatter(count) : `${count} words`;
  });
  protected readonly wordsReadTimeText = computed(() => {
    const count = this.wordsCount();
    const config = this.elementConfigs();
    const formatter = config['readTime']?.formatter;
    return formatter ? formatter(count) : `${Math.max(1, Math.round(count / 180))} min read`;
  });
  protected readonly details = computed(() => {
    const detailElements: DetailItem[] = [];
    const displayElementsArray = this.displayElements();
    const orderConfig = this.elementOrder();
    const elementConfigs = this.elementConfigs();

    if (displayElementsArray.includes('lastUpdated')) {
      detailElements.push({
        label: elementConfigs['lastUpdated']?.icon || 'calendar-refresh',
        value: this.lastUpdatedDateText(),
        order: orderConfig['lastUpdated'] ?? 0,
      });
    }

    if (displayElementsArray.includes('wordsCount')) {
      detailElements.push({
        label: elementConfigs['wordsCount']?.icon || 'string-contains',
        value: this.wordsCountText(),
        order: orderConfig['wordsCount'] ?? 1,
      });
    }

    if (displayElementsArray.includes('readTime')) {
      detailElements.push({
        label: elementConfigs['readTime']?.icon || 'hourglass-end',
        value: this.wordsReadTimeText(),
        order: orderConfig['readTime'] ?? 2,
      });
    }

    const customDetailsList = this.customDetails();
    const allDetails = [...detailElements, ...customDetailsList];

    return allDetails.sort((a, b) => {
      const orderA = a.order ?? 999;
      const orderB = b.order ?? 999;
      return orderA - orderB;
    });
  });
  private quillStore = inject(QuillStore);
  private wordsCounterService = inject(WordsCounterService);
  readonly wordsCount = computed(() => this.wordsCounterService.getWordCount()());
}
