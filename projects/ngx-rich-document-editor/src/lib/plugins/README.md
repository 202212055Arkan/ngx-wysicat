# Plugins

Plugins are components that extend the editor's functionality by integrating with Quill. Each plugin is designed to be modular and can be enabled or disabled through configuration.

## Available Plugins

* `block-create`: Enables creation of new blocks in the editor
* `block-settings`: Provides configuration options for individual blocks
* `document-settings`: Manages document-level settings like font size, font family, etc.
* `drag-and-drop`: Implements drag and drop functionality for editor elements
* `emojis`: Adds emoji insertion capability to the editor
* `initial-template`: Sets up initial template text when the editor is first loaded
* `text-toolbar`: Provides text formatting tools for the editor
* `words-counter`: Tracks and displays word count statistics

## Implementation

Each plugin:
- Is contained in its own directory
- Integrates with the Quill editor instance
- Can be enabled/disabled via configuration (set to `true` to load, `false` to disable)
- Follows the plugin system architecture defined in `plugin-system.ts`
