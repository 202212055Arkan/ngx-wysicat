import { Inject, Injectable, InjectionToken, Injector, Optional, Provider, Type } from '@angular/core';
import Quill from 'quill';

import { NGX_RDE_CONFIG_TOKEN } from '../configs/config-tokens';
import { NgxRichDocumentEditorConfig } from '../configs/quill.config';

export interface RichDocumentEditorPlugin {
  id: string;
  name: string;

  initialize(quill: Quill): void;

  destroy?(): void;

  registerFormats?(quill: Quill): void;

  registerComponents?(): Type<unknown>[];
}

export type PluginProvider = Type<RichDocumentEditorPlugin> | RichDocumentEditorPlugin;

export const NGX_RDE_PLUGINS = new InjectionToken<PluginProvider[]>('NGX_RDE_PLUGINS');

export type PluginFactory = () => Promise<RichDocumentEditorPlugin>;

export const NGX_RDE_PLUGIN_FACTORIES = new InjectionToken<PluginFactory[]>('NGX_RDE_PLUGIN_FACTORIES');

export function provideNgxRichDocumentEditorPlugins(plugins: PluginProvider[]): Provider {
  return {
    provide: NGX_RDE_PLUGINS,
    useValue: plugins,
  };
}

@Injectable({
  providedIn: 'root',
})
export class PluginManagerService {
  private plugins: Map<string, RichDocumentEditorPlugin> = new Map();
  private quillInstance: Quill | null = null;

  constructor(
    @Inject(NGX_RDE_PLUGINS) @Optional() private pluginProviders: PluginProvider[] = [],
    @Inject(NGX_RDE_PLUGIN_FACTORIES) @Optional() private pluginFactories: PluginFactory[] = [],
    @Inject(NGX_RDE_CONFIG_TOKEN) @Optional() private config: NgxRichDocumentEditorConfig,
    private injector: Injector,
  ) {
    if (this.config?.features?.initialTemplate) {
      this.loadInitialTemplatePlugin();
    }

    if (this.config?.features) {
      this.loadConfigEnabledPlugins();
    }

    if (pluginProviders && pluginProviders.length > 0) {
      this.registerPluginProviders(pluginProviders);
    }
  }

  registerPlugin<T extends RichDocumentEditorPlugin>(plugin: T): void {
    if (this.plugins.has(plugin.id)) {
      console.warn(`Plugin with id "${plugin.id}" is already registered. Skipping.`);
      return;
    }

    this.plugins.set(plugin.id, plugin);

    if (this.quillInstance) {
      this.initializePlugin(plugin);
    }
  }

  initializePlugins(quill: Quill): void {
    this.quillInstance = quill;

    this.plugins.forEach((plugin) => {
      if (plugin.registerFormats) {
        plugin.registerFormats(quill);
      }
    });

    this.plugins.forEach((plugin) => {
      this.initializePlugin(plugin);
    });
  }

  destroyPlugins(): void {
    this.plugins.forEach((plugin) => {
      if (plugin.destroy) {
        try {
          plugin.destroy();
        } catch (error) {
          console.error(`Failed to destroy plugin "${plugin.id}":`, error);
        }
      }
    });

    this.quillInstance = null;
  }

  private loadInitialTemplatePlugin(): void {
    import('./initial-template/initial-template.plugin')
      .then((file) => {
        const plugin = this.injector.get(file.InitialTemplatePlugin);
        this.registerPlugin(plugin);
      })
      .catch((error) => {
        console.error('Failed to load initial template plugin:', error);
      });
  }

  private loadConfigEnabledPlugins(): void {
    if (this.config?.features?.emojis) {
      import('../plugins/emojis/emoji.plugin')
        .then((file) => {
          const plugin = this.injector.get(file.EmojiPlugin);
          this.registerPlugin(plugin);
        })
        .catch((error) => {
          console.error('Failed to load emoji plugin:', error);
        });
    }

    if (this.config?.features?.createBlock) {
      import('../plugins/block-create/block-create.plugin')
        .then((file) => {
          const plugin = this.injector.get(file.BlockCreatePlugin);
          this.registerPlugin(plugin);
        })
        .catch((error) => {
          console.error('Failed to load block create plugin:', error);
        });
    }

    if (this.config?.features?.blockSettings) {
      import('../plugins/block-settings/block-settings.plugin')
        .then((file) => {
          const plugin = this.injector.get(file.BlockSettingsPlugin);
          this.registerPlugin(plugin);
        })
        .catch((error) => {
          console.error('Failed to load drag and drop plugin:', error);
        });
    }

    if (this.config?.features?.blockDragAndDrop) {
      import('../plugins/drag-and-drop/drag-and-drop.plugin')
        .then((file) => {
          const plugin = this.injector.get(file.DragAndDropPlugin);
          this.registerPlugin(plugin);
        })
        .catch((error) => {
          console.error('Failed to load drag and drop plugin:', error);
        });
    }

    if (this.config?.features?.textToolbar) {
      import('../plugins/text-toolbar/text-toolbar.plugin')
        .then((file) => {
          const plugin = this.injector.get(file.TextToolbarPlugin);
          this.registerPlugin(plugin);
        })
        .catch((error) => {
          console.error('Failed to load text toolbar plugin:', error);
        });
    }

    if (this.config?.features?.documentSettings) {
      import('../plugins/document-settings/document-settings.plugin')
        .then((file) => {
          const plugin = this.injector.get(file.DocumentSettingsPlugin);
          this.registerPlugin(plugin);
        })
        .catch((error) => {
          console.error('Failed to load document settings plugin:', error);
        });
    }

    import('../plugins/words-counter/words-counter.plugin')
      .then((file) => {
        const plugin = this.injector.get(file.WordsCounterPlugin);
        this.registerPlugin(plugin);
      })
      .catch((error) => {
        console.error('Failed to load words counter plugin:', error);
      });
  }

  private registerPluginProviders(providers: PluginProvider[]): void {
    providers.forEach((provider) => {
      try {
        if (typeof provider === 'function') {
          const pluginInstance = this.injector.get(provider);
          this.registerPlugin(pluginInstance);
        } else if (typeof provider === 'object' && provider !== null) {
          this.registerPlugin(provider);
        }
      } catch (error) {
        console.error(`Failed to register plugin provider:`, error);
      }
    });
  }

  private initializePlugin<T extends RichDocumentEditorPlugin>(plugin: T): void {
    if (!this.quillInstance) {
      return;
    }

    try {
      plugin.initialize(this.quillInstance);
    } catch (error) {
      console.error(`Failed to initialize plugin "${plugin.id}":`, error);
    }
  }
}
