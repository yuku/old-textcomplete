import {createCustomEvent} from './utils';

import {EventEmitter} from 'events';

export const ENTER = 0;
export const UP = 1;
export const DOWN = 2;
export const OTHER = 3;

/**
 * @event Editor#move
 * @type {CustomEvent}
 * @prop {function} preventDefault
 * @prop {object} detail
 * @prop {number} detail.code
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
   * @param {ENTER|UP|DOWN|OTHER} code
   * @returns {Editor#move}
   */
  emitMoveEvent(code) {
    var moveEvent = createCustomEvent('move', {
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
   * @fires Editor#change
   * @returns {Editor#change}
   */
  emitChangeEvent() {
    var changeEvent = createCustomEvent('change', {
      detail: {
        beforeCursor: this.getBeforeCursor(),
      },
    });
    this.emit('change', changeEvent);
    return changeEvent;
  }

  /**
   * @private
   * @param {KeyboardEvent} e
   * @returns {ENTER|UP|DOWN|OTHER}
   */
  getCode(e) {
    return e.keyCode === 9 ? ENTER // tab
         : e.keyCode === 13 ? ENTER // enter
         : e.keyCode === 38 ? UP // up
         : e.keyCode === 40 ? DOWN // down
         : e.keyCode === 78 && e.ctrlKey ? DOWN // ctrl-n
         : e.keyCode === 80 && e.ctrlKey ? UP // ctrl-p
         : OTHER;
  }
}

export default Editor;
