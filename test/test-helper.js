import Strategy from '../src/strategy';
import SearchResult from '../src/search-result';
import Textarea from '../src/textarea';
import Query from '../src/query';
import extend from 'lodash.assignin';

/**
 * @returns {HTMLTextAreaElement}
 */
export function getHTMLTextAreaElement() {
  return document.createElement('textarea');
}

/**
 * @param {?object} props
 * @returns {Strategy}
 */
export function createStrategy(props) {
  return new Strategy(extend({
    match: /(^|\s)(\w*)$/,
    search: function (term, callback) {
      callback([term]);
    },
    replace: function (value) {
      return `$1${value.toUpperCase()} `;
    },
  }, props));
}

/**
 * @param {?object} data
 * @param {?string} term
 * @param {?object} strategyProps
 * @returns {Strategy}
 */
export function createSearchResult(data, term, strategyProps) {
  return new SearchResult(
    data || 'hello',
    term || 'he',
    createStrategy(strategyProps)
  );
}

/**
 * @returns {Textarea}
 */
export function createTextarea() {
  return new Textarea(getHTMLTextAreaElement());
}

/**
 * @param {Strategy} strategy
 * @param {string} term
 * @param {string[]} match
 * @returns {Query}
 */
export function createQuery(strategy, term, match) {
  return new Query(
    strategy || createStrategy(),
    term || 'he',
    match || ['he', 'he']
  );
}
