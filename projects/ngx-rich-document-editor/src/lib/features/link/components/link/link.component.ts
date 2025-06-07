import {ChangeDetectionStrategy, Component, model, output} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {Link} from './link.models';

@Component({
  selector: 'rde-link',
  templateUrl: './link.component.html',
  imports: [FormsModule],
  styleUrls: ['./link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkComponent {
  public readonly linkSubmitted = output<Link>();
  public readonly linkCancelled = output<void>();
  public url = model('');
  public linkText = model('');
  public urlError = model<string | null>(null);

  handleSubmit(): void {
    this.validateUrl();

    if (this.urlError()) {
      return;
    }

    if (!this.linkText().trim()) {
      this.linkText.set(this.url());
    }

    this.linkSubmitted.emit({
      url: this.url(),
      text: this.linkText(),
    });
  }

  handleCancel(): void {
    this.linkCancelled.emit();
  }

  validateUrl(): void {
    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})([/?].*)?$/;

    if (!this.url().trim()) {
      this.urlError.set("URL cannot be empty.");
    } else if (!urlPattern.test(this.url().trim())) {
      this.urlError.set("Please enter a valid URL.");
    } else {
      this.urlError.set(null);
    }
  }
}
