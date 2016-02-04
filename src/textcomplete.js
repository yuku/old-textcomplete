import Completer from './completer';
import Strategy from './strategy';
import Textarea from './textarea';

export default class Textcomplete {
  /**
   * @param {HTMLTextAreaElement} el - Where the textcomplete works on.
   */
  constructor(el) {
    this.completer = new Completer();
    this.textarea = new Textarea(el, this);
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
   * @param {string} _text - Head to input cursor.
   * @returns {this}
   */
  trigger(_text) {
    return this;
  }
}
