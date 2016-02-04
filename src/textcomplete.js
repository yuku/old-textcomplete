import Completer from './completer';
import Strategy from './strategy';
import Textarea from './textarea';
import {lock} from './utils';
import {isFunction} from 'lodash';

export const NO_RESULT = 0;

const CALLBACK_METHODS = ['handleQueryResult'];

/**
 * @param {string} text - Head to input cursor.
 */
var lockableTrigger = lock(function (free, text) {
  this.free = free;
  this.completer.execute(text, this.handleQueryResult);
});

export default class Textcomplete {
  /**
   * @param {HTMLTextAreaElement} el - Where the textcomplete works on.
   */
  constructor(el) {
    this.completer = new Completer();
    this.textarea = new Textarea(el, this);

    // Bind callback methods
    CALLBACK_METHODS.forEach(name => {
      this[name] = this[name].bind(this);
    });
  }

  /**
   * @param {Object[]} strategies
   * @returns {this}
   */
  register(strategies) {
    strategies.forEach((strategy) => {
      this.completer.registerStrategy(new Strategy(strategy));
    });
    return this;
  }

  /**
   * Start autocompleting.
   *
   * @param {string} text - Head to input cursor.
   * @returns {this}
   */
  trigger(text) {
    lockableTrigger.call(this, text);
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
   */
  handleQueryResult(status) {
    switch (status) {
    case NO_RESULT:
      this.unlock();
      break;
    }
  }
}
