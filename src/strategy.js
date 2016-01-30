import {isFunction} from 'lodash';

/**
 * Encapsulate a single strategy.
 */
export default class Strategy {
  /**
   * @param {Object} strategy
   */
  constructor(strategy) {
    this.strategy = strategy;
  }

  /**
   * @param {string} text - Head to input cursor.
   * @returns {Array|false}
   */
  test(text) {
    var match = text.match(this.getMatchRegexp(text));
    return match ? { strategy: this, query: match[this.index], match: match } : false;
  }

  /**
   * @private
   * @param {string} text
   * @returns {RegExp}
   */
  getMatchRegexp(text) {
    return isFunction(this.match) ? this.match(text) : this.match;
  }

  /**
   * @private
   * @returns {RegExp|Function}
   */
  get match() {
    return this.strategy.match;
  }

  /**
   * @private
   * @returns {Number}
   */
  get index() {
    return this.strategy.index || 2;
  }
}
