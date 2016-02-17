import Completer from './completer';
import Dropdown from './dropdown';
import Strategy from './strategy';
import {lock} from './utils';
import {isFunction} from 'lodash';

// Query results consts
export const NO_RESULT = 0;
export const STILL_SEARCHING = 1;
export const SEARCH_COMPLETED = 2;

// Keydown consts
export const ENTER = 'enter';
export const UP = 'up';
export const DOWN = 'down';

const CALLBACK_METHODS = ['handleQueryResult'];

export default class Textcomplete {
  /**
   * @param {Editor} editor - Where the textcomplete works on.
   */
  constructor(editor) {
    this.completer = new Completer();
    this.dropdown = new Dropdown();
    this.editor = editor.registerTextcomplete(this);

    // Bind callback methods
    CALLBACK_METHODS.forEach(name => {
      this[name] = this[name].bind(this);
    });

    this.lockableTrigger = lock(function (free, text) {
      this.free = free;
      this.completer.execute(text, this.handleQueryResult);
    });
  }

  /**
   * @public
   * @param {Object[]} strategyPropsArray
   * @returns {this}
   */
  register(strategyPropsArray) {
    strategyPropsArray.forEach((props) => {
      this.completer.registerStrategy(new Strategy(props));
    });
    return this;
  }

  /**
   * Start autocompleting.
   *
   * @public
   * @param {?string} text - Head to input cursor.
   * @returns {this}
   */
  trigger(text) {
    if (text != null) {
      this.lockableTrigger(text);
    }
    return this;
  }

  /**
   * Unlock trigger method.
   *
   * @private
   * @returns {this}
   */
  unlock() {
    // Calling free function may assign a new function to `this.free`.
    // It depends on whether extra function call was made or not.
    var free = this.free;
    this.free = null;
    if (isFunction(free)) { free(); }
    return this;
  }

  /**
   * @private
   * @param {number} status
   * @param {SearchResult[]} searchResults
   */
  handleQueryResult(status, searchResults) {
    switch (status) {
    case NO_RESULT:
      this.dropdown.deactivate();
      this.unlock();
      break;
    case STILL_SEARCHING:
      this.dropdown.render(searchResults, this.editor.cursorOffset);
      break;
    case SEARCH_COMPLETED:
      this.dropdown.render(searchResults, this.editor.cursorOffset).completed();
      this.unlock();
      break;
    }
  }

  /**
   * @param {ENTER|UP|DOWN} code
   * @param {funcion} callback
   */
  handleMoveKeydown(code, callback) {
    switch (code) {
    case ENTER:
      this.dropdown.select((dropdownItem) => {
        this.handleSelect(dropdownItem);
        callback(dropdownItem);
      });
      break;
    case UP:
      this.dropdown.up(callback);
      break;
    case DOWN:
      this.dropdown.down(callback);
      break;
    }
  }

  /**
   * @param {DropdownItem} dropdownItem
   */
  handleSelect(dropdownItem) {
    this.editor.applySearchResult(dropdownItem.searchResult);
  }
}
