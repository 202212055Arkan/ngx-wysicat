# Text Commands

This folder contains the code for text commands that are used in the `ngx-rich-document-editor` library.

Text commands are functions that are executed when the user types a specific text in the editor. For example, when the user types '/', the block menu is opened.

The code is organized into two main folders:

- `rules`: This folder contains the code for the rules that are used to determine which text command to execute. The rules are functions that take the current selection and the text that the user has typed as input and return a boolean indicating whether the rule matches or not.

- `text-command-bus.service.ts`: This file contains the service that is responsible for executing the text commands. The service is an event bus that listens for the 'text-change' event emitted by the `QuillEditorComponent` and executes the corresponding text command when the user types a specific text.

The text commands are used in the `QuillEditorComponent` to provide a better user experience. For example, when the user types '/', the block menu is opened and the user can select a block type to create a new block. This is more convenient than having to click on a button to open the block menu.

The text commands are also used in the `CreateBlockComponent` to provide a better user experience when creating new blocks. For example, when the user types 'h1', a new block of type 'h1' is created. This is more convenient than having to select the block type from a dropdown menu.

The text commands are also used in the `EmojiComponent` to provide a better user experience when inserting emojis. For example, when the user types ':smile:', the corresponding emoji is inserted into the editor. This is more convenient than having to search for the emoji in a dropdown menu.
