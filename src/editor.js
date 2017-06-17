// @flow

import EventEmitter from 'eventemitter3';

import {createCustomEvent} from './utils';
import SearchResult from './search_result';

/** @typedef */
export type CursorOffset = {
  lineHeight: number;
  top: number;
  left?: number;
  right?: number;
};

type KeyCode = 'ESC' | 'ENTER' | 'UP' | 'DOWN' | 'OTHER' | 'BS' | 'META';

/**
 * Abstract class representing a editor target.
 *
 * Editor classes must implement `#applySearchResult`, `#getCursorOffset`,
 * `#getBeforeCursor` and `#getAfterCursor` methods.
 *
 * @abstract
 */
export default class Editor extends EventEmitter {
  /**
   * It is called when associated textcomplete object is destroyed.
   *
   * @return {this}
   */
  destroy() {
    return this;
  }

  /**
   * It is called when a search result is selected by a user.
   */
  applySearchResult(_: SearchResult): void {
    throw new Error('Not implemented.');
  }

  /**
   * The input cursor's absolute coordinates from the window's left
   * top corner.
   */
  getCursorOffset(): CursorOffset {
    throw new Error('Not implemented.');
  }

  /**
   * Editor string value from head to cursor.
   */
  getBeforeCursor(): string {
    throw new Error('Not implemented.');
  }

  /**
   * Editor string value from cursor to tail.
   */
  getAfterCursor(): string {
    throw new Error('Not implemented.');
  }

  /** @private */
  emitMoveEvent(code: 'UP' | 'DOWN'): CustomEvent {
    const moveEvent = createCustomEvent('move', {
      cancelable: true,
      detail: {
        code: code,
      },
    });
    this.emit('move', moveEvent);
    return moveEvent;
  }

  /** @private */
  emitEnterEvent(): CustomEvent {
    const enterEvent = createCustomEvent('enter', { cancelable: true });
    this.emit('enter', enterEvent);
    return enterEvent;
  }

  /** @private */
  emitChangeEvent(): CustomEvent {
    const changeEvent = createCustomEvent('change', {
      detail: {
        beforeCursor: this.getBeforeCursor(),
      },
    });
    this.emit('change', changeEvent);
    return changeEvent;
  }

  /** @private */
  emitEscEvent(): CustomEvent {
    const escEvent = createCustomEvent('esc', { cancelable: true });
    this.emit('esc', escEvent);
    return escEvent;
  }

  /** @private */
  getCode(e: KeyboardEvent): KeyCode {
    return e.keyCode === 8 ? 'BS' // backspace
         : e.keyCode === 9 ? 'ENTER' // tab
         : e.keyCode === 13 ? 'ENTER' // enter
         : e.keyCode === 16 ? 'META' // shift
         : e.keyCode === 17 ? 'META' // ctrl
         : e.keyCode === 18 ? 'META' // alt
         : e.keyCode === 27 ? 'ESC' // esc
         : e.keyCode === 38 ? 'UP' // up
         : e.keyCode === 40 ? 'DOWN' // down
         : e.keyCode === 78 && e.ctrlKey ? 'DOWN' // ctrl-n
         : e.keyCode === 80 && e.ctrlKey ? 'UP' // ctrl-p
         : e.keyCode === 91 ? 'META' // left command
         : e.keyCode === 93 ? 'META' // right command
         : 'OTHER';
  }
}
