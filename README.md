<div align="center">
  <img src="assets/logo.png" alt="ngx-wysicat" width="250">
  <h1>ngx-wysicat</h1>
  <p><b>A simple yet powerful document editor for Angular.</b></p>
  <p>
    Create beautiful documents easily. ngx-wysicat uses blocks for content, offers many formatting options, and works with plugins—all built on Quill.js. Perfect for team apps, note-taking, or any project that needs good-looking content.
  </p>
  <p>
    Built for clear, fast, and smooth writing. Help your users create great documents.
  </p>
  <p>
    <a href="https://app.netlify.com/sites/test-quill-appx/deploys"><img src="https://api.netlify.com/api/v1/badges/ce859423-fb65-4ae9-82c4-d0ad1e24982e/deploy-status" alt="Demo Status"></a>
    <a href="https://ngx-wysicat-demo.netlify.app/"><img src="https://img.shields.io/badge/demo-ngx--wysicat-blue" alt="ngx-wysicat demo"></a>

[//]: # (    <a href=""><img src="https://img.shields.io/badge/landing%20page-ngx--wysicat-purple" alt="ngx-wysicat demo landing page"></a>)
  </p>
</div>

> **!! Contributions are welcome!** This project is in an early stage where we're adding new features and exploring ideas. Later, we'll split features into plugins to make everything cleaner. If you find bugs or have ideas to make it better, please open an issue or send a pull request. We appreciate your help!

## 🐾 Features

- **Block-Based Editing** - Create and move content blocks easily
- **Document Header** - Add author info and other details
- **Settings Panel** - Change how your document looks and works
- **Floating Menus** - Quick access to tools
- **Word Count & Reading Time** - See how long your document is
- **Rich Text Formatting** - Add styles to your text
- **Image Resizing** - Change image size right in the editor
- **Social Media Embeds** - Add LinkedIn and Twitter posts
- **Enhanced Links** - See link previews when hovering

### Coming Soon

- **YouTube Videos** - Add videos directly in your documents
- **Better People Mentions** - Improved way to tag people
- **Better Link Displays** - More attractive link previews

### Plugins

- **Text Toolbar** - Format text with colors, headings, lists, links, and more
- **Block Creation** - Add different types of content blocks
- **Block Menu** - Manage your content blocks
- **Block Settings** - Change how blocks look and work
- **Document Settings** - Control overall document settings
- **Drag and Drop** - Move blocks by dragging them
- **Emojis** - Add emoji characters
- **Initial Template** - Start with ready-made templates
- **Words Counter** - Track word count and reading time

## 🐈 Installation

```bash
pnpm add ngx-wysicat
```

## 🐈 Basic Usage

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideNgxRichDocument } from 'ngx-wysicat';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({
      eventCoalescing: true,
    }),
    provideNgxRichDocument(
      {
        features: {
          createBlock: true,
        },
        ui: {
          fonts: {
            sans: 'Inter',
            serif: 'Playfair Display',
            mono: 'JetBrains Mono',
          },
        },
      },
      [], // no custom plugins
    ),
  ],
};
```

```html
<nw-root [editorData]="data()" (editorDataChanged)="onEditorDataChanged($event)">
  <nw-header header>
    <nw-header-author author [authorData]="authorData" />
    <div details class="header__right-content">
      <nw-header-details [lastUpdatedDate]="documentLastUpdatedDate()"
                         [displayElements]="displayElements"
                         [elementOrder]="elementOrder"
                         [elementConfigs]="elementConfigs">
      </nw-header-details>
      <div class="vertical-divider vertical-divider--big"></div>
      <nw-document-settings-menu position="horizontal">
        <nw-favorite-button (favoriteToggle)="toggleAddToFavourite()" />
        <nw-read-only-button [isReadOnly]="isReadOnly()" (clicked)="setReadOnly($event)" />
        <nw-settings-button (settingsToggle)="toggleSidebar()" />
      </nw-document-settings-menu>
    </div>
  </nw-header>

  <nw-document-settings-menu floatingMenu position="vertical">
    <nw-favorite-button (favoriteToggle)="toggleAddToFavourite()" />
    <nw-read-only-button [isReadOnly]="isReadOnly()" (clicked)="setReadOnly($event)" />
    <nw-settings-button (settingsToggle)="toggleSidebar()" />
  </nw-document-settings-menu>

  @if (!isReadOnly()) {
    <nw-block-menu blockMenu>
      <nw-block-create-button />
      <nw-block-settings />
    </nw-block-menu>
  }

  <div class="dc" documentSettings [class.closed]="!documentSettingsOpened()">
    <nw-document-settings>
      <nw-tab-group>
        <nw-tab id="tab-general" label="General">
          <nw-document-settings-general />
        </nw-tab>
        <nw-tab id="tab-media" label="Media">
          <nw-document-settings-media />
        </nw-tab>
        <nw-tab id="tab-history" label="History">
          <nw-history [externalHistoryData]="historyList()"
                     (saveVersion)="addHistoryVersion($event)"
                     (removeVersion)="removeHistoryVersion($event)"
                     (clearHistory)="clearHistoryVersions()" />
        </nw-tab>
      </nw-tab-group>
    </nw-document-settings>
  </div>
</nw-root>
```

## 🐈‍⬛ Creating Custom Plugins

```typescript
@Injectable({ providedIn: 'root' })
export class MyCustomPlugin implements WysicatPlugin {
  readonly id = 'my-plugin';
  readonly name = 'My Plugin';
  
  private quill: Quill | null = null;
  private textChangeHandler: (() => void) | null = null;
  
  initialize(quill: Quill): void {
    this.quill = quill;
    
    this.textChangeHandler = () => {
      const text = this.quill?.getText() || '';
    };
    
    this.quill.on('text-change', this.textChangeHandler);
  }
  
  destroy(): void {
    if (this.quill && this.textChangeHandler) {
      this.quill.off('text-change', this.textChangeHandler);
    }
    this.quill = null;
    this.textChangeHandler = null;
  }
}
```

## 🐅 Development

Here are the main commands you can use:

```bash
# Start the demo app locally
nx serve demo

# Build the library
nx build ngx-wysicat

# Build the library in development mode
nx build ngx-wysicat --configuration=development

# Build the demo app
nx build demo

# Analyze the demo app bundle
nx analyze-bundle demo

# Check for circular dependencies
nx madge-deps ngx-wysicat

# Reset dependencies, Nx cache, and reinstall
pnpm reset-deps

# Lint the library
nx lint ngx-wysicat
```

### Project Structure

- `projects/ngx-wysicat` - Main library code
- `projects/demo` - Demo app showing library features
- `projects/landing-page` - Project landing page

### Getting Started for New Developers

1. Clone the repository
2. Install dependencies with `pnpm reset-deps`
3. Start the demo app with `nx serve demo`
4. Go to `http://localhost:4200` to see the editor working

The demo app lets you test and explore all ngx-wysicat features.
