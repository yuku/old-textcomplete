import Query from './query';

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
   * Build a Query object by the given string if this matches to the string.
   *
   * @param {string} text - Head to input cursor.
   * @returns {?Query}
   */
  buildQuery(text) {
    var match = text.match(this.getMatchRegexp(text));
    return match ? new Query(this, match[this.index], match) : null;
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
