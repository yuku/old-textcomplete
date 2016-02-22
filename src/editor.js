import {EventEmitter} from 'events';

export const ENTER = 0;
export const UP = 1;
export const DOWN = 2;

/**
 * Abstract class representing a editor target.
 *
 * @abstract
 * @extends EventEmitter
 */
class Editor extends EventEmitter {
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
   * @event Editor#blur
   */

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
   * @type {object}
   * @prop {number} top
   * @prop {number} left
   */
  get cursorOffset() {
    throw new Error('Not implemented.');
  }
}

export default Editor;
