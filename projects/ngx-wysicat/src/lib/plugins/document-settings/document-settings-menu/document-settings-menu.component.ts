import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'nw-document-settings-menu',
  templateUrl: './document-settings-menu.component.html',
  styleUrl: './document-settings-menu.component.scss',
  host: {
    '[class.horizontal]': 'isHorizontal()',
    '[class.vertical]': '!isHorizontal()',
  },
})
export class DocumentSettingsMenuComponent {
  public position = input<'horizontal' | 'vertical'>('horizontal');

  public readonly isHorizontal = computed(() => this.position() === 'horizontal');
  public readonly documentSettingsToggle = output<void>();
  public readonly readOnlyToggle = output<void>();
  public readonly addToFavouritesToggle = output<void>();
}
