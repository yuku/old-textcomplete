import Completer from './completer';
import Dropdown from './dropdown';
import Strategy from './strategy';
import {ENTER, UP, DOWN} from './editor';
import {lock} from './utils';

import isFunction from 'lodash.isfunction';
import {EventEmitter} from 'events';

const CALLBACK_METHODS = [
  'handleBlur',
  'handleChange',
  'handleHit',
  'handleMove',
  'handleSelect',
];

/**
 * Options for a textcomplete.
 *
 * @typedef {Object} Textcomplete~Options
 * @prop {Dropdown~Options} dropdown
 */

/**
 * The core of textcomplete. It acts as a mediator.
 *
 * @prop {Completer} completer
 * @prop {Dropdown} dropdown
 * @prop {Editor} editor
 * @extends EventEmitter
 * @tutorial getting-started
 */
class Textcomplete extends EventEmitter {
  /**
   * @param {Editor} editor - Where the textcomplete works on.
   * @param {Textcomplete~Options} options
   */
  constructor(editor, options = {}) {
    super();

    this.completer = new Completer();
    this.dropdown = new Dropdown(options.dropdown || {});
    this.editor = editor;
    this.options = options;

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
   * @param {Strategy~Properties[]} strategyPropsArray
   * @returns {this}
   * @example
   * textcomplete.register([{
   *   match: /(^|\s)(\w+)$/,
   *   search: function (term, callback) {
   *     $.ajax({ ... })
   *       .done(callback)
   *       .fail([]);
   *   },
   *   replace: function (value) {
   *     return '$1' + value + ' ';
   *   }
   * }]);
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
   * @param {string} beforeCursor
   * @listens Editor#change
   */
  handleChange({beforeCursor}) {
    this.trigger(beforeCursor);
  }

  /**
   * @private
   * @listens Editor#blur
   */
  handleBlur() {
    this.dropdown.deactivate();
  }

  /**
   * @private
   * @param {SearchResult} searchResult
   * @listens Dropdown#select
   */
  handleSelect({searchResult}) {
    this.editor.applySearchResult(searchResult);
  }

  /** @event Textcomplete#show */
  /** @event Textcomplete#shown */
  /** @event Textcomplete#rendered */
  /** @event Textcomplete#hide */
  /** @event Textcomplete#hidden */

  /**
   * @private
   * @param {string} eventName
   * @returns {function}
   */
  buildHandler(eventName) {
    return () => { this.emit(eventName); };
  }

  /**
   * @private
   */
  startListening() {
    this.editor.on('move', this.handleMove)
               .on('change', this.handleChange)
               .on('blur', this.handleBlur);
    this.dropdown.on('select', this.handleSelect)
                 .on('show', this.buildHandler('show'))
                 .on('shown', this.buildHandler('shown'))
                 .on('rendered', this.buildHandler('rendered'))
                 .on('hide', this.buildHandler('hide'))
                 .on('hidden', this.buildHandler('hidden'));
    this.completer.on('hit', this.handleHit);
  }
}

export default Textcomplete;
