import Completer from './completer';
import Dropdown from './dropdown';
import Strategy from './strategy';
import {UP} from './editor';
import {lock} from './utils';

import bindAll from 'lodash.bindall';
import isFunction from 'lodash.isfunction';
import {EventEmitter} from 'events';

const CALLBACK_METHODS = [
  'handleChange',
  'handleEnter',
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

    bindAll(this, CALLBACK_METHODS);

    this.lockableTrigger = lock(function (free, text) {
      this.free = free;
      this.completer.run(text);
    });

    this.startListening();
  }

  /**
   * @public
   * @param {boolean} [finalizeEditor=true]
   * @returns {this}
   */
  finalize(finalizeEditor = true) {
    this.completer.finalize();
    this.dropdown.finalize();
    if (finalizeEditor) {
      this.editor.finalize();
    }
    this.stopListening();
    return this;
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
    strategyPropsArray.forEach(props => {
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
      this.dropdown.render(searchResults, this.editor.getCursorOffset());
    } else {
      this.dropdown.deactivate();
    }
    this.unlock();
  }

  /**
   * @private
   * @param {Editor#move} e
   * @listens Editor#move
   */
  handleMove(e) {
    var action = e.detail.code === UP ? 'up' : 'down';
    this.dropdown[action](e);
  }

  /**
   * @private
   * @param {Editor#enter} e
   * @listens Editor#enter
   */
  handleEnter(e) {
    var activeItem = this.dropdown.getActiveItem();
    if (activeItem) {
      this.dropdown.select(activeItem);
      e.preventDefault();
    }
  }

  /**
   * @private
   * @param {Editor#change} e
   * @listens Editor#change
   */
  handleChange(e) {
    this.trigger(e.detail.beforeCursor);
  }

  /**
   * @private
   * @param {Dropdown#select} selectEvent
   * @listens Dropdown#select
   */
  handleSelect(selectEvent) {
    this.emit('select', selectEvent);
    if (!selectEvent.defaultPrevented) {
      this.editor.applySearchResult(selectEvent.detail.searchResult);
    }
  }

  /**
   * @private
   * @param {string} eventName
   * @returns {function}
   */
  buildHandler(eventName) {
    return () => this.emit(eventName);
  }

  /**
   * @private
   */
  startListening() {
    this.editor.on('move', this.handleMove)
               .on('enter', this.handleEnter)
               .on('change', this.handleChange);
    this.dropdown.on('select', this.handleSelect);
    ['show', 'shown', 'render', 'rendered', 'selected', 'hidden', 'hide'].forEach(eventName => {
      this.dropdown.on(eventName, this.buildHandler(eventName));
    });
    this.completer.on('hit', this.handleHit);
  }

  /**
   * @private
   */
  stopListening() {
    this.completer.removeAllListeners();
    this.dropdown.removeAllListeners();
    this.editor.removeListener('move', this.handleMove)
               .removeListener('enter', this.handleEnter)
               .removeListener('change', this.handleChange);
  }
}

export default Textcomplete;
