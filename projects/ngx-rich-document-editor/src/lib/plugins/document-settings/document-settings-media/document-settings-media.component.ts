import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { SvgIconComponent } from '../../../ui/icon/svg-icon.component';

import { MediaService } from './media.service';

@Component({
  selector: 'rde-document-settings-media',
  templateUrl: './document-settings-media.component.html',
  styleUrl: './document-settings-media.component.scss',
  imports: [SvgIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentSettingsMediaComponent {
  protected readonly mediaService = inject(MediaService);

  removeLink(url: string): void {
    this.mediaService.removeItem(url);
  }
}
