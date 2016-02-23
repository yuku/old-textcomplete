import Query from './query';

import isFunction from 'lodash.isfunction';

/**
 * Encapsulate a single strategy.
 */
class Strategy {
  /**
   * @param {object} props - Attributes of the strategy.
   */
  constructor(props) {
    this.props = props;
    this.props.template || (this.props.template = function (value) { return value; });
    this.cache = props.cache ? {} : null;
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
    return this.props.index || 2;
  }

  /**
   * @returns {function}
   */
  get template() {
    return this.props.template;
  }
}

export default Strategy;
