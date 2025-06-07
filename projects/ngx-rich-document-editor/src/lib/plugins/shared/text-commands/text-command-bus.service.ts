/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, Injectable, NgZone } from '@angular/core';
import Quill from 'quill';
import Delta from 'quill-delta';
import { BehaviorSubject } from 'rxjs';

import { ConfigsService } from '../../../configs/configs.service';

import { commandRules } from './rules';

type CommandType = 'BLOCK_MENU' | 'EMOJI';

interface CommandConfig {
  featureFlag: keyof import('../../../configs/quill.config').FeatureFlags;
}

@Injectable({
  providedIn: 'root',
})
export class TextCommandBusService {
  private readonly ngZone = inject(NgZone);
  private readonly configs = inject(ConfigsService);
  private activeCommand = new BehaviorSubject<any>(null);
  activeCommand$ = this.activeCommand.asObservable();

  private commandTriggers: Record<string, CommandType> = {
    '/': 'BLOCK_MENU',
    ':': 'EMOJI',
    // '@': 'MENTION',
  };

  private commandConfigs: Record<CommandType, CommandConfig> = {
    'BLOCK_MENU': { featureFlag: 'createBlock' },
    'EMOJI': { featureFlag: 'emojis' },
    // 'MENTION': { featureFlag: null },
  } as const;

  get currentCommand() {
    return this.activeCommand.value;
  }

  initialize(quill: Quill): void {
    this.ngZone.runOutsideAngular(() => {
      quill.on('text-change', (delta) => {
        this.ngZone.run(() => {
          this.processTextChange(delta, quill);
        });
      });

      quill.keyboard.addBinding({
        key: 27,
        handler: () => {
          if (this.activeCommand.value) {
            this.resetCommand();
            return false;
          }
          return true;
        },
      });
    });
  }

  resetCommand(): void {
    this.activeCommand.next(null);
  }

  private processTextChange(delta: Delta, quill: Quill) {
    const currentCommand = this.activeCommand.value;
    if (currentCommand) {
      this.handleActiveCommand(delta, quill, currentCommand);
    } else {
      this.checkForCommandTrigger(delta, quill);
    }
  }

  private checkForCommandTrigger(delta: any, quill: Quill): void {
    const insertInfo = this.getInsertedInfo(delta);

    if (!insertInfo || !insertInfo.char) {
      return;
    }

    const insertedChar = insertInfo.char;
    const commandType = this.commandTriggers[insertedChar];

    if (commandType && !this.activeCommand.value) {
      // Check if the command is enabled in the config
      const commandConfig = this.commandConfigs[commandType];

      if (commandConfig.featureFlag && !this.configs.getFeatureFlag(commandConfig.featureFlag)) {
        return;
      }

      const canActivate = this.checkCommandRule(commandType, insertInfo, quill);

      if (!canActivate) {
        return;
      }

      const selection = quill.getSelection();

      if (selection) {
        const triggerIndex = insertInfo.position;

        this.activeCommand.next({
          type: commandType,
          trigger: insertedChar,
          triggerIndex: triggerIndex,
          searchText: '',
        });
      }
    }
  }

  private checkCommandRule(commandType: string, insertInfo: any, quill: Quill): boolean {
    const rule = commandRules[commandType];

    if (!rule) {
      return true;
    }

    return rule(insertInfo, quill);
  }

  private handleActiveCommand(delta: any, quill: any, command: any): void {
    const selection = quill.getSelection();
    if (!selection) {
      return;
    }

    const triggerChar = quill.getText(command.triggerIndex, 1);

    if (triggerChar !== command.trigger) {
      this.resetCommand();
      return;
    }

    const textLength = Math.max(0, selection.index - command.triggerIndex - 1);
    const textAfterTrigger = quill.getText(command.triggerIndex + 1, textLength);

    if (this.shouldTerminateCommand(textAfterTrigger)) {
      this.resetCommand();
      return;
    }

    this.activeCommand.next({
      ...command,
      searchText: textAfterTrigger,
    });
  }

  private shouldTerminateCommand(searchText: string) {
    const spaceCount = (searchText.match(/\s/g) || []).length;
    return spaceCount > 1;
  }

  private getInsertedInfo(delta: { ops: any }) {
    const ops = delta.ops;
    if (!ops) {
      return null;
    }

    let position = 0;

    for (let i = 0; i < ops.length; i++) {
      const op = ops[i];

      if (op.retain) {
        position += op.retain;
      }

      if (op.insert && typeof op.insert === 'string') {
        const text = op.insert;
        const lastChar = text.slice(-1);

        if (lastChar.length === 1) {
          return {
            char: lastChar,
            position: position + text.length - 1,
          };
        }
      }
    }

    return null;
  }
}
