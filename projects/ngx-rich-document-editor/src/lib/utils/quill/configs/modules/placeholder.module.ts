import Quill from 'quill';

export class PlaceholderModule {
  private readonly quill: Quill;
  private readonly placeholder: string;
  private currentLine: any = null;
  private isReadonly: boolean;

  constructor(quill: Quill, options: { placeholder?: string }) {
    this.quill = quill;
    this.placeholder = options.placeholder || 'Start typing...';
    this.isReadonly = !this.quill.isEnabled();
    this.overrideEnableMethod();
    this.initialize();
  }

  private overrideEnableMethod() {
    const originalEnable = this.quill.enable.bind(this.quill);

    this.quill.enable = (enabled = true) => {
      const prevState = this.isReadonly;
      const nextState = !enabled;
      this.isReadonly = nextState;

      if (prevState !== nextState) {
        this.onReadonlyChanged(nextState);
      }

      originalEnable(enabled);
    };
  }

  private onReadonlyChanged(readonly: boolean) {
    if (readonly && this.currentLine) {
      this.currentLine.domNode.dataset.placeholder = '';
      this.currentLine = null;
    }
    if (!readonly) {
      this.updatePlaceholder();
    }
  }

  private initialize() {
    this.quill.on('editor-change', (eventName) => {
      if (!this.isReadonly) {
        if (eventName === 'text-change') {
          this.clearAllPlaceholders();
        }
        this.updatePlaceholder();
      }
    });

    this.quill.clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) => {
      setTimeout(() => {
        this.clearAllPlaceholders();
        this.updatePlaceholder();
      }, 0);
      return delta;
    });
  }

  private clearAllPlaceholders() {
    const editor = this.quill.scroll.domNode;
    if (editor) {
      const elements = editor.querySelectorAll('[data-placeholder]');
      elements.forEach((el) => {
        el.removeAttribute('data-placeholder');
      });
    }
  }

  private updatePlaceholder() {
    const range = this.quill.getSelection();

    if (this.currentLine) {
      this.currentLine.domNode.dataset.placeholder = '';
      this.currentLine = null;
    }

    if (range && range.length === 0) {
      const [line] = this.quill.getLine(range.index);

      if (line && line.length() <= 1) {
        this.currentLine = line;
        line.domNode.dataset['placeholder'] = this.placeholder;
      }
    }
  }
}
