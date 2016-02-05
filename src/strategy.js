import Query from './query';

import {isFunction} from 'lodash';

/**
 * Encapsulate a single strategy.
 */
export default class Strategy {
  /**
   * @param {object} props - Attributes of the strategy.
   */
  constructor(props) {
    this.props = props;
    this.props.template || (this.props.template = function (value) { return value; });
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
   * @param {string} term
   * @param {function} callback
   * @param {string[]} match
   */
  search(term, callback, match) {
    this.props.search(term, callback, match);
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
    return this.props.match;
  }

  /**
   * @private
   * @returns {Number}
   */
  get index() {
    return this.props.index || 2;
  }

  /**
   * @returns {function}
   */
  get template() {
    return this.props.template;
  }
}
