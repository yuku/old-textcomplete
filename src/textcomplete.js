import Completer from './completer';
import Strategy from './strategy';

export default class Textcomplete {
  /**
   * @param {HTMLTextAreaElement} el where the textcomplete works on
   */
  constructor(el) {
    this.el = el;
    this.completer = new Completer();
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
}
