import {EventEmitter} from 'events';

export const ENTER = 0;
export const UP = 1;
export const DOWN = 2;

/**
 * @event Editor#move
 * @type {object}
 * @prop {number} code
 * @prop {function} callback
 */

/**
 * @event Editor#change
 * @type {object}
 * @prop {string} beforeCursor
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
}

export default Editor;
