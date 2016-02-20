import Completer from './completer';
import Dropdown from './dropdown';
import Strategy from './strategy';
import {ENTER, UP, DOWN} from './editor';
import {lock} from './utils';
import {isFunction} from 'lodash';

const CALLBACK_METHODS = ['handleHit', 'handleMove', 'handleSelect'];

export default class Textcomplete {
  /**
   * @param {Editor} editor - Where the textcomplete works on.
   */
  constructor(editor) {
    this.completer = new Completer();
    this.dropdown = new Dropdown();
    this.editor = editor;

    // Bind callback methods
    CALLBACK_METHODS.forEach(name => {
      this[name] = this[name].bind(this);
    });

    this.lockableTrigger = lock(function (free, text) {
      this.free = free;
      this.completer.run(text);
    });

    this.startListening();
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
   * @param {string} text - Head to input cursor.
   * @returns {this}
   * @listens Editor#change
   */
  trigger(text) {
    this.lockableTrigger(text);
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
   * @param {SearchResult[]} searchResults
   * @listens Completer#hit
   */
  handleHit({searchResults}) {
    if (searchResults.length) {
      this.dropdown.render(searchResults, this.editor.cursorOffset);
    } else {
      this.dropdown.deactivate();
    }
    this.unlock();
  }

  /**
   * @private
   * @param {ENTER|UP|DOWN} code
   * @param {funcion} callback
   * @listens Editor#move
   */
  handleMove({code, callback}) {
    var method = code === ENTER ? 'selectActiveItem'
               : code === UP ? 'up'
               : code === DOWN ? 'down'
               : null;
    if (code !== null) {
      this.dropdown[method](callback);
    }
  }

  /**
   * @private
   * @param {SearchResult} searchResult
   * @listens Dropdown#select
   */
  handleSelect({searchResult}) {
    this.editor.applySearchResult(searchResult);
  }

  /**
   * @private
   */
  startListening() {
    this.editor.on('move', this.handleMove)
               .on('change', ({beforeCursor}) => { this.trigger(beforeCursor); });
    this.dropdown.on('select', this.handleSelect);
    this.completer.on('hit', this.handleHit);
  }
}
