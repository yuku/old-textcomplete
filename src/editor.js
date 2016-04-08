import {createCustomEvent} from './utils';

import {EventEmitter} from 'events';

export const ENTER = 0;
export const UP = 1;
export const DOWN = 2;
export const OTHER = 3;
export const BS = 4;
export const ESC = 5;

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
class Editor extends EventEmitter {
  /**
   * @returns {this}
   */
  finalize() {
    return this;
  }

  /**
   * It is called when a search result is selected by a user.
   *
   * @param {SearchResult} _searchResult
   */
  applySearchResult(_searchResult) {
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
  emitMoveEvent(code) {
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
  getCode(e) {
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

export default Editor;
