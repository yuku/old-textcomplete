import Strategy from '../src/strategy';
import {extend} from 'lodash';

/**
 * @returns {HTMLTextAreaElement}
 */
export function getHTMLTextAreaElement() {
  return document.createElement('textarea');
}

/**
 * @param {object} props
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
