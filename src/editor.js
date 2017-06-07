// @flow

import {createCustomEvent} from './utils';
import SearchResult from './search_result';

import EventEmitter from 'events';

export const ENTER = 'ENTER';
export const UP = 'UP';
export const DOWN = 'DOWN';
export const OTHER = 'OTHER';
export const BS = 'BS';
export const ESC = 'ESC';

/**
 * @event Editor#move
 * @type {CustomEvent}
 * @prop {function} preventDefault
 * @prop {object} detail
 * @prop {number} detail.code
 */

/**
 * @event Editor#enter
 * @type {CustomEvent}
 * @prop {function} preventDefault
 */

/**
 * @event Editor#esc
 * @type {CustomEvent}
 * @prop {function} preventDefault
 */

/**
 * @event Editor#change
 * @type {CustomEvent}
 * @prop {object} detail
 * @prop {string} detail.beforeCursor
 */

/**
 * Abstract class representing a editor target.
 *
 * Editor classes must implement `#applySearchResult`, `#getCursorOffset`,
 * `#getBeforeCursor` and `#getAfterCursor` methods.
 *
 * @abstract
 * @extends EventEmitter
 */
export default class Editor extends EventEmitter {
  /**
   * @returns {this}
   */
  destroy() {
    return this;
  }

  /**
   * It is called when a search result is selected by a user.
   */
  applySearchResult(_searchResult: SearchResult) {
    throw new Error('Not implemented.');
  }

  /**
   * The input cursor's absolute coordinates from the window's left
   * top corner. It is intended to be overridden by sub classes.
   *
   * @type {Dropdown~Offset}
   */
  getCursorOffset() {
    throw new Error('Not implemented.');
  }

  /**
   * Editor string value from head to cursor.
   *
   * @private
   */
  getBeforeCursor() {
    throw new Error('Not implemented.');
  }

  /**
   * Editor string value from cursor to tail.
   *
   * @private
   */
  getAfterCursor() {
    throw new Error('Not implemented.');
  }

  /**
   * @private
   * @fires Editor#move
   * @param {UP|DOWN} code
   * @returns {Editor#move}
   */
  emitMoveEvent(code: 'UP' | 'DOWN') {
    const moveEvent = createCustomEvent('move', {
      cancelable: true,
      detail: {
        code: code,
      },
    });
    this.emit('move', moveEvent);
    return moveEvent;
  }

  /**
   * @private
   * @fires Editor#enter
   * @returns {Editor#enter}
   */
  emitEnterEvent() {
    const enterEvent = createCustomEvent('enter', { cancelable: true });
    this.emit('enter', enterEvent);
    return enterEvent;
  }

  /**
   * @private
   * @fires Editor#change
   * @returns {Editor#change}
   */
  emitChangeEvent() {
    const changeEvent = createCustomEvent('change', {
      detail: {
        beforeCursor: this.getBeforeCursor(),
      },
    });
    this.emit('change', changeEvent);
    return changeEvent;
  }

  /**
   * @private
   * @fires Editor#esc
   * @returns {Editor#esc}
   */
  emitEscEvent() {
    var escEvent = createCustomEvent('esc', { cancelable: true });
    this.emit('esc', escEvent);
    return escEvent;
  }

  /**
   * @private
   * @param {KeyboardEvent} e
   * @returns {ENTER|UP|DOWN|OTHER|BS}
   */
  getCode(e: KeyboardEvent): 'ENTER' | 'UP' | 'DOWN' | 'OTHER' | 'ESC' | 'BS' {
    return e.keyCode === 8 ? BS // backspace
         : e.keyCode === 9 ? ENTER // tab
         : e.keyCode === 13 ? ENTER // enter
         : e.keyCode === 27 ? ESC // esc
         : e.keyCode === 38 ? UP // up
         : e.keyCode === 40 ? DOWN // down
         : e.keyCode === 78 && e.ctrlKey ? DOWN // ctrl-n
         : e.keyCode === 80 && e.ctrlKey ? UP // ctrl-p
         : OTHER;
  }
}
