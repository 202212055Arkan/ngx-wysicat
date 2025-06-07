<div align="center">
  <img src="assets/logo.png" alt="NGX Rich Document Editor" width="250">
  <h1>NGX Rich Document Editor</h1>
  <p><b>A flexible, feature-rich document editor for Angular.</b></p>
  <p>
    Build beautiful, structured documents with ease. NGX Rich Document Editor combines block-based editing, advanced formatting, and a flexible plugin system—all powered by Quill.js. Perfect for collaborative apps, note-taking tools, or any project where content quality matters.
  </p>
  <p>
    Designed for clarity, speed, and a seamless writing experience. Make your documents stand out and your users feel at home.
  </p>
  <p>
    <a href="https://app.netlify.com/sites/test-quill-appx/deploys"><img src="https://api.netlify.com/api/v1/badges/ce859423-fb65-4ae9-82c4-d0ad1e24982e/deploy-status" alt="Demo Status"></a>
    <a href="https://test-quill-appx.netlify.app/"><img src="https://img.shields.io/badge/Demo-Test%20Quill%20Appx-blue" alt="Demo"></a>
    <a href="https://ngx-wysicat.netlify.app/"><img src="https://img.shields.io/badge/Landing-NGX%20Rich%20Document%20Editor-success" alt="Landing Page"></a>
  </p>
</div>

## 🐾 Features

- **Block-Based Editing** - Create and manipulate content blocks with an intuitive interface
- **Document Header System** - Personalize with author information and metadata
- **Document Settings Panel** - Fine-tune your document with powerful configuration options
- **Floating Menu Options** - Quick access to document and block operations
- **Word Count & Reading Time** - Track document metrics automatically
- **Rich Text Formatting** - Express yourself with comprehensive styling options

### Plugin System

NGX Rich Document Editor comes with a robust plugin architecture that includes:

- **Text Toolbar** - Comprehensive text formatting with color selection, headings, lists, links, and more
- **Block Creation** - Add various content blocks to your document
- **Block Menu** - Manage and navigate between blocks
- **Block Settings** - Configure individual block properties
- **Document Settings** - Control document-wide configurations
- **Drag and Drop** - Reorder blocks with intuitive drag and drop
- **Emojis** - Insert and manage emoji characters
- **Initial Template** - Starter templates for new documents
- **Words Counter** - Track word count and reading time statistics

## 🐱 Installation

```bash
pnpm add ngx-wysicat
```

## 🐈 Basic Usage

```typescript
import { provideNgxRichDocumentEditorConfig } from 'ngx-wysicat';

export const appConfig: ApplicationConfig = {
  providers: [
    provideNgxRichDocumentEditorConfig({
      features: {
        emojis: true,
        blockDragAndDrop: true,
        textToolbar: true,
        wordsCounter: true
      },
      ui: {
        theme: 'light',
        fonts: {
          sans: 'Arial',
          serif: 'Times New Roman',
          mono: 'Courier New'
        }
      }
    })
  ],
};
```

```html
<nw-root [editorData]="data" (editorDataChanged)="onEditorDataChanged($event)">
  <nw-header header>
    <nw-header-author author [authorData]="authorData" />
    <div details class="header__right-content">
      <nw-header-details [lastUpdatedDate]="documentLastUpdatedDate()"
                          [displayElements]="displayElements"
                          [elementOrder]="elementOrder"
                          [elementConfigs]="elementConfigs" />
      <div class="vertical-divider vertical-divider--big"></div>
      <nw-document-settings-menu position="horizontal">
        <nw-favorite-button (favoriteToggle)="toggleAddToFavourite()" />
        <nw-read-only-button [isReadOnly]="isReadOnly()" (clicked)="setReadOnly($event)" />
        <nw-settings-button (settingsToggle)="toggleSidebar()" />
      </nw-document-settings-menu>
    </div>
  </nw-header>

  <nw-block-menu blockMenu>
    <nw-block-create-button />
    <nw-block-settings />
  </nw-block-menu>
</nw-root>
```

## 🐈‍⬛ Component API

### Core Components
- `WysicatRootComponent` - The main container that brings everything together
- `HeaderComponent` - Sleek document header with customizable sections
- `BlockMenuComponent` - Intuitive interface for block manipulation

### Plugin System

```typescript
@Injectable({ providedIn: 'root' })
export class MyCustomPlugin implements RichDocumentEditorPlugin {
  id = 'my-plugin';
  name = 'My Plugin';
  
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

Here are the main commands for working on this project:

```bash
# Start the demo app
pnpm start

# Build the demo app
pnpm build:demo

# Build the library
pnpm build:lib

# Cleanup, reset Nx, and reinstall dependencies
pnpm cleanup

# Check for circular dependencies
pnpm check-circular-deps

# Analyze the library
pnpm analyze:lib

# Analyze the demo bundle
pnpm analyze:demo

# Build demo with stats
pnpm build:analyze-demo

# Visualize build stats
pnpm display:analyze-demo

# Lint the codebase
pnpm lint
