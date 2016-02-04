const jsdom = require('jsdom');

/**
 * @returns {HTMLTextAreaElement}
 */
export function getHTMLTextAreaElement() {
  var document = jsdom.jsdom('<textarea></textarea>');
  return document.body.firstChild;
}
