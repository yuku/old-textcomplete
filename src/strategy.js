import Query from './query';

import isFunction from 'lodash.isfunction';
import isString from 'lodash.isstring';

const DEFAULT_INDEX = 2;

function DEFAULT_TEMPLATE(value) {
  return value;
}

/**
 * Properties for a strategy.
 *
 * @typedef {Object} Strategy~Properties
 * @prop {regexp|function} match - If it is a function, it must return a RegExp.
 * @prop {function} search
 * @prop {function} replace
 * @prop {function} [context]
 * @prop {function} [template]
 * @prop {boolean} [cache]
 * @prop {number} [index=2]
 */

/**
 * Encapsulate a single strategy.
 *
 * @prop {Strategy~Properties} props - Its properties.
 */
class Strategy {
  /**
   * @param {Strategy~Properties} props
   */
  constructor(props) {
    this.props = props;
    this.cache = props.cache ? {} : null;
  }

  /**
   * Build a Query object by the given string if this matches to the string.
   *
   * @param {string} text - Head to input cursor.
   * @returns {?Query}
   */
  buildQuery(text) {
    if (isFunction(this.props.context)) {
      let context = this.props.context(text);
      if (isString(context)) {
        text = context;
      } else if (!context) {
        return null;
      }
    }
    var match = text.match(this.getMatchRegexp(text));
    return match ? new Query(this, match[this.index], match) : null;
  }

  /**
   * @param {string} term
   * @param {function} callback
   * @param {string[]} match
   */
  search(term, callback, match) {
    if (this.cache) {
      this.searchWithCache(term, callback, match);
    } else {
      this.props.search(term, callback, match);
    }
  }

  /**
   * @param {object} data - An element of array callbacked by search function.
   * @returns {string[]|string|null}
   */
  replace(data) {
    return this.props.replace(data);
  }

  /**
   * @private
   * @param {string} term
   * @param {function} callback
   * @param {string[]} match
   */
  searchWithCache(term, callback, match) {
    var cache = this.cache[term];
    if (cache) {
      callback(cache);
    } else {
      this.props.search(term, results => {
        this.cache[term] = results;
        callback(results);
      }, match);
    }
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
    return this.props.index || DEFAULT_INDEX;
  }

  /**
   * @returns {function}
   */
  get template() {
    return this.props.template || DEFAULT_TEMPLATE;
  }
}

export default Strategy;
