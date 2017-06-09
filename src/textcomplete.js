// @flow

import Completer from './completer';
import Editor from './editor';
import Dropdown from './dropdown';
import Strategy, {type Properties} from './strategy';
import SearchResult from './search_result';

import EventEmitter from 'eventemitter3';

const CALLBACK_METHODS = [
  'handleChange',
  'handleEnter',
  'handleEsc',
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
export default class Textcomplete extends EventEmitter {
  dropdown: Dropdown;
  editor: Editor;
  options: any;
  completer: Completer;
  isQueryInFlight: boolean;
  nextPendingQuery: string | null;

  /**
   * @param {Editor} editor - Where the textcomplete works on.
   * @param {Textcomplete~Options} options
   */
  constructor(editor: Editor, options: any = {}) {
    super();

    this.completer = new Completer();
    this.isQueryInFlight = false;
    this.nextPendingQuery = null;
    this.dropdown = new Dropdown(options.dropdown || {});
    this.editor = editor;
    this.options = options;

    CALLBACK_METHODS.forEach((method) => {
      (this: any)[method] = (this: any)[method].bind(this);
    });

    this.startListening();
  }

  /**
   * @public
   * @param {boolean} [destroyEditor=true]
   * @returns {this}
   */
  destroy(destroyEditor: boolean = true) {
    this.completer.destroy();
    this.dropdown.destroy();
    if (destroyEditor) {
      this.editor.destroy();
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
  register(strategyPropsArray: Properties[]) {
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
  trigger(text: string) {
    if (this.isQueryInFlight) {
      this.nextPendingQuery = text;
    } else {
      this.isQueryInFlight = true;
      this.nextPendingQuery = null;
      this.completer.run(text);
    }
    return this;
  }

  /**
   * @private
   * @param {SearchResult[]} searchResults
   * @listens Completer#hit
   */
  handleHit({ searchResults }: { searchResults: SearchResult[]; }) {
    if (searchResults.length) {
      this.dropdown.render(searchResults, this.editor.getCursorOffset());
    } else {
      this.dropdown.deactivate();
    }
    this.isQueryInFlight = false;
    if (this.nextPendingQuery !== null) {
      this.trigger(this.nextPendingQuery);
    }
  }

  /**
   * @private
   * @param {Editor#move} e
   * @listens Editor#move
   */
  handleMove(e: CustomEvent) {
    e.detail.code === 'UP' ? this.dropdown.up(e) : this.dropdown.down(e);
  }

  /**
   * @private
   * @param {Editor#enter} e
   * @listens Editor#enter
   */
  handleEnter(e: CustomEvent) {
    const activeItem = this.dropdown.getActiveItem();
    if (activeItem) {
      this.dropdown.select(activeItem);
      e.preventDefault();
    }
  }

  /**
   * @private
   * @param {Editor#esc} e
   * @listens Editor#esc
   */
  handleEsc(e: CustomEvent) {
    if (this.dropdown.shown) {
      this.dropdown.deactivate();
      e.preventDefault();
    }
  }

  /**
   * @private
   * @param {Editor#change} e
   * @listens Editor#change
   */
  handleChange(e: CustomEvent) {
    this.trigger(e.detail.beforeCursor);
  }

  /**
   * @private
   * @param {Dropdown#select} selectEvent
   * @listens Dropdown#select
   */
  handleSelect(selectEvent: CustomEvent) {
    this.emit('select', selectEvent);
    if (!selectEvent.defaultPrevented) {
      this.editor.applySearchResult(selectEvent.detail.searchResult);
    }
  }

  /**
   * @private
   */
  startListening() {
    this.editor.on('move', this.handleMove)
               .on('enter', this.handleEnter)
               .on('esc', this.handleEsc)
               .on('change', this.handleChange);
    this.dropdown.on('select', this.handleSelect);
    ['show', 'shown', 'render', 'rendered', 'selected', 'hidden', 'hide']
      .forEach(eventName => {
        this.dropdown.on(eventName, () => this.emit(eventName));
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
               .removeListener('esc', this.handleEsc)
               .removeListener('change', this.handleChange);
  }
}
