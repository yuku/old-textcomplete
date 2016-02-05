import Strategy from '../src/strategy';
import {extend} from 'lodash';

const jsdom = require('jsdom');

/**
 * @returns {HTMLTextAreaElement}
 */
export function getHTMLTextAreaElement() {
  var document = jsdom.jsdom('<textarea></textarea>');
  return document.body.firstChild;
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
