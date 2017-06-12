// @flow

import Query from './query';
import type {MatchData} from './query';

const DEFAULT_INDEX = 2;

function DEFAULT_TEMPLATE(value) {
  return value;
}

export type Properties = {
  match: RegExp | (string) => MatchData | null;
  search: Function;
  replace: (any) => string[] | string | null;
  cache?: boolean;
  context?: Function;
  template?: (any) => string;
  index?: number;
  id?: string;
}

/**
 * Properties for a strategy.
 *
 * @typedef {Object} Strategy~Properties
 * @prop {regexp|function} match - If it is a function, it must return MatchData.
 * @prop {function} search
 * @prop {function} replace
 * @prop {boolean} [cache]
 * @prop {function} [context]
 * @prop {function} [template]
 * @prop {number} [index=2]
 * @prop {string} [id]
 */

/**
 * Encapsulate a single strategy.
 *
 * @prop {Strategy~Properties} props - Its properties.
 */
export default class Strategy {
  props: Properties;
  cache: ?Object;

  /**
   * @param {Strategy~Properties} props
   */
  constructor(props: Properties) {
    this.props = props;
    this.cache = props.cache ? {} : null;
  }

  /**
   * @returns {this}
   */
  destroy() {
    this.cache = null;
    return this;
  }

  /**
   * Build a Query object by the given string if this matches to the string.
   *
   * @param {string} text - Head to input cursor.
   * @returns {?Query}
   */
  buildQuery(text: string): ?Query {
    if (typeof this.props.context === 'function') {
      const context = this.props.context(text);
      if (typeof context === 'string') {
        text = context;
      } else if (!context) {
        return null;
      }
    }
    const match = this.matchText(text);
    return match ? new Query(this, match[this.index], match) : null;
  }

  /**
   * @param {string} term
   * @param {function} callback
   * @param {MatchData} match
   */
  search(term: string, callback: Function, match: MatchData) {
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
  replace(data: any) {
    return this.props.replace(data);
  }

  /**
   * @private
   * @param {string} term
   * @param {function} callback
   * @param {MatchData} match
   */
  searchWithCache(term: string, callback: Function, match: MatchData): void {
    if (this.cache && this.cache[term]) {
      callback(this.cache[term]);
    } else {
      this.props.search(term, results => {
        if (this.cache) {
          this.cache[term] = results;
        }
        callback(results);
      }, match);
    }
  }

  /**
   * @param {string} text
   * @returns {MatchData|null}
   */
  matchText(text: string): MatchData | null {
    if (typeof this.match === 'function') {
      return this.match(text);
    } else {
      return (text.match(this.match): any);
    }
  }

  /**
   * @private
   * @returns {RegExp|Function}
   */
  get match(): $PropertyType<Properties, 'match'> {
    return this.props.match;
  }

  /**
   * @private
   * @returns {Number}
   */
  get index(): number {
    return typeof this.props.index === 'number' ? this.props.index : DEFAULT_INDEX;
  }

  /**
   * @returns {function}
   */
  get template(): (any) => string {
    return this.props.template || DEFAULT_TEMPLATE;
  }
}
