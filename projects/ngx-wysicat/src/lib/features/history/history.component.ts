import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, Input, model, output, signal } from '@angular/core';

import { QuillStore } from '../../store';
import { SvgIconComponent } from '../../ui/icon/svg-icon.component';
import { ToggleSwitchComponent } from '../../ui/toggle-switch/toggle-switch.component';

export interface HistoryVersion {
  id: string;
  title: string;
  time: string;
  changes: string;
  content: string | any[];
  removing?: boolean;
}

@Component({
  selector: 'nw-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, ToggleSwitchComponent, SvgIconComponent],
})
export class HistoryComponent {
  autoSave = model(true);
  readonly saveVersion = output<HistoryVersion>();
  readonly clearHistory = output<void>();
  readonly loadVersion = output<HistoryVersion>();
  readonly removeVersion = output<string>();
  protected readonly isAutoSaveEnabled = signal(true);
  protected readonly selectedVersion = signal<string>('current');
  protected readonly currentPage = signal(1);
  protected readonly historyVersions = signal<HistoryVersion[]>([]);
  protected readonly totalVersions = computed(() => this.historyVersions().length);
  protected readonly hasMoreVersions = signal(false);
  protected readonly isClearing = signal(false);
  protected readonly showEmptyState = signal(false);
  private readonly quillStore = inject(QuillStore);

  @Input({ required: false })
  set externalHistoryData(data: HistoryVersion[] | null) {
    if (data) {
      this.historyVersions.set(data);
      this.hasMoreVersions.set(false);
      this.showEmptyState.set(data.length === 0);
    }
  }

  toggleAutoSave(enabled: boolean): void {
    this.isAutoSaveEnabled.set(enabled);
    this.autoSave.set(enabled);
  }

  loadMore(): void {
    this.currentPage.update((page) => page + 1);
  }

  onRemoveVersion(versionId: string): void {
    // Mark the item as removing to trigger the animation
    this.historyVersions.update((versions) =>
      versions.map((v) => v.id === versionId ? { ...v, removing: true } : v),
    );

    // Wait for animation to complete before actually removing the item
    setTimeout(() => {
      // Update the history versions list to remove the item
      this.historyVersions.update((versions) => {
        const filtered = versions.filter((v) => v.id !== versionId);
        if (filtered.length === 0) {
          setTimeout(() => this.showEmptyState.set(true), 100);
        }
        return filtered;
      });

      // Only emit the removal event after animation completes
      this.removeVersion.emit(versionId);

      // Update selected version if needed
      if (this.selectedVersion() === versionId) {
        this.selectedVersion.set('current');
      }
    }, 400);
  }

  onClearHistory(): void {
    if (this.historyVersions().length === 0) {
      return;
    }

    // Hide empty state message during clearing
    this.showEmptyState.set(false);

    // Set clearing flag to true
    this.isClearing.set(true);

    // Mark all items as removing to trigger the animation
    this.historyVersions.update((versions) =>
      versions.map((v) => ({ ...v, removing: true })),
    );

    // Wait for animation to complete before actually clearing
    setTimeout(() => {
      // Clear the history versions
      this.historyVersions.set([]);

      // Emit the clear event
      this.clearHistory.emit();

      // Reset the selected version
      this.selectedVersion.set('current');

      // Reset the clearing flag
      this.isClearing.set(false);

      // Show empty state message with a delay
      setTimeout(() => {
        this.showEmptyState.set(true);
      }, 100);
    }, 400);
  }

  applyVersion(version: HistoryVersion): void {
    if (Array.isArray(version.content)) {
      this.quillStore.setContent(version.content);
    }
    this.loadVersion.emit(version);
  }

  saveCurrentVersion(): void {
    const currentContent = this.quillStore.documentChanged();
    if (currentContent) {
      // Hide empty state when adding a new version
      this.showEmptyState.set(false);

      const newVersion: HistoryVersion = {
        id: `v${Date.now()}`,
        title: 'Manual save',
        time: this.formatCurrentTime(),
        changes: 'Manual save',
        content: currentContent,
      };

      this.historyVersions.update((versions) => [newVersion, ...versions]);
      this.saveVersion.emit(newVersion);
    }
  }

  private formatCurrentTime(): string {
    const now = new Date();
    const hours = now.getHours().toString()
.padStart(2, '0');
    const minutes = now.getMinutes().toString()
.padStart(2, '0');
    return `Today, ${hours}:${minutes}`;
  }
}
